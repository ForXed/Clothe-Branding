// src/hooks/useAdminMakers.ts
// The v1 review surface is the pending queue: GET /admin/makers/pending.
// Approve/reject then PATCH the maker and refetch.

import { useCallback, useEffect, useRef, useState } from "react";
import { adminService } from "../services/adminService";
import { getErrorMessage, getErrorStatus } from "../utils/apiError";
import type {
  AdminActionResult,
  PendingMaker,
  VerifyMakerInput,
} from "../types/admin";

export function useAdminMakers() {
  const [makers, setMakers] = useState<PendingMaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const requestId = useRef(0);
  const busy = useRef(false);

  const fetchMakers = useCallback(async (opts?: { silent?: boolean }) => {
    const current = ++requestId.current;
    if (!opts?.silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const page = await adminService.listPendingMakers({ size: 100 });
      if (current !== requestId.current) return;
      setMakers(page.content);
      setError(null);
    } catch (err) {
      if (current !== requestId.current) return;
      setError(getErrorMessage(err, "Failed to load the pending queue."));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMakers();
    return () => {
      requestId.current += 1;
    };
  }, [fetchMakers]);

  const verifyMaker = useCallback(
    async (
      id: string,
      input: VerifyMakerInput,
    ): Promise<AdminActionResult> => {
      if (busy.current) {
        return { ok: false, message: "Another action is in progress." };
      }
      busy.current = true;
      setPendingId(id);
      setError(null);

      try {
        await adminService.decideMaker(id, input);
        // A decided maker leaves the queue, so refetch rather than patch a row.
        await fetchMakers({ silent: true });
        return { ok: true };
      } catch (err) {
        const status = getErrorStatus(err);
        // 409 = already decided by someone else.
        if (status === 409) {
          await fetchMakers({ silent: true });
        }
        return { ok: false, message: getErrorMessage(err) };
      } finally {
        busy.current = false;
        setPendingId(null);
      }
    },
    [fetchMakers],
  );

  return {
    makers,
    loading,
    error,
    pendingId,
    refetch: () => void fetchMakers(),
    verifyMaker,
  };
}
