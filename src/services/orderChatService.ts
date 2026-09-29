// src/services/orderChatService.ts
import apiClient from "./apiClient";

export interface OrderMessage {
  id: string;
  productionOrderId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
}

export const orderChatService = {
  /** GET /orders/{orderId}/messages — Fetch history */
  async getMessages(orderId: string): Promise<OrderMessage[]> {
    const response = await apiClient.get(`/orders/${orderId}/messages`);
    const data = response.data;
    return Array.isArray(data) ? data : (data.messages ?? []);
  },

  /** POST /orders/{orderId}/messages — Send a text message */
  async sendMessage(orderId: string, content: string): Promise<OrderMessage> {
    const response = await apiClient.post(`/orders/${orderId}/messages`, { content });
    return response.data;
  },
};