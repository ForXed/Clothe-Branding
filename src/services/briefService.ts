// src/services/briefService.ts
// Briefs are directed at ONE maker, so creation is a multipart POST that carries
// the brief JSON and its reference images in a single request (there is no
// "add an image later" endpoint yet — POST /briefs/{id}/images is still planned).
import apiClient from './apiClient';
import { toPage } from '../types/common';
import type { Page, PageParams } from '../types/common';
import type {
  Brief,
  BriefInput,
  BriefStatus,
  BriefUpdateInput,
} from '../types/brief';

export interface ListBriefsParams extends PageParams {
  status?: BriefStatus;
}

export const briefService = {
  /** POST /briefs — create a DRAFT brief for one maker (multipart). */
  async createBrief(input: BriefInput): Promise<Brief> {
    const form = new FormData();

    // The JSON part must keep this name and type: the controller reads
    // @RequestPart("brief") as application/json.
    form.append(
      'brief',
      new Blob(
        [
          JSON.stringify({
            makerProfileId: input.makerId,
            garmentType: input.garmentType,
            quantity: input.quantity,
            budgetNgn: input.budgetNgn,
            deadline: input.deadline,
            description: input.description,
          }),
        ],
        { type: 'application/json' },
      ),
    );

    (input.images ?? []).forEach((file) => form.append('images', file));

    const response = await apiClient.post<Brief>('/briefs', form);
    return response.data;
  },

  /**
   * GET /briefs — the API scopes it by role: a buyer sees the briefs they sent,
   * a maker sees the briefs addressed to them, an admin sees everything.
   */
  async listBriefs(params: ListBriefsParams = {}): Promise<Page<Brief>> {
    const response = await apiClient.get('/briefs', { params });
    return toPage<Brief>(response.data);
  },

  /** Convenience wrapper for screens that only need the rows. */
  async getBriefs(params: ListBriefsParams = {}): Promise<Brief[]> {
    return (await briefService.listBriefs(params)).content;
  },

  /** GET /briefs/{briefId} — buyer, addressed maker or admin only. */
  async getBrief(briefId: string): Promise<Brief> {
    const response = await apiClient.get<Brief>(`/briefs/${briefId}`);
    return response.data;
  },

  /** PATCH /briefs/{briefId} — edit while still DRAFT (409 once sent). */
  async updateBrief(briefId: string, input: BriefUpdateInput): Promise<Brief> {
    const response = await apiClient.patch<Brief>(`/briefs/${briefId}`, input);
    return response.data;
  },

  /** PATCH /briefs/{briefId}/send — DRAFT -> SENT, expiresAt = +7 days. */
  async sendBrief(briefId: string): Promise<Brief> {
    const response = await apiClient.patch<Brief>(`/briefs/${briefId}/send`);
    return response.data;
  },

  /** PATCH /briefs/{briefId}/withdraw — buyer pulls it back before acceptance. */
  async withdrawBrief(briefId: string): Promise<Brief> {
    const response = await apiClient.patch<Brief>(`/briefs/${briefId}/withdraw`);
    return response.data;
  },

  /** PATCH /briefs/{briefId}/decline — maker declines without quoting. */
  async declineBrief(briefId: string, reason: string): Promise<Brief> {
    const response = await apiClient.patch<Brief>(`/briefs/${briefId}/decline`, {
      reason,
    });
    return response.data;
  },

  /** DELETE /briefs/{briefId}/delete — admin cleanup path. */
  async deleteBrief(briefId: string): Promise<void> {
    await apiClient.delete(`/briefs/${briefId}/delete`);
  },
};
