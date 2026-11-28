// src/hooks/useAdminDashboard.ts
// Loads dashboard stats. Falls back to client-side computation
// if GET /admin/stats does not exist.

import { useCallback, useEffect, useRef, useState } from "react";
import { adminService } from "../services/adminService";
import { getErrorMessage } from "../utils/apiError";
import type { AdminDashboardStats } from "../types/admin";

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  const fetchStats = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.getDashboardStats();
      if (current !== requestId.current) return;
      setStats(data);
    } catch (err) {
      if (current !== requestId.current) return;
      setError(getErrorMessage(err, "Failed to load dashboard stats."));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
    return () => {
      requestId.current += 1;
    };
  }, [fetchStats]);

  return { stats, loading, error, refetch: () => void fetchStats() };
}