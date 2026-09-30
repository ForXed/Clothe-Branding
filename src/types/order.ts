// src/types/order.ts

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
  autoReleaseAt?: string; // ISO date string
  releasedAt?: string;    // ISO date string
}

export interface ProductionOrder {
  id: string;
  garmentType: string;
  makerName: string;
  quantity: number;
  expectedDelivery: string;
  status: OrderStatus;
  escrow: EscrowInfo;
  // Add other fields from your backend response here if they differ
}