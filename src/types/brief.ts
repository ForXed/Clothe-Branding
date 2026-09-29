// src/types/brief.ts
// Aligned to contract v1.2 — Brief schemas confirmed.

export type BriefStatus =
  | 'DRAFT'
  | 'SENT'
  | 'QUOTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'WITHDRAWN'
  | 'EXPIRED';

export interface BriefImage {
  id: string;
  briefId: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Brief {
  id: string;
  buyerId: string;
  makerId: string;          // directed at ONE maker — not open-posted
  garmentType: string;
  quantity: number;
  budgetNgn: number;
  deadline: string;         // date-only: "2026-09-29"
  description: string;
  status: BriefStatus;
  declineReason: string | null;
  sentAt: string | null;
  expiresAt: string | null; // server sets +7 days on send
  images: BriefImage[];
  createdAt: string;
}

/** Request body for POST /briefs (and PATCH while DRAFT) */
export interface BriefInput {
  makerId: string;          // required — which maker this brief targets
  garmentType: string;
  description: string;
  quantity: number;
  budgetNgn: number;
  deadline: string;         // YYYY-MM-DD
}