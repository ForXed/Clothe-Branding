// src/types/maker.ts
// Mirrors the v1.3 draft contract: MakerSummary (discovery / public profile),
// MakerProfileResponse (owner view) and MakerVerificationResponse (apply).

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

/**
 * GET /makers and GET /makers/{id}.
 * Public: no user id, no email. `specializations` are plain garment strings.
 */
export interface MakerSummary {
  id: string;
  brandName: string;
  bio: string | null;
  location: string | null;
  leadTimeDays: number | null;
  minBatch: number | null;
  maxBatch: number | null;
  specializations: string[];
}

export interface MakerSpecialization {
  garmentType: string;
}

/** GET /makers/me — the owner's own profile; specializations are objects here. */
export interface MakerProfile {
  id: string;
  brandName: string;
  bio: string | null;
  location: string | null;
  leadTimeDays: number | null;
  minBatch: number | null;
  maxBatch: number | null;
  specializations: MakerSpecialization[];
}

/** POST /makers/apply */
export interface MakerApplicationInput {
  brandName: string;
  bio?: string;
  location?: string;
  leadTimeDays?: number;
  minBatch?: number;
  maxBatch?: number;
  /** Garment names, e.g. ["agbada"]; the service wraps them for the API. */
  specializations: string[];
}

/** POST /makers/apply answer — the profile exists, verification is pending. */
export interface MakerVerificationResponse {
  verificationStatus: VerificationStatus;
}

/**
 * @deprecated Legacy admin shape (GET /admin/makers rows carry user email and
 * verification state). F4 replaces the admin screens with PendingMakerResponse.
 */
export interface Maker extends MakerSummary {
  userId: string;
  verificationStatus: VerificationStatus;
  rejectionNote: string | null;
  verifiedAt: string | null;
  createdAt: string;
}
