// src/services/makerService.ts
// Discovery is a public, paged read of VERIFIED makers only; the owner-side calls
// (me) return the fuller profile. The application body needs specializations as
// objects of {garmentType}, which is the shape the backend accepts.
import apiClient from './apiClient';
import { toPage } from '../types/common';
import type { Page, PageParams } from '../types/common';
import type {
  MakerApplicationInput,
  MakerProfile,
  MakerSummary,
} from '../types/maker';

export interface ListMakersParams extends PageParams {
  garmentType?: string;
  minBatch?: number;
  maxBatch?: number;
}

export interface UpdateMakerProfileInput {
  brandName?: string;
  bio?: string;
  location?: string;
  leadTimeDays?: number;
  minBatch?: number;
  maxBatch?: number;
  specializations?: string[];
}

export const makerService = {
  /** GET /makers — public discovery, verified makers only. */
  async listMakers(params: ListMakersParams = {}): Promise<Page<MakerSummary>> {
    const response = await apiClient.get('/makers', { params });
    return toPage<MakerSummary>(response.data);
  },

  /** Convenience wrapper for screens that only need the rows. */
  async getMakers(params: ListMakersParams = {}): Promise<MakerSummary[]> {
    return (await makerService.listMakers(params)).content;
  },

  /** GET /makers/{makerId} — public profile (404 when unknown). */
  async getMakerById(makerId: string): Promise<MakerSummary> {
    const response = await apiClient.get<MakerSummary>(`/makers/${makerId}`);
    return response.data;
  },

  /** GET /makers/me — the signed-in maker's own profile, verification state included. */
  async getMyProfile(): Promise<MakerProfile> {
    const response = await apiClient.get<MakerProfile>('/makers/me');
    return response.data;
  },

  /** POST /makers/apply — creates a PENDING profile that an admin has to verify. */
  async apply(data: MakerApplicationInput): Promise<MakerProfile> {
    const response = await apiClient.post<MakerProfile>(
      '/makers/apply',
      {
        ...data,
        specializations: data.specializations.map((garmentType) => ({
          garmentType,
        })),
      },
    );
    return response.data;
  },

  /** PUT /makers/me — edit the profile (PUT, not PATCH, in this version). */
  async updateMyProfile(
    data: UpdateMakerProfileInput,
  ): Promise<MakerProfile> {
    const response = await apiClient.put<MakerProfile>('/makers/me', {
      ...data,
      specializations: data.specializations?.map((garmentType) => ({
        garmentType,
      })),
    });
    return response.data;
  },
};
