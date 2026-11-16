// src/services/adminService.ts
// All /admin/* endpoints below are ASSUMED.
// ⚠️ CONFIRM each path + method + body shape with backend before shipping.
// If the backend reuses existing endpoints with an admin token instead of
// dedicated /admin/* routes, swap the paths accordingly.

import apiClient from "./apiClient";
import type {
  Maker,
  VerificationStatus,
} from "../types/maker";
import type {
  AdminUser,
  VerifyMakerInput,
  VerifyMakerResult,
  DisputeRecord,
  ResolveDisputeInput,
  ResolveDisputeResult,
  AdminUserSummary,
  SuspendUserInput,
  AdminDashboardStats,
} from "../types/admin";
import type { ProductionOrder } from "../types/order";

export const adminService = {
  /* ---------------------------------------------------------------- */
  /* Auth / session                                                    */
  /* ---------------------------------------------------------------- */

  /**
   * GET /authentication/me
   * Returns the current authenticated user including roles.
   * ⚠️ CONFIRM this endpoint exists and returns roles: string[].
   * If it does not exist, the backend must expose a session/me route
   * that includes the role array, otherwise the admin guard cannot work.
   */
  async getCurrentAdmin(): Promise<AdminUser> {
    const res = await apiClient.get<AdminUser>("/authentication/me");
    return res.data;
  },

  /* ---------------------------------------------------------------- */
  /* Maker verification                                                */
  /* ---------------------------------------------------------------- */

  /**
   * GET /admin/makers?status=PENDING
   * ⚠️ CONFIRM endpoint. May alternatively be GET /makers with an
   * admin-scoped token and a status query param.
   */
  async getMakersByStatus(status?: VerificationStatus): Promise<Maker[]> {
    const res = await apiClient.get("/admin/makers", {
      params: status ? { status } : undefined,
    });
    const data = res.data;
    return Array.isArray(data) ? data : (data.makers ?? []);
  },

  /**
 * GET /admin/makers/{id}
 * ⚠️ CONFIRM endpoint. May alternatively be GET /makers/{id}
 * with an admin-scoped token.
 */
async getMakerById(id: string): Promise<Maker> {
  const res = await apiClient.get<Maker>(`/admin/makers/${id}`);
  return res.data;
},

  /**
   * PATCH /admin/makers/{id}/verify
   * Body: { status: "VERIFIED" | "REJECTED", rejectionNote?: string }
   * ⚠️ CONFIRM endpoint + method (PATCH vs POST).
   */
  async verifyMaker(id: string, input: VerifyMakerInput): Promise<VerifyMakerResult> {
    const res = await apiClient.patch<VerifyMakerResult>(
      `/admin/makers/${id}/verify`,
      input,
    );
    return res.data;
  },

  /* ---------------------------------------------------------------- */
  /* Dispute review                                                    */
  /* ---------------------------------------------------------------- */

  /**
   * GET /admin/disputes
   * Returns orders with status DISPUTED + dispute metadata.
   * ⚠️ CONFIRM endpoint. May alternatively be GET /orders?status=DISPUTED
   * with dispute details embedded or fetched per-order.
   */
  async getDisputes(): Promise<DisputeRecord[]> {
    const res = await apiClient.get("/admin/disputes");
    const data = res.data;
    return Array.isArray(data) ? data : (data.disputes ?? []);
  },

  /**
   * GET /admin/disputes/{orderId}
   * Single dispute detail with full order + evidence.
   * ⚠️ CONFIRM endpoint.
   */
  async getDisputeDetail(orderId: string): Promise<DisputeRecord> {
    const res = await apiClient.get<DisputeRecord>(
      `/admin/disputes/${orderId}`,
    );
    return res.data;
  },

  /**
   * POST /admin/disputes/{orderId}/resolve
   * Body: ResolveDisputeInput
   * ⚠️ CONFIRM endpoint + whether this triggers escrow release/refund
   * via Payment Partner or just updates internal status.
   */
  async resolveDispute(
    orderId: string,
    input: ResolveDisputeInput,
  ): Promise<ResolveDisputeResult> {
    const res = await apiClient.post<ResolveDisputeResult>(
      `/admin/disputes/${orderId}/resolve`,
      input,
    );
    return res.data;
  },

  /**
 * PATCH /admin/disputes/{orderId}/status
 * Body: { status: DisputeStatus }
 * Used for OPEN → UNDER_REVIEW and UNDER_REVIEW → ESCALATED transitions.
 * ⚠️ CONFIRM endpoint. May alternatively be handled inside resolveDispute.
 */
async updateDisputeStatus(
  orderId: string,
  status: "UNDER_REVIEW" | "ESCALATED",
): Promise<void> {
  await apiClient.patch(`/admin/disputes/${orderId}/status`, { status });
},

  /* ---------------------------------------------------------------- */
  /* Orders (read-only monitoring)                                     */
  /* ---------------------------------------------------------------- */

  /**
   * GET /admin/orders?status=...
   * ⚠️ CONFIRM endpoint. May reuse GET /orders with admin scope.
   */
  async getOrders(status?: string): Promise<ProductionOrder[]> {
    const res = await apiClient.get("/admin/orders", {
      params: status ? { status } : undefined,
    });
    const data = res.data;
    return Array.isArray(data) ? data : (data.orders ?? []);
  },

  /* ---------------------------------------------------------------- */
  /* Users                                                             */
  /* ---------------------------------------------------------------- */

  /**
   * GET /admin/users
   * ⚠️ CONFIRM endpoint.
   */
  async getUsers(): Promise<AdminUserSummary[]> {
    const res = await apiClient.get("/admin/users");
    const data = res.data;
    return Array.isArray(data) ? data : (data.users ?? []);
  },

  /**
   * POST /admin/users/{id}/suspend
   * Body: { reason, duration?, expiresAt? }
   * ⚠️ CONFIRM endpoint + whether suspension is reversible.
   */
  async suspendUser(id: string, input: SuspendUserInput): Promise<void> {
    await apiClient.post(`/admin/users/${id}/suspend`, input);
  },

  /**
   * POST /admin/users/{id}/reinstate
   * ⚠️ CONFIRM whether this exists. If not, un-suspend may be a
   * separate PATCH or may not be supported in v1.
   */
  async reinstateUser(id: string): Promise<void> {
    await apiClient.post(`/admin/users/${id}/reinstate`);
  },

  /* ---------------------------------------------------------------- */
  /* Dashboard stats                                                   */
  /* ---------------------------------------------------------------- */

  /**
   * GET /admin/stats
   * ⚠️ CONFIRM endpoint. If it does not exist, the dashboard can
   * compute counts client-side from getMakers + getDisputes + getOrders,
   * but that is expensive. Prefer a dedicated stats endpoint.
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const res = await apiClient.get<AdminDashboardStats>("/admin/stats");
    return res.data;
  },
};