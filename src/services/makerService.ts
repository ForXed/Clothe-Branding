// src/services/makerService.ts
import apiClient from './apiClient';
import type { Maker } from '../types/maker';

export interface ApplyMakerData {
  brandName: string;
  bio: string;
  specializations: string[];
  location?: string;
  leadTimeDays?: number;
  minBatch?: number;
  maxBatch?: number;
}

export const makerService = {
  /** GET /makers — list makers for discovery */
  async getMakers(): Promise<Maker[]> {
    const response = await apiClient.get('/makers');
    const data = response.data;
    return Array.isArray(data) ? data : (data.makers ?? []);
  },

  /** GET /makers/{makerId} — single maker (for the future profile view) */
  async getMakerById(makerId: string): Promise<Maker> {
    const response = await apiClient.get(`/makers/${makerId}`);
    return response.data;
  },

  /** POST /makers/apply — submit a new maker application (creates PENDING profile) */
  async apply(data: ApplyMakerData): Promise<Maker> {
    const response = await apiClient.post('/makers/apply', data);
    return response.data;
  },

  // ⏸️ PATCH /makers/me — reserved for profile updates later
};