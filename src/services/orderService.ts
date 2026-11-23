// src/services/orderService.ts
// The order is the escrow-backed part of the One Loop. Every transition is its own
// endpoint, guarded server side by role and current status, so the UI can simply
// surface the 409 the API returns.
import apiClient from './apiClient';
import { toPage } from '../types/common';
import type { Page, PageParams } from '../types/common';
import type { Escrow } from '../types/escrow';
import type {
  ApiOrder,
  OrderEvent,
  OrderStatus,
  ProductionOrder,
} from '../types/order';

export interface DisputeInput {
  reasonCategory: string;
  explanation: string;
  proofFileUrls?: string[];
}

/** What the delivery form hands back: the proof files it collected. */
export interface DeliverPayload {
  proofFiles: File[];
}

export interface ListOrdersParams extends PageParams {
  status?: OrderStatus;
}

/** The detail nests the brief as imageUrls; screens want {fileUrl} objects. */
function withImageObjects(order: ProductionOrder): ProductionOrder {
  const urls = order.brief?.imageUrls ?? [];

  return {
    ...order,
    brief: {
      ...order.brief,
      imageUrls: urls,
      images: urls.map((fileUrl, index) => ({
        id: `${order.brief.id}-${index}`,
        briefId: order.brief.id,
        fileUrl,
        uploadedAt: order.brief.createdAt,
      })),
    },
  };
}

export const orderService = {
  /** GET /orders — scoped by role (buyer's orders, maker's orders, admin's all). */
  async listOrders(params: ListOrdersParams = {}): Promise<Page<ApiOrder>> {
    const response = await apiClient.get('/orders', { params });
    return toPage<ApiOrder>(response.data);
  },

  async getOrders(params: ListOrdersParams = {}): Promise<ApiOrder[]> {
    return (await orderService.listOrders(params)).content;
  },

  /** GET /orders/{orderId} — populated detail (brief, quote, escrow, parties). */
  async getOrderById(orderId: string): Promise<ProductionOrder> {
    const response = await apiClient.get<ProductionOrder>(`/orders/${orderId}`);
    return withImageObjects(response.data);
  },

  /** POST /orders/{orderId}/pay — buyer, simulated. AWAITING_PAYMENT -> IN_ESCROW. */
  async payOrder(orderId: string): Promise<ApiOrder> {
    const response = await apiClient.post<ApiOrder>(`/orders/${orderId}/pay`);
    return response.data;
  },

  /** POST /orders/{orderId}/cancel — buyer, only while AWAITING_PAYMENT. */
  async cancelOrder(orderId: string): Promise<ApiOrder> {
    const response = await apiClient.post<ApiOrder>(`/orders/${orderId}/cancel`);
    return response.data;
  },

  /** PATCH /orders/{orderId}/start-production — maker. IN_ESCROW -> IN_PRODUCTION. */
  async startProduction(orderId: string): Promise<ApiOrder> {
    const response = await apiClient.patch<ApiOrder>(
      `/orders/${orderId}/start-production`,
    );
    return response.data;
  },

  /**
   * POST /orders/{orderId}/deliver — maker. IN_PRODUCTION -> DELIVERED.
   * Multipart with a `proofFiles` part (one or more files).
   */
  async deliverOrder(orderId: string, proofFiles: File[]): Promise<ApiOrder> {
    const form = new FormData();
    proofFiles.forEach((file) => form.append('proofFiles', file));

    const response = await apiClient.post<ApiOrder>(
      `/orders/${orderId}/deliver`,
      form,
    );
    return response.data;
  },

  /** POST /orders/{orderId}/confirm — buyer. DELIVERED -> COMPLETED, escrow released. */
  async confirmOrder(orderId: string): Promise<ApiOrder> {
    const response = await apiClient.post<ApiOrder>(`/orders/${orderId}/confirm`);
    return response.data;
  },

  /** POST /orders/{orderId}/dispute — buyer or maker, while escrow is held. */
  async disputeOrder(orderId: string, input: DisputeInput): Promise<ApiOrder> {
    const response = await apiClient.post<ApiOrder>(
      `/orders/${orderId}/dispute`,
      input,
    );
    return response.data;
  },

  /** GET /orders/{orderId}/events — the audit trail (actorId null = system). */
  async getOrderEvents(orderId: string): Promise<OrderEvent[]> {
    const response = await apiClient.get<OrderEvent[]>(`/orders/${orderId}/events`);
    return Array.isArray(response.data) ? response.data : [];
  },

  /** GET /orders/{orderId}/escrow — money split frozen when the quote was accepted. */
  async getOrderEscrow(orderId: string): Promise<Escrow> {
    const response = await apiClient.get<Escrow>(`/orders/${orderId}/escrow`);
    return response.data;
  },
};
