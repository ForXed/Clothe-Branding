// src/hooks/useAdminDisputes.ts
// Fetches dispute queue and resolves individual disputes.

import { useCallback, useEffect, useRef, useState } from "react";
import { adminService } from "../services/adminService";
import { getErrorMessage, getErrorStatus } from "../utils/apiError";
import type {
  DisputeRecord,
  ResolveDisputeInput,
  AdminActionResult,
} from "../types/admin";

export function useAdminDisputes() {
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const requestId = useRef(0);
  const busy = useRef(false);

  const fetchDisputes = useCallback(
    async (opts?: { silent?: boolean }) => {
      const current = ++requestId.current;
      if (!opts?.silent) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await adminService.getDisputes();
        if (current !== requestId.current) return;
        setDisputes(data);
        setError(null);
      } catch (err) {
        if (current !== requestId.current) return;
        setError(getErrorMessage(err, "Failed to load disputes."));
      } finally {
        if (current === requestId.current) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchDisputes();
    return () => {
      requestId.current += 1;
    };
  }, [fetchDisputes]);

  const resolveDispute = useCallback(
    async (
      orderId: string,
      input: ResolveDisputeInput,
    ): Promise<AdminActionResult> => {
      if (busy.current) {
        return { ok: false, message: "Another action is in progress." };
      }
      busy.current = true;
      setPendingId(orderId);
      setError(null);

      try {
        await adminService.resolveDispute(orderId, input);
        await fetchDisputes({ silent: true });
        return { ok: true };
      } catch (err) {
        const status = getErrorStatus(err);
        if (status === 409) {
          // Dispute already resolved or order state changed
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