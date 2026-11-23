// src/services/quoteService.ts
// Quotes are append-only: a maker submits one (revision 1). Accepting creates the
// order; declining requires a reason in the body (the path id alone is not enough).
import apiClient from './apiClient';
import type { ApiOrder } from '../types/order';
import type { Quote, QuoteInput, QuoteStatus } from '../types/quote';

export const quoteService = {
  /** POST /briefs/{briefId}/quotes — maker submits a quote (Brief SENT -> QUOTED). */
  async submitQuote(briefId: string, input: QuoteInput): Promise<Quote> {
    const response = await apiClient.post<Quote>(`/briefs/${briefId}/quotes`, input);
    return response.data;
  },

  /** GET /briefs/{briefId}/quotes — revision history, buyer-comparison view. */
  async getQuotesForBrief(briefId: string): Promise<Quote[]> {
    const response = await apiClient.get<Quote[]>(`/briefs/${briefId}/quotes`);
    return Array.isArray(response.data) ? response.data : [];
  },

  /** GET /quotes/mine?status=PENDING — the maker's own quotes across all briefs. */
  async getMyQuotes(statusFilter?: QuoteStatus): Promise<Quote[]> {
    const params = statusFilter ? { status: statusFilter } : {};
    const response = await apiClient.get<Quote[]>('/quotes/mine', { params });
    return Array.isArray(response.data) ? response.data : [];
  },

  /** GET /quotes/{quoteId} — buyer, quoting maker or admin only. */
  async getQuote(quoteId: string): Promise<Quote> {
    const response = await apiClient.get<Quote>(`/quotes/${quoteId}`);
    return response.data;
  },

  /** PATCH /quotes/{quoteId}/accept — buyer accepts; creates the order. */
  async acceptQuote(quoteId: string): Promise<ApiOrder> {
    const response = await apiClient.patch<ApiOrder>(`/quotes/${quoteId}/accept`);
    return response.data;
  },

  /** PATCH /quotes/{quoteId}/decline — buyer declines, with a reason. */
  async declineQuote(quoteId: string, reason: string): Promise<Quote> {
    const response = await apiClient.patch<Quote>(`/quotes/${quoteId}/decline`, {
      quoteId,
      reason,
    });
    return response.data;
  },
};
