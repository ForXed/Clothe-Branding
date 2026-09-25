// src/types/message.ts
// From contract — OrderMessage

export interface OrderMessage {
  id: string;
  productionOrderId: string;
  senderId: string;
  content: string;
  createdAt: string;   // RFC 3339
  readAt: string | null;
}