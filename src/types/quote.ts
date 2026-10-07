// src/types/quote.ts
// Generated from the frozen contract — Quotes endpoints

export type QuoteStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'SUPERSEDED';

export interface Quote {
  id: string;
  briefId: string;
  makerId: string;
  priceNgn: number;
  timelineDays: number;
  terms: string;
  status: QuoteStatus;
  revisionNumber: number; // max: 2
  estimatedMakerPayoutNgn: number; // priceNgn minus platform fee
  createdAt: string;
}


/** Request body for POST /briefs/{briefId}/quotes */
export interface QuoteInput {
  priceNgn: number;      // required
  timelineDays: number;  // required
  terms?: string;
}

/** Response of POST /quotes/{quoteId}/accept — a newborn ProductionOrder */
export interface ProductionOrderFromQuote {
  id: string;
  briefId: string;
  quoteId: string;
  buyerId: string;
  makerId: string;
  status: string; // 'AWAITING_PAYMENT' at creation (escrow NOT funded yet!)
  deliveredAt: string | null;
  completedAt: string | null;
  createdAt: string;
}