import apiClient from "./apiClient"; // TODO: adjust to wherever your axios instance lives
import type { OrderStatus, ProductionOrder } from "../types/order";

/* ---- Shapes straight from the OpenAPI spec (v1.0.0-draft) ---- */
export const dummyOrders: ApiOrder[] = [
  {
    id: "order_001",
    briefId: "brief_001",
    quoteId: "quote_001",
    buyerId: "buyer_001",
    makerId: "maker_001",
    status: "AWAITING_PAYMENT",
    deliveredAt: null,
    completedAt: null,
    createdAt: "2026-10-01T09:30:00.000Z",
  },
  {
    id: "order_002",
    briefId: "brief_002",
    quoteId: "quote_002",
    buyerId: "buyer_002",
    makerId: "maker_002",
    status: "IN_PRODUCTION",
    deliveredAt: null,
    completedAt: null,
    createdAt: "2026-10-02T11:15:00.000Z",
  },
  {
    id: "order_003",
    briefId: "brief_003",
    quoteId: "quote_003",
    buyerId: "buyer_003",
    makerId: "maker_001",
    status: "DELIVERED",
    deliveredAt: "2026-10-05T14:20:00.000Z",
    completedAt: null,
    createdAt: "2026-10-03T08:45:00.000Z",
  },
  {
    id: "order_004",
    briefId: "brief_004",
    quoteId: "quote_004",
    buyerId: "buyer_001",
    makerId: "maker_003",
    status: "COMPLETED",
    deliveredAt: "2026-10-04T10:00:00.000Z",
    completedAt: "2026-10-06T16:30:00.000Z",
    createdAt: "2026-10-01T13:00:00.000Z",
  },
  {
    id: "order_005",
    briefId: "brief_005",
    quoteId: "quote_005",
    buyerId: "buyer_004",
    makerId: "maker_002",
    status: "CANCELLED",
    deliveredAt: null,
    completedAt: null,
    createdAt: "2026-10-07T12:10:00.000Z",
  },
  {
    id: "order_006",
    briefId: "brief_006",
    quoteId: "quote_006",
    buyerId: "buyer_002",
    makerId: "maker_004",
    status: "DISPUTED",
    deliveredAt: null,
    completedAt: null,
    createdAt: "2026-10-08T09:00:00.000Z",
  },
  {
    id: "order_007",
    briefId: "brief_007",
    quoteId: "quote_007",
    buyerId: "buyer_005",
    makerId: "maker_003",
    status: "IN_PRODUCTION",
    deliveredAt: null,
    completedAt: null,
    createdAt: "2026-10-09T15:45:00.000Z",
  },
  {
    id: "order_008",
    briefId: "brief_008",
    quoteId: "quote_008",
    buyerId: "buyer_003",
    makerId: "maker_005",
    status: "COMPLETED",
    deliveredAt: "2026-10-08T12:30:00.000Z",
    completedAt: "2026-10-10T17:00:00.000Z",
    createdAt: "2026-10-05T10:20:00.000Z",
  },
  {
    id: "order_009",
    briefId: "brief_009",
    quoteId: "quote_009",
    buyerId: "buyer_004",
    makerId: "maker_001",
    status: "CANCELLED",
    deliveredAt: "2026-10-11T11:45:00.000Z",
    completedAt: null,
    createdAt: "2026-10-06T14:15:00.000Z",
  },
  {
    id: "order_010",
    briefId: "brief_010",
    quoteId: "quote_010",
    buyerId: "buyer_005",
    makerId: "maker_004",
    status: "AWAITING_PAYMENT",
    deliveredAt: null,
    completedAt: null,
    createdAt: "2026-10-12T08:00:00.000Z",
  },
];

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

export interface ApiEscrow {
  id: string;
  productionOrderId: string;
  amountNgn: number;
  platformFeePercent: number;
  feeAmountNgn: number;
  makerPayoutNgn: number;
  status: "AWAITING" | "HELD" | "RELEASED" | "REFUNDED";
  paidAt: string | null;
  releasedAt: string | null;
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
  async getOrderById(id: string): Promise<ProductionOrder> {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  /** GET /orders/{id}/escrow */
  async getEscrow(id: string): Promise<ApiEscrow> {
    const response = await apiClient.get(`/orders/${id}/escrow`);
    return response.data;
  },

  /** POST /orders/{id}/pay: buyer, simulated. AWAITING_PAYMENT -> IN_ESCROW */
  async payOrder(id: string): Promise<ApiOrder> {
    const response = await apiClient.post(`/orders/${id}/pay`);
    return response.data;
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
  async deliverOrder(id: string, payload: DeliverPayload): Promise<ApiOrder> {
    const form = new FormData();
    payload.proofImages.forEach((file) => form.append("proofImages", file));
    // The spec has no tracking field yet. Remove this line if the backend rejects unknown parts.

    const response = await apiClient.post(`/orders/${id}/deliver`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /** POST /orders/{id}/confirm: buyer. DELIVERED -> COMPLETED, escrow released */
  async confirmOrder(id: string): Promise<void> {
    await apiClient.post(`/orders/${id}/confirm`);
  },

  /**
   * PLACEHOLDER: not implemented, no backend endpoint exists yet.
   * The state diagram lets the buyer attach optional proof when disputing, and
   * POST /dispute accepts `proofFileUrls`, but the spec has no endpoint for
   * uploading dispute evidence. Once it exists, implement this to upload the
   * files and return their URLs, then pass them as `proofFileUrls` in disputeOrder.
   */
  async uploadDisputeProof(
    _orderId: string,
    _files: File[],
  ): Promise<string[]> {
    throw new Error("Uploading dispute proof isn't available yet.");
  },

  /** POST /orders/{id}/dispute: body is required: reasonCategory + explanation */
  async disputeOrder(id: string, input: DisputeInput): Promise<void> {
    await apiClient.post(`/orders/${id}/dispute`, input);
  },
};
