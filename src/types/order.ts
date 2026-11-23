// src/types/order.ts
// Mirrors the v1.3 draft contract: ProductionOrder (list rows / transitions) and
// ProductionOrderDetail (GET /orders/{id}), plus the event and escrow shapes.

import type { BriefDetail } from './brief';
import type { Escrow } from './escrow';
import type { Quote } from './quote';

export type OrderStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'IN_ESCROW'
  | 'IN_PRODUCTION'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

/** A row from GET /orders (and every state transition answer). */
export interface ApiOrder {
  id: string;
  briefId: string;
  quoteId: string;
  buyerId: string;
  makerId: string;
  status: OrderStatus;
  deliveredAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface OrderParty {
  id: string;
  displayName: string;
  role: 'BUYER' | 'MAKER' | 'ADMIN';
}

/** GET /orders/{id} — the populated detail. */
export interface ProductionOrder {
  id: string;
  status: OrderStatus;
  deliveredAt: string | null;
  completedAt: string | null;
  expectedCompletionAt: string | null;
  createdAt: string;
  brief: BriefDetail;
  quote: Quote;
  /** Created together with the order (AWAITING until the buyer pays). */
  escrow: Escrow;
  buyer: OrderParty;
  maker: OrderParty;
}

/** One line of the audit trail (actorId is null for system actions). */
export interface OrderEvent {
  id: string;
  productionOrderId: string;
  actorId: string | null;
  eventType: string;
  fromStatus: string | null;
  toStatus: string | null;
  note: string | null;
  createdAt: string;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  AWAITING_PAYMENT: 'Awaiting payment',
  IN_ESCROW: 'Funded in escrow',
  IN_PRODUCTION: 'In production',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
};
