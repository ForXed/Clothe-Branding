// src/services/quoteService.ts
import apiClient from './apiClient';
import type { Quote, QuoteInput, QuoteStatus, ProductionOrderFromQuote } from '../types/quote';

export const quoteService = {
  /** POST /briefs/{briefId}/quotes — Maker submits a quote (Brief: SENT -> QUOTED) */
  async submitQuote(briefId: string, input: QuoteInput): Promise<Quote> {
    const response = await apiClient.post(`/briefs/${briefId}/quotes`, input);
    return response.data;
  },

  /** GET /briefs/{briefId}/quotes — all quotes on a brief (buyer comparison view) */
  async getQuotesForBrief(briefId: string): Promise<Quote[]> {
    const response = await apiClient.get(`/briefs/${briefId}/quotes`);
    const data = response.data;
    return Array.isArray(data) ? data : (data.quotes ?? []);
  },

  /** GET /quotes/mine?status=PENDING — maker's own quotes across all briefs */
  async getMyQuotes(statusFilter?: QuoteStatus): Promise<Quote[]> {
    const params = statusFilter ? { status: statusFilter } : {};
    const response = await apiClient.get('/quotes/mine', { params });
    const data = response.data;
    return Array.isArray(data) ? data : (data.quotes ?? []);
  },

  /** GET /quotes/{quoteId} — fetch a single quote */
  async getQuote(quoteId: string): Promise<Quote> {
    const response = await apiClient.get(`/quotes/${quoteId}`);
    return response.data;
  },

  /** POST /quotes/{quoteId}/accept — Buyer accepts. Creates ProductionOrder (AWAITING_PAYMENT) */
  async acceptQuote(quoteId: string): Promise<ProductionOrderFromQuote> {
    const response = await apiClient.post(`/quotes/${quoteId}/accept`);
    return response.data;
  },

  /** POST /quotes/{quoteId}/decline — Buyer declines. Maker may revise once (revisionNumber 2) */
  async declineQuote(quoteId: string): Promise<Quote> {
    const response = await apiClient.post(`/quotes/${quoteId}/decline`);
    return response.data;
  },
};