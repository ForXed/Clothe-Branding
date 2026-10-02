// src/types/order.ts
//
// CONTRACT-CONFIRMED (read off POST /quotes/{id}/accept response):
//   id, briefId, quoteId, buyerId, makerId, status, deliveredAt, completedAt, createdAt
// INFERRED (derived from the orders UI + escrow model — CONFIRM against
//   the real GET /orders response schema before freeze):
//   garmentType, makerName, quantity, expectedDelivery, escrow{...}
//
// The inferred cluster is NOT a guess we're comfortable shipping blind; it's
// tracked debt. Do not "fix" it by inventing fields — verify against the spec.

export type OrderStatus =
  | 'AWAITING_PAYMENT'
  | 'IN_ESCROW'
  | 'IN_PRODUCTION'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export type EscrowStatus =
  | 'AWAITING'
  | 'HELD'
  | 'RELEASED'
  | 'REFUNDED'
  | 'DISPUTED';

export interface EscrowInfo {
  status: EscrowStatus;
  amountNgn: number;
  platformFeeNgn: number;
  makerPayoutNgn: number;
  autoReleaseAt?: string; // ISO date string — INFERRED
  releasedAt?: string;    // ISO date string — INFERRED
}

export interface ProductionOrder {
  id: string;
  garmentType: string;     // INFERRED
  makerName: string;       // INFERRED
  quantity: number;        // INFERRED
  expectedDelivery: string;// INFERRED
  status: OrderStatus;
  escrow: EscrowInfo;      // INFERRED
}