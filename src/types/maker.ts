// src/types/maker.ts
// Generated from the frozen v1.0 contract — GET /makers

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Maker {
  id: string;
  userId: string;
  brandName: string;
  bio: string;
  location: string;
  leadTimeDays: number;
  minBatch: number;
  maxBatch: number;
  verificationStatus: VerificationStatus;
  rejectionNote: string | null;
  verifiedAt: string | null;
  specializations: string[];
  createdAt: string;
}