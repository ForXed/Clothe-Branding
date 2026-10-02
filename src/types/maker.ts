// src/types/maker.ts
// Generated from the frozen v1.2 contract — GET /makers + POST /makers/apply

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Maker {
  id: string;
  userId: string;
  brandName: string;            // ✅ canonical display field (resolves earlier ⚠️)
  bio: string;
  location: string;
  leadTimeDays: number;
  minBatch: number;
  maxBatch: number;
  verificationStatus: VerificationStatus; // ✅ verified filter = === 'VERIFIED' (resolves earlier ⚠️)
  rejectionNote: string | null;
  verifiedAt: string | null;
  specializations: string[];
  createdAt: string;
  // NOTE: no avatar/image field — discovery screen uses the initials fallback by design.
}

// ── Application flow (POST /makers/apply) ──────────────────────────────
// Aligned to Maker.specializations: string[] above. ⚠️ CONFIRM exact body
// against the apply request schema if it diverges from the form fields.

export interface MakerApplicationInput {
  brandName: string;
  bio: string;
  location: string;
  leadTimeDays: number;
  minBatch: number;
  maxBatch: number;
  specializations: string[];
  // ⚠️ CONFIRM: portfolioUrl / contact fields if the apply form collects them
}

export interface MakerApplicationResult {
  id: string;
  status: VerificationStatus; // PENDING on submit
  createdAt: string;
}