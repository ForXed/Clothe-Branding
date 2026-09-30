// src/services/briefService.ts
import apiClient from './apiClient';
import type { Brief, BriefInput, BriefImage } from '../types/brief';

export const briefService = {
  /** POST /briefs — create a DRAFT brief, directed at one maker */
  async createBrief(input: BriefInput): Promise<Brief> {
    const response = await apiClient.post<Brief>('/briefs', input);
    return response.data;
  },

  /** GET /briefs — buyer sees sent briefs, maker sees received briefs */
  async getBriefs(): Promise<Brief[]> {
    const response = await apiClient.get('/briefs');
    const data = response.data;
    return Array.isArray(data) ? data : (data as any).briefs ?? [];
  },

  /** GET /briefs/{briefId} — single brief detail */
  async getBrief(briefId: string): Promise<Brief> {
    const response = await apiClient.get<Brief>(`/briefs/${briefId}`);
    return response.data;
  },

  /** PATCH /briefs/{briefId} — edit while still DRAFT */
  async updateBrief(briefId: string, input: Partial<BriefInput>): Promise<Brief> {
    const response = await apiClient.patch<Brief>(`/briefs/${briefId}`, input);
    return response.data;
  },

  /**
   * POST /briefs/{briefId}/images — upload ONE reference image (multipart).
   * ⚠️ CONFIRM field name: 'file' vs 'image'
   */
  async uploadImage(briefId: string, file: File): Promise<BriefImage> {
    const form = new FormData();
    form.append('file', file);
    const response = await apiClient.post<BriefImage>(`/briefs/${briefId}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** POST /briefs/{briefId}/send — DRAFT -> SENT, expiresAt = +7 days */
  async sendBrief(briefId: string): Promise<Brief> {
    const response = await apiClient.post<Brief>(`/briefs/${briefId}/send`);
    return response.data;
  },

  /** POST /briefs/{briefId}/withdraw — buyer pulls it back before acceptance */
  async withdrawBrief(briefId: string): Promise<Brief> {
    const response = await apiClient.post<Brief>(`/briefs/${briefId}/withdraw`);
    return response.data;
  },

  /** POST /briefs/{briefId}/decline — maker declines WITHOUT quoting. Reason mandatory. */
  async declineBrief(briefId: string, reason: string): Promise<Brief> {
    const response = await apiClient.post<Brief>(`/briefs/${briefId}/decline`, { reason });
    return response.data;
  },
};