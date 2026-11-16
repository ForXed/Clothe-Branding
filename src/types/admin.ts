// src/types/admin.ts
// Admin-specific types for Brutige v1.
// All admin endpoints below are ASSUMED until confirmed with backend.
// ⚠️ CONFIRM each endpoint path before shipping.

import type { AuthUser } from "./auth";
import type { Maker, VerificationStatus } from "./maker";
import type { ProductionOrder, OrderStatus } from "./order";
import type { EscrowStatus } from "./escrow";

/* ------------------------------------------------------------------ */
/* Admin user                                                          */
/* ------------------------------------------------------------------ */

export interface AdminUser extends AuthUser {
  /** Must include "ADMIN" in roles for access. ⚠️ CONFIRM role value. */
  roles: string[];
}

/* ------------------------------------------------------------------ */
/* Maker review (admin-side)                                           */
/* ------------------------------------------------------------------ */

export interface MakerReviewQueue {
  pending: Maker[];
  verified: Maker[];
  rejected: Maker[];
}

export interface VerifyMakerInput {
  status: Extract<VerificationStatus, "VERIFIED" | "REJECTED">;
  rejectionNote?: string; // required when status === "REJECTED"
}

export interface VerifyMakerResult {
  id: string;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  rejectionNote: string | null;
}

/* ------------------------------------------------------------------ */
/* Dispute review (admin-side)                                         */
/* ------------------------------------------------------------------ */

export interface DisputeRecord {
  orderId: string;
  order: ProductionOrder;
  reasonCategory: string;
  explanation: string;
  raisedBy: "BUYER" | "MAKER"; // ⚠️ CONFIRM who can raise disputes
  raisedAt: string;
  status: DisputeStatus;
  resolutionNote?: string | null;
  resolvedAt?: string | null;
  resolvedBy?: string | null; // admin user id
}

export type DisputeStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "RESOLVED_RELEASED"
  | "RESOLVED_REFUNDED"
  | "RESOLVED_PARTIAL"
  | "ESCALATED";

export interface ResolveDisputeInput {
  action: "RELEASE_TO_MAKER" | "REFUND_TO_BRAND" | "PARTIAL";
  /** Required when action === "PARTIAL". Must sum to escrow.amountNgn. */
  releaseAmountNgn?: number;
  refundAmountNgn?: number;
  resolutionNote: string; // visible to both parties
}

export interface ResolveDisputeResult {
  orderId: string;
  disputeStatus: DisputeStatus;
  escrowStatus: EscrowStatus;
  resolvedAt: string;
}

/* ------------------------------------------------------------------ */
/* User management (admin-side)                                        */
/* ------------------------------------------------------------------ */

export type UserAccountStatus = "ACTIVE" | "SUSPENDED" | "TERMINATED";

export interface AdminUserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  accountStatus: UserAccountStatus;
  createdAt: string;
  /** Present if the user is a maker. */
  makerId?: string;
  makerVerificationStatus?: VerificationStatus;
}

export interface SuspendUserInput {
  reason: string;
  duration?: "PERMANENT" | "TEMPORARY"; // ⚠️ CONFIRM if temp suspensions exist
  expiresAt?: string; // ISO date, required when duration === "TEMPORARY"
}

/* ------------------------------------------------------------------ */
/* Dashboard stats                                                     */
/* ------------------------------------------------------------------ */

export interface AdminDashboardStats {
  pendingMakers: number;
  verifiedMakers: number;
  rejectedMakers: number;
  openDisputes: number;
  activeOrders: number; // IN_ESCROW + IN_PRODUCTION + DELIVERED
  completedOrders: number;
  cancelledOrders: number;
  totalEscrowHeldNgn: number;
  totalFeesEarnedNgn: number;
}

/* ------------------------------------------------------------------ */
/* Admin action result (mirrors ActionResult pattern)                  */
/* ------------------------------------------------------------------ */

export type AdminActionResult =
  | { ok: true; data?: unknown }
  | { ok: false; message: string };