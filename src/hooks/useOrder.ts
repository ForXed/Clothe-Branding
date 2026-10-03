import { useCallback, useEffect, useRef, useState } from "react";
import {
  orderService,
  ApiOrder,
  DisputeInput,
  DeliverPayload,
} from "../services/orderService";
import { Brief, Escrow, Maker, ProductionOrder } from "../data/mockTransform";
import { briefService } from "../services/briefService";
import { makerService } from "../services/makerService";
import { getErrorMessage, getErrorStatus } from "../utils/apiError";

// export type DataSource = "mock" | "api";
export type OrderAction =
  | "pay"
  | "cancel"
  | "startProduction"
  | "deliver"
  | "confirm"
  | "dispute";
export type ActionResult = { ok: true } | { ok: false; message: string };

/** What the page renders: your existing ProductionOrder plus the extras the spec can supply. */
export type OrderView = ProductionOrder & {
  description?: string;
  imageUrl?: string;
  deliveredAt?: string | null;
};

/* ------------------------------ mock data ------------------------------ */

const MOCK_ORDER: OrderView = {
  id: "ord_005",
  quoteId: "quo_006",
  briefId: "brf_005",
  makerName: "Abuja Studio",
  garmentType: "Technical Windbreaker",
  quantity: 25,
  totalAmountNgn: 2100000,
  status: "IN_ESCROW",
  escrow: {
    id: "esc_005",
    orderId: "ord_005",
    status: "HELD",
    amountNgn: 2100000,
    platformFeeNgn: 210000,
    makerPayoutNgn: 1890000,
  },
  expectedDelivery: "2026-12-05",
  createdAt: "2026-09-01T13:00:00Z",
  description: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.",
  imageUrl:
    "https://i.animepahe.pw/uploads/posters/f3e/f3e7edb725783cd2f4bcc0deabc82c757214f3f0aa529c78f8a337a809316da1.th.webp",
  deliveredAt: null,
};

const freshMock = (): OrderView => ({
  ...MOCK_ORDER,
  escrow: { ...MOCK_ORDER.escrow },
});

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ------------------------- API -> view model ------------------------- */

const toOrderView = (
  order: ApiOrder,
  escrow: Escrow,
  brief?: Brief,
  maker?: Maker,
): OrderView =>
  ({
    id: order.id,
    quoteId: order.quoteId,
    briefId: order.briefId,
    makerName: maker?.name ?? "Unknown maker",
    garmentType: brief?.garmentType ?? "Garment",
    quantity: brief?.quantity ?? 0,
    totalAmountNgn: escrow.amountNgn,
    status: order.status,
    escrow: {
      id: escrow.id,
      orderId: escrow.orderId,
      status: escrow.status,
      amountNgn: escrow.amountNgn,
      platformFeeNgn: escrow.platformFeeNgn,
      makerPayoutNgn: escrow.makerPayoutNgn,
    },
    expectedDelivery: brief?.deadline ?? "",
    createdAt: order.createdAt,
    description: brief?.description,
    imageUrl: brief?.referenceImages?.[0],
    deliveredAt: order.deliveredAt,
  }) as OrderView;

async function fetchOrderView(
  id: string,
): Promise<{ order: OrderView; warning: string | null }> {
  // The order and its escrow are essential: if either fails, the whole load fails.
  const [order, escrow] = await Promise.all([
    orderService.getOrderById(id),
    orderService.getEscrow(id),
  ]);

  // Brief and maker only add display detail, so one failing shouldn't block the page.
  const [brief, maker] = await Promise.allSettled([
    briefService.getBrief(order.briefId),
    makerService.getMakerById(order.makerId),
  ]);

  const missing: string[] = [];
  if (brief.status === "rejected") missing.push("brief details");
  if (maker.status === "rejected") missing.push("maker name");

  return {
    order: toOrderView(
      order,
      escrow,
      brief.status === "fulfilled" ? brief.value : undefined,
      maker.status === "fulfilled" ? maker.value : undefined,
    ),
    warning: missing.length
      ? `Some details couldn't be loaded (${missing.join(", ")}).`
      : null,
  };
}

