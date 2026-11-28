// src/types/quote.ts
// Mirrors the v1.3 draft contract (QuoteResponse, QuoteCreateRequest).

export type QuoteStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'SUPERSEDED'
  | 'REVISION_REQUESTED';

export interface Quote {
  id: string;
  briefId: string;
  /** users.id of the maker who wrote it. */
  makerId: string;
  priceNgn: number;
  timelineDays: number;
  terms: string | null;
  status: QuoteStatus;
  /** 1 for the first quote, 2 for the single allowed revision. */
  revisionNumber: number;
  createdAt: string;
}

/** Request body for POST /briefs/{briefId}/quotes */
export interface QuoteInput {
  priceNgn: number;
  timelineDays: number;
  terms?: string;
}

/**
 * The platform fee is 10% and is frozen when the buyer accepts; the API exposes
 * the split through the escrow, not on the quote, so this is computed locally for
 * display only. Never send it back.
 */
export const PLATFORM_FEE_PERCENT = 10;

export function splitQuoteAmount(priceNgn: number): {
  feeAmountNgn: number;
  makerPayoutNgn: number;
} {
  const feeAmountNgn = Math.round(priceNgn * (PLATFORM_FEE_PERCENT / 100) * 100) / 100;
  return { feeAmountNgn, makerPayoutNgn: Math.round((priceNgn - feeAmountNgn) * 100) / 100 };
}
