// src/types/admin.ts
// What the admin surface actually gets from the API (v1.3).
//
// The backend exposes exactly three admin writes and two admin reads:
//   GET  /api/v1/admin/orders                  (paged, optional ?status)
//   GET  /api/v1/admin/makers/pending          (paged)
//   POST /api/v1/admin/orders/{orderId}/resolve
//   PATCH /api/v1/makers/{makerId}/verify
//   PATCH /api/v1/makers/{makerId}/reject
// There is no users list and no arbitrary maker-status query; a dispute is
// simply an order in DISPUTED whose reason lives in the order's event trail.
// Anything a screen cannot get from those calls is marked unavailable in the UI
// rather than invented here.

import type { CurrentUser } from "./auth";
import type { ProductionOrder } from "./order";
import type { VerificationStatus } from "./maker";

/* ------------------------------------------------------------------ */
/* Maker review                                                        */
/* ------------------------------------------------------------------ */

/** GET /admin/makers/pending — the reviewer sees the applicant's contact email. */
export interface PendingMaker {
  id: string;
  brandName: string;
  userEmail: string;
  location?: string | null;
  leadTimeDays?: number | null;
  minBatch?: number | null;
  maxBatch?: number | null;
  specializations: string[];
}

export type VerifyMakerInput = {
  status: Extract<VerificationStatus, "VERIFIED" | "REJECTED">;
  /** Required when status === "REJECTED". */
  rejectionNote?: string;
};

/* ------------------------------------------------------------------ */
/* Order / dispute review                                              */
/* ------------------------------------------------------------------ */

export type ResolutionAction = "RELEASE" | "REFUND";

export interface ResolveOrderInput {
  resolution: ResolutionAction;
  /** Visible to both parties in the order trail. */
  note: string;
}

/** A DISPUTED order plus the reason its opener recorded. */
export interface DisputeRecord {
  order: ProductionOrder;
  /** From the DISPUTE_OPENED event note ("category: explanation"). */
  reason: string;
  raisedAt: string | null;
  raisedBy: string | null;
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

/**
 * Counts only: escrow totals are not exposed by the API yet, so the dashboard
 * shows what it can count and says so instead of printing zeroes.
 */
export interface AdminDashboardStats {
  byStatus: Record<string, number>;
  totalOrders: number;
  pendingMakers: number;
  /** True when the order count exceeded one page, so the totals are a sample. */
  sampled: boolean;
}

/* ------------------------------------------------------------------ */
/* Session + action result                                             */
/* ------------------------------------------------------------------ */

/** The admin guard reads the same /me payload as the rest of the app. */
export type AdminUser = CurrentUser;

export type AdminActionResult =
  | { ok: true; data?: unknown }
  | { ok: false; message: string };
