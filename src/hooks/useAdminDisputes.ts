// src/hooks/useAdminDisputes.ts
// A dispute is an order in DISPUTED: the queue is GET /admin/orders?status=DISPUTED
// and resolving posts the admin resolution (RELEASE or REFUND).

import { useCallback, useEffect, useRef, useState } from "react";
import { adminService } from "../services/adminService";
import { getErrorMessage, getErrorStatus } from "../utils/apiError";
import type {
  AdminActionResult,
  ResolveOrderInput,
} from "../types/admin";
import type { ProductionOrder } from "../types/order";

export function useAdminDisputes() {
  const [disputes, setDisputes] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const requestId = useRef(0);
  const busy = useRef(false);

  const fetchDisputes = useCallback(async (opts?: { silent?: boolean }) => {
    const current = ++requestId.current;
    if (!opts?.silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const page = await adminService.listDisputes({ size: 100 });
      if (current !== requestId.current) return;
      setDisputes(page.content);
      setError(null);
    } catch (err) {
      if (current !== requestId.current) return;
      setError(getErrorMessage(err, "Failed to load disputes."));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDisputes();
    return () => {
      requestId.current += 1;
    };
  }, [fetchDisputes]);

  const resolveDispute = useCallback(
    async (
      orderId: string,
      input: ResolveOrderInput,
    ): Promise<AdminActionResult> => {
      if (busy.current) {
        return { ok: false, message: "Another action is in progress." };
      }
      busy.current = true;
      setPendingId(orderId);
      setError(null);

      try {
        await adminService.resolveOrder(orderId, input);
        // The order leaves DISPUTED, so refetch the queue.
        await fetchDisputes({ silent: true });
        return { ok: true };
      } catch (err) {
        const status = getErrorStatus(err);
        // 409 = already resolved, or the escrow is not HELD any more.
        if (status === 409) {
          await fetchDisputes({ silent: true });
        }
        return { ok: false, message: getErrorMessage(err) };
      } finally {
        busy.current = false;
        setPendingId(null);
      }
    },
    [fetchDisputes],
  );

  return {
    disputes,
    loading,
    error,
    pendingId,
    refetch: () => void fetchDisputes(),
    resolveDispute,
  };
}
