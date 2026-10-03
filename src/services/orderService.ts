import apiClient from "./apiClient"; // TODO: adjust to wherever your axios instance lives
import type { OrderStatus } from "../types/order";
import { Escrow } from "../data/mockTransform";

/* ---- Shapes straight from the OpenAPI spec (v1.0.0-draft) ---- */

export interface ApiOrder {
  id: string;
  briefId: string;
  quoteId: string;
  buyerId: string;
  makerId: string;
  status: OrderStatus;
  deliveredAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface DisputeInput {
  reasonCategory: string;
  explanation: string;
  proofFileUrls?: string[];
}

export interface DeliverPayload {
  proofImages: File[];
  /** Not in the spec yet, sent only if provided. See note in deliverOrder. */
  trackingNumber?: string;
}

export const orderService = {
  /** GET /orders */
  async getOrders(status?: OrderStatus): Promise<ApiOrder[]> {
    const response = await apiClient.get("/orders", { params: { status } });
    const data = response.data;
    return Array.isArray(data) ? data : (data.orders ?? []);
  },

  /** GET /orders/{id} */
  async getOrderById(id: string): Promise<ApiOrder> {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  /** GET /orders/{id}/escrow */
  async getEscrow(id: string): Promise<Escrow> {
    const response = await apiClient.get(`/orders/${id}/escrow`);
    return response.data;
  },

  /** POST /orders/{id}/pay: buyer, simulated. AWAITING_PAYMENT -> IN_ESCROW */
  async payOrder(id: string): Promise<void> {
    await apiClient.post(`/orders/${id}/pay`);
  },

  /** POST /orders/{id}/cancel: only while AWAITING_PAYMENT (409 otherwise) */
  async cancelOrder(id: string): Promise<void> {
    await apiClient.post(`/orders/${id}/cancel`);
  },

  /** POST /orders/{id}/start-production: maker. IN_ESCROW -> IN_PRODUCTION */
  async startProduction(id: string): Promise<void> {
    await apiClient.post(`/orders/${id}/start-production`);
  },

  /**
   * POST /orders/{id}/deliver: maker. IN_PRODUCTION -> DELIVERED.
   * The spec says multipart/form-data with `proofImages` (binary array),
   * NOT a JSON body of image URLs.
   */
  async deliverOrder(id: string, payload: DeliverPayload): Promise<void> {
    const form = new FormData();
    payload.proofImages.forEach((file) => form.append("proofImages", file));
    // The spec has no tracking field yet. Remove this line if the backend rejects unknown parts.
    if (payload.trackingNumber)
      form.append("trackingNumber", payload.trackingNumber);

    await apiClient.post(`/orders/${id}/deliver`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** POST /orders/{id}/confirm: buyer. DELIVERED -> COMPLETED, escrow released */
  async confirmOrder(id: string): Promise<void> {
    await apiClient.post(`/orders/${id}/confirm`);
  },

  /** POST /orders/{id}/dispute: body is required: reasonCategory + explanation */
  async disputeOrder(id: string, input: DisputeInput): Promise<void> {
    await apiClient.post(`/orders/${id}/dispute`, input);
  },
};
