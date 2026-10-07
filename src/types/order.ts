// src/types/order.ts
import { Brief } from "./brief";
import { Escrow } from "./escrow";
import { Quote } from "./quote";

export type OrderStatus =
  | "AWAITING_PAYMENT"
  | "IN_ESCROW"
  | "IN_PRODUCTION"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export interface ProductionOrder {
  id: string;
  status: OrderStatus;
  deliveredAt: string | null;
  completedAt: string | null;
  createdAt: string;
  brief: Brief;
  quote: Quote;
  escrow: Escrow;
  garmentType: string;
  makerName: string;
  quantity: number;
  expectedDelivery: string;
  buyer: {
    id: string;
    displayName: string;
    role: string;
  };
  maker: {
    id: string;
    displayName: string;
    role: string;
  };
  // Add other fields from your backend response here if they differ
}
