import { useCallback, useEffect, useRef, useState } from 'react';
import dashboardService from '../services/dashboardService';
import { orderService } from '../services/orderService';
import { makerService } from '../services/makerService';
import type { MakerDashboard } from '../types/dashboard';
import type { ApiOrder } from '../types/order';
import type { MakerProfile } from '../types/maker';

/**
 * The maker studio home reads three real endpoints:
 *
 *  - GET /api/v1/dashboard/maker  -> incoming briefs, quotes waiting, orders by status
 *  - GET /api/v1/orders           -> the orders themselves (lean rows)
 *  - GET /api/v1/makers/me        -> brand name and verification state
 *
 * There is no revenue, sales-velocity or visitor series anywhere in the API, so
 * nothing here invents one.
 */
export interface MakerStudioState {
  dashboard: MakerDashboard | null;
  orders: ApiOrder[];
  maker: MakerProfile | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useMakerStudio(): MakerStudioState {
  const [dashboard, setDashboard] = useState<MakerDashboard | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [maker, setMaker] = useState<MakerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    const id = ++requestId.current;
    let cancelled = false;

    setLoading(true);
    setError(null);

    void (async () => {
      const [dashboardResult, ordersResult, makerResult] = await Promise.allSettled([
        dashboardService.getMakerDashboard(),
        orderService.listOrders({ page: 0, size: 20 }),
        makerService.getMyProfile(),
      ]);

      if (cancelled || id !== requestId.current) return;

      if (dashboardResult.status === 'fulfilled') {
        setDashboard(dashboardResult.value);
      } else {
        setDashboard(null);
      }

      if (ordersResult.status === 'fulfilled') {
        setOrders(ordersResult.value.content ?? []);
      } else {
        setOrders([]);
      }

      if (makerResult.status === 'fulfilled') {
        setMaker(makerResult.value);
      } else {
        setMaker(null);
      }

      // Only the dashboard is load-bearing for the home screen; the rest degrade.
      if (dashboardResult.status === 'rejected') {
        const reason = dashboardResult.reason as { message?: string } | undefined;
        setError(reason?.message ?? 'Could not load your studio overview.');
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { dashboard, orders, maker, loading, error, reload };
}

export default useMakerStudio;
