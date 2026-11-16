// src/hooks/useAdminMakers.ts
// Fetches and mutates the maker verification queue.
// Same requestId + busy pattern as useOrder.

import { useCallback, useEffect, useRef, useState } from "react";
import { adminService } from "../services/adminService";
import { getErrorMessage, getErrorStatus } from "../utils/apiError";
import type { Maker, VerificationStatus } from "../types/maker";
import type { VerifyMakerInput, AdminActionResult } from "../types/admin";

export function useAdminMakers(initialStatus?: VerificationStatus) {
  const [makers, setMakers] = useState<Maker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const requestId = useRef(0);
  const busy = useRef(false);

  const fetchMakers = useCallback(
    async (status?: VerificationStatus, opts?: { silent?: boolean }) => {
      const current = ++requestId.current;
      if (!opts?.silent) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await adminService.getMakersByStatus(status);
        if (current !== requestId.current) return;
        setMakers(data);
        setError(null);
      } catch (err) {
        if (current !== requestId.current) return;
        setError(getErrorMessage(err, "Failed to load makers."));
      } finally {
        if (current === requestId.current) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchMakers(initialStatus);
    return () => {
      requestId.current += 1;
    };
  }, [fetchMakers, initialStatus]);

  const verifyMaker = useCallback(
    async (id: string, input: VerifyMakerInput): Promise<AdminActionResult> => {
      if (busy.current) {
        return { ok: false, message: "Another action is in progress." };
      }
      busy.current = true;
      setPendingId(id);
      setError(null);

      try {
        await adminService.verifyMaker(id, input);
        // Refetch silently so the list reflects the new status.
        await fetchMakers(initialStatus, { silent: true });
        return { ok: true };
      } catch (err) {
        const status = getErrorStatus(err);
        // 409 = maker already processed or state changed
        if (status === 409) {
          await fetchMakers(initialStatus, { silent: true });
        }
        return { ok: false, message: getErrorMessage(err) };
      } finally {
        busy.current = false;
        setPendingId(null);
      }
    },
    [fetchMakers, initialStatus],
  );

  return {
    makers,
    loading,
    error,
    pendingId,
    refetch: () => void fetchMakers(initialStatus),
    verifyMaker,
  };
}