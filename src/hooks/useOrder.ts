import { useCallback, useEffect, useRef, useState } from "react";
import {
  orderService,
  ApiOrder,
  DisputeInput,
  DeliverPayload,
} from "../services/orderService";
import { getErrorMessage, getErrorStatus } from "../utils/apiError";
import { ProductionOrder } from "../types/order";

// export type DataSource = "mock" | "api";
export type OrderAction =
  | "cancel"
  | "startProduction"
  | "deliver"
  | "confirm"
  | "dispute";
export type ActionResult = { ok: true } | { ok: false; message: string };

/* ------------------------- API -> view model ------------------------- */

async function fetchOrderView(id: string): Promise<{ order: ProductionOrder }> {
  // The order and its escrow are essential: if either fails, the whole load fails.
  const order = await orderService.getOrderById(id);
  return { order };
}

/* -------------------------------- hook -------------------------------- */

export function useOrder(orderId: string | undefined) {
  const [order, setOrder] = useState<ProductionOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<OrderAction | null>(null);

  const requestId = useRef(0); // ignores responses from stale requests
  const busy = useRef(false); // blocks double-submits

  const load = useCallback(
    async (opts?: { silent?: boolean }) => {
      const current = ++requestId.current;
      if (!opts?.silent) {
        setLoading(true);
        setLoadError(null);
        setOrder(null); // never show the other source's data while switching
      }

      try {
        if (!orderId) throw new Error("No order id in the URL.");
        const result = await fetchOrderView(orderId);
        if (current !== requestId.current) return;
        setOrder(result.order);
      } catch (err) {
        if (current !== requestId.current) return;
        const message = getErrorMessage(err, "Couldn't load this order.");

        setLoadError(message);
      } finally {
        if (current === requestId.current) setLoading(false);
      }
    },
    [orderId],
  );

  useEffect(() => {
    void load();
    return () => {
      requestId.current += 1; // cancel in-flight work on unmount / source change
    };
  }, [load]);

  const run = useCallback(
    async (
      action: OrderAction,
      apiCall: () => Promise<void | ApiOrder>,
    ): Promise<ActionResult> => {
      if (busy.current) {
        return { ok: false, message: "Another action is still in progress." };
      }

      busy.current = true;

      setPendingAction(action);

      try {
        await apiCall();
        // Response bodies are mostly undocumented, so refetch instead of trusting them
        await load({ silent: true });
        return { ok: true };
      } catch (err) {
        // 409 means our copy is out of date, so resync it
        if (getErrorStatus(err) === 409) {
          void load({ silent: true });
        }
        return { ok: false, message: getErrorMessage(err) };
      } finally {
        busy.current = false;
        setPendingAction(null);
      }
    },
    [load],
  );

  const requireId = () => {
    if (!orderId) throw new Error("No order id in the URL.");
    return orderId;
  };

  const actions = {
    cancel: () => run("cancel", () => orderService.cancelOrder(requireId())),
    startProduction: () =>
      run("startProduction", () => orderService.startProduction(requireId())),

    deliver: (payload: DeliverPayload) =>
      run(
        "deliver",
        (): Promise<ApiOrder> =>
          orderService.deliverOrder(requireId(), payload),
      ),

    confirm: () => run("confirm", () => orderService.confirmOrder(requireId())),

    dispute: (input: DisputeInput) =>
      run("dispute", () => orderService.disputeOrder(requireId(), input)),
  };

  return {
    order,
    loading,
    loadError,
    pendingAction,
    reload: () => load(),
    actions,
  };
}
