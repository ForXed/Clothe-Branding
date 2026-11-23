// src/types/brief.ts
// Mirrors the v1.3 draft contract (BriefResponse, BriefDetail, BriefCreate/Update).

export type BriefStatus =
  | 'DRAFT'
  | 'SENT'
  | 'QUOTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'WITHDRAWN'
  | 'EXPIRED';

/** One reference image. Returned only inside BriefDetail (as URL strings). */
export interface BriefImage {
  id: string;
  briefId: string;
  fileUrl: string;
  uploadedAt: string;
}

/** Answer of GET /briefs and of every state transition. */
export interface Brief {
  id: string;
  buyerId: string;
  /** users.id of the maker this brief is addressed to (not a profile id). */
  makerId: string;
  garmentType: string;
  quantity: number;
  budgetNgn: number;
  deadline: string; // date-only: "2026-09-29"
  description: string;
  status: BriefStatus;
  declineReason: string | null;
  sentAt: string | null;
  expiresAt: string | null; // server sets +7 days on send
  createdAt: string;
  updatedAt: string | null;
}

/** The nested brief inside an order detail — carries the image URLs. */
export interface BriefDetail {
  id: string;
  garmentType: string;
  quantity: number;
  budgetNgn: number;
  deadline: string;
  description: string;
  status: BriefStatus;
  imageUrls: string[];
  /** Same files as imageUrls, in object form (kept for the admin views). */
  images: BriefImage[];
  sentAt: string | null;
  createdAt: string;
}

/** What POST /briefs (multipart `brief` part) expects. */
export interface BriefCreateInput {
  makerProfileId: string;
  garmentType: string;
  quantity: number;
  budgetNgn: number;
  deadline: string; // YYYY-MM-DD
  description: string;
}

/** What PATCH /briefs/{id} accepts — all optional, DRAFT only. */
export interface BriefUpdateInput {
  garmentType?: string;
  quantity?: number;
  budgetNgn?: number;
  deadline?: string;
  description?: string;
}

/**
 * The brief form's own state. `makerId` is the *profile* id picked in discovery;
 * the service renames it to `makerProfileId` when it talks to the API.
 */
export interface BriefInput {
  makerId: string;
  garmentType: string;
  description: string;
  quantity: number;
  budgetNgn: number;
  deadline: string;
  /** Local files, uploaded with the brief in the same multipart request. */
  images?: File[];
}