/* -------------------------------- hook -------------------------------- */

export function useOrder(orderId: string | undefined, source: DataSource) {
  const [order, setOrder] = useState<OrderView | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<OrderAction | null>(null);

  const requestId = useRef(0); // ignores responses from stale requests
  const busy = useRef(false); // blocks double-submits

  const load = useCallback(
    async (opts?: { silent?: boolean }) => {
      const current = ++requestId.current;
      if (!opts?.silent) {
        setLoading(true);
        setLoadError(null);
        setWarning(null);
        setOrder(null); // never show the other source's data while switching
      }

      try {
        if (source === "mock") {
          await sleep(300);
          if (current !== requestId.current) return;
          setOrder(freshMock());
        } else {
          if (!orderId) throw new Error("No order id in the URL.");
          const result = await fetchOrderView(orderId);
          if (current !== requestId.current) return;
          setOrder(result.order);
          setWarning(result.warning);
        }
      } catch (err) {
        if (current !== requestId.current) return;
        const message = getErrorMessage(err, "Couldn't load this order.");
        if (opts?.silent) {
          setWarning(
            `Your change went through, but the page couldn't refresh: ${message}`,
          );
        } else {
          setLoadError(message);
        }
      } finally {
        if (current === requestId.current) setLoading(false);
      }
    },
    [orderId, source],
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
      apiCall: () => Promise<void>,
      mockNext: (o: OrderView) => OrderView,
    ): Promise<ActionResult> => {
      if (busy.current) {
        return { ok: false, message: "Another action is still in progress." };
      }
      busy.current = true;
      setPendingAction(action);
      try {
        if (source === "mock") {
          await sleep(400);
          setOrder((prev) => (prev ? mockNext(prev) : prev));
        } else {
          await apiCall();
          // Response bodies are mostly undocumented, so refetch instead of trusting them
          await load({ silent: true });
        }
        return { ok: true };
      } catch (err) {
        // 409 means our copy is out of date, so resync it
        if (source === "api" && getErrorStatus(err) === 409) {
          void load({ silent: true });
        }
        return { ok: false, message: getErrorMessage(err) };
      } finally {
        busy.current = false;
        setPendingAction(null);
      }
    },
    [source, load],
  );

  const requireId = () => {
    if (!orderId) throw new Error("No order id in the URL.");
    return orderId;
  };

  const actions = {
    pay: () =>
      run(
        "pay",
        () => orderService.payOrder(requireId()),
        (o) => ({
          ...o,
          status: "IN_ESCROW",
          escrow: { ...o.escrow, status: "HELD" },
        }),
      ),
    cancel: () =>
      run(
        "cancel",
        () => orderService.cancelOrder(requireId()),
        (o) => ({ ...o, status: "CANCELLED" }),
      ),
    startProduction: () =>
      run(
        "startProduction",
        () => orderService.startProduction(requireId()),
        (o) => ({ ...o, status: "IN_PRODUCTION" }),
      ),
    deliver: (payload: DeliverPayload) =>
      run(
        "deliver",
        () => orderService.deliverOrder(requireId(), payload),
        (o) => ({
          ...o,
          status: "DELIVERED",
          deliveredAt: new Date().toISOString(),
        }),
      ),
    confirm: () =>
      run(
        "confirm",
        () => orderService.confirmOrder(requireId()),
        (o) => ({
          ...o,
          status: "COMPLETED",
          escrow: { ...o.escrow, status: "RELEASED" },
        }),
      ),
    dispute: (input: DisputeInput) =>
      run(
        "dispute",
        () => orderService.disputeOrder(requireId(), input),
        (o) => ({ ...o, status: "DISPUTED" }),
      ),
  };

  return {
    order,
    loading,
    loadError,
    warning,
    pendingAction,
    reload: () => load(),
    actions,
  };
}
