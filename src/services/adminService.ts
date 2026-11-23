// src/services/adminService.ts
// Admin calls, mapped onto the endpoints the backend actually serves.
//
// There is no "all makers" or "users" admin read in v1: the review surface is
// the pending queue, and a dispute is an order in DISPUTED. Screens that need
// something else say so explicitly instead of being fed invented data.

import apiClient from "./apiClient";
import { toPage } from "../types/common";
import type { Page, PageParams } from "../types/common";
import type { ProductionOrder } from "../types/order";
import type { MakerSummary } from "../types/maker";
import type {
  AdminDashboardStats,
  DisputeRecord,
  PendingMaker,
  ResolveOrderInput,
  VerifyMakerInput,
} from "../types/admin";

export interface AdminOrderParams extends PageParams {
  status?: string;
}

export const adminService = {
  /** GET /admin/orders — paged, optional status filter. */
  async listOrders(
    params: AdminOrderParams = {},
  ): Promise<Page<ProductionOrder>> {
    const response = await apiClient.get("/admin/orders", {
      params: { status: params.status, page: params.page, size: params.size },
    });
    return toPage<ProductionOrder>(response.data);
  },

  /** GET /orders/{id} — participant scoped, and ADMIN is a participant. */
  async getOrder(orderId: string): Promise<ProductionOrder> {
    const response = await apiClient.get<ProductionOrder>(`/orders/${orderId}`);
    return response.data;
  },

  /** POST /admin/orders/{orderId}/resolve — RELEASE completes, REFUND cancels. */
  async resolveOrder(
    orderId: string,
    input: ResolveOrderInput,
  ): Promise<ProductionOrder> {
    const response = await apiClient.post<ProductionOrder>(
      `/admin/orders/${orderId}/resolve`,
      input,
    );
    return response.data;
  },

  /** GET /admin/makers/pending — the only maker review read in v1. */
  async listPendingMakers(
    params: PageParams = {},
  ): Promise<Page<PendingMaker>> {
    const response = await apiClient.get("/admin/makers/pending", {
      params: { page: params.page, size: params.size },
    });
    return toPage<PendingMaker>(response.data);
  },

  /** PATCH /makers/{id}/verify (approve) or /reject (a note is required). */
  async decideMaker(
    makerId: string,
    input: VerifyMakerInput,
  ): Promise<MakerSummary> {
    if (input.status === "VERIFIED") {
      const response = await apiClient.patch<MakerSummary>(
        `/makers/${makerId}/verify`,
      );
      return response.data;
    }

    const response = await apiClient.patch<MakerSummary>(
      `/makers/${makerId}/reject`,
      { rejectionNote: input.rejectionNote ?? "" },
    );
    return response.data;
  },

  /** Disputes are orders in DISPUTED; the list stays lean like the order list. */
  async listDisputes(params: PageParams = {}): Promise<Page<ProductionOrder>> {
    return adminService.listOrders({ ...params, status: "DISPUTED" });
  },

  /**
   * The reason lives in the DISPUTE_OPENED event ("<category>: <explanation>"),
   * so the detail pairs the order with its trail; a missing trail must not hide
   * the order itself.
   */
  async getDispute(orderId: string): Promise<DisputeRecord> {
    const order = await adminService.getOrder(orderId);

    let trail: Array<{
      eventType?: string;
      note?: string;
      createdAt?: string;
      actorId?: string;
    }> = [];

    try {
      const response = await apiClient.get(`/orders/${orderId}/events`);
      trail = Array.isArray(response.data) ? response.data : [];
    } catch {
      trail = [];
    }

    const opened = trail.find((event) => event?.eventType === "DISPUTE_OPENED");

    return {
      order,
      reason: opened?.note ?? "No reason was recorded on this dispute.",
      raisedAt: opened?.createdAt ?? null,
      raisedBy: opened?.actorId ?? null,
    };
  },

  /** Counts for the dashboard: one page of orders plus the pending queue. */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const pageSize = 100;
    const [orders, pending] = await Promise.all([
      adminService.listOrders({ size: pageSize }),
      adminService.listPendingMakers({ size: 1 }),
    ]);

    const byStatus: Record<string, number> = {};
    for (const order of orders.content) {
      byStatus[order.status] = (byStatus[order.status] ?? 0) + 1;
    }

    return {
      byStatus,
      totalOrders: orders.totalElements,
      pendingMakers: pending.totalElements,
      sampled: orders.totalElements > orders.content.length,
    };
  },
};
