// src/services/messageService.ts
import apiClient from './apiClient';
import type { OrderMessage } from '../types/message';

export const messageService = {
  /** GET /orders/{orderId}/messages — history (Buyer/Maker on that order only) */
  async getMessages(orderId: string): Promise<OrderMessage[]> {
    const response = await apiClient.get(`/orders/${orderId}/messages`);
    const data = response.data;
    return Array.isArray(data) ? data : (data.messages ?? []);
  },

  /** POST /orders/{orderId}/messages — send (IN_ESCROW onward) */
  async sendMessage(orderId: string, content: string): Promise<OrderMessage> {
    const response = await apiClient.post(`/orders/${orderId}/messages`, { content });
    return response.data;
  },
};