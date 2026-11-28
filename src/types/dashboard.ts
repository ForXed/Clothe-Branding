// Counts the API computes for the two home screens.
//
// GET /api/v1/dashboard/buyer and GET /api/v1/dashboard/maker. Both are plain
// status -> count maps: there is no revenue, no time series and no visitor data
// on the API, so the studio home must not pretend otherwise.

export interface BuyerDashboard {
  briefsByStatus: Record<string, number>;
  ordersByStatus: Record<string, number>;
}

export interface MakerDashboard {
  /** Briefs addressed to this maker that have not been quoted yet. */
  incomingBriefsCount: number;
  /** This maker's quotes still waiting on the buyer. */
  activeQuotesCount: number;
  ordersByStatus: Record<string, number>;
}

/** Statuses the maker home cares about, in lifecycle order. */
export const MAKER_ORDER_STATUSES = [
  'AWAITING_PAYMENT',
  'IN_ESCROW',
  'IN_PRODUCTION',
  'DELIVERED',
  'COMPLETED',
  'DISPUTED',
  'CANCELLED',
] as const;

/** Sum of counts for a set of statuses. */
export function countOf(
  byStatus: Record<string, number> | undefined,
  ...statuses: string[]
): number {
  if (!byStatus) return 0;
  return statuses.reduce((total, status) => total + (byStatus[status] ?? 0), 0);
}
