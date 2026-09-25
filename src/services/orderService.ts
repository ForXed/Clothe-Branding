// src/services/orderService.ts
import apiClient from './apiClient';
import type { ProductionOrder } from '../types/order';

export const orderService = {
  /** GET /orders - List all orders for the current user */
  async getOrders(): Promise<ProductionOrder[]> {
    const response = await apiClient.get('/orders');
    const data = response.data;
    // Handle both array and wrapped response shapes
    return Array.isArray(data) ? data : (data.orders ?? []);
  },

  /** GET /orders/{id} - Get single order details */
  async getOrderById(id: string): Promise<ProductionOrder> {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  /** POST /orders/{id}/confirm - Brand confirms delivery & releases escrow */
  async confirmOrder(id: string): Promise<ProductionOrder> {
    const response = await apiClient.post(`/orders/${id}/confirm`);
    return response.data;
  },

  /** POST /orders/{id}/dispute - Brand disputes the order */
  async disputeOrder(id: string, reason?: string): Promise<ProductionOrder> {
    const response = await apiClient.post(`/orders/${id}/dispute`, { reason });
    return response.data;
  },

  // --- RESERVED FOR MAKER VIEW (P3.3.13 task) ---
  async startProduction(id: string): Promise<ProductionOrder> {
    const response = await apiClient.post(`/orders/${id}/start-production`);
    return response.data;
  },

  async deliverOrder(id: string, payload: { trackingNumber?: string; courier?: string; imageUrls: string[] }): Promise<ProductionOrder> {
    const response = await apiClient.post(`/orders/${id}/deliver`, payload);
    return response.data;
  },
};