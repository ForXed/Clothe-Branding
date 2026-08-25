// src/data/mockTransform.ts
//
// 📋 PURPOSE:
// Mock data layer for the B2B MVP "One Loop" (Brief → Quote → Order).
// Shapes match the RATIFIED domain & state diagrams (BRUTIGE_state_diagrams.md).
//
// ⚠️ STATUS ENUMS ARE EXACT. Do not invent new values — Phase 3 wiring
// depends on these matching the backend contract precisely.

// ============================================
// STATUS ENUMS (from ratified state diagrams)
// ============================================

export type BriefStatus =
  | 'DRAFT'
  | 'SENT'
  | 'QUOTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'WITHDRAWN'
  | 'EXPIRED';

export type QuoteStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'SUPERSEDED';

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
  | 'REFUNDED';

// ============================================
// INTERFACES
// ============================================

export interface Maker {
  id: string;
  name: string;
  handle: string;
  specialty: string;
  location: string;
  minOrderQuantity: number;
  avatarUrl: string;
  // 🚫 REMOVED: rating (v1.1 feature, excluded from MVP per F9)
}

export interface Brief {
  id: string;
  clientId: string;
  clientName: string;
  garmentType: string;
  quantity: number;
  budgetNgn: number;
  deadline: string;
  description: string;
  referenceImages: string[];
  status: BriefStatus;
  createdAt: string;
  expiresAt: string;        // ✅ NEW: 7-day brief clock
  declineReason?: string;   // ✅ NEW: mandatory when status === 'DECLINED'
}

export interface Quote {
  id: string;
  briefId: string;
  makerId: string;
  makerName: string;
  quotedPriceNgn: number;
  productionTimeDays: number;
  notes: string;
  status: QuoteStatus;
  revisionNumber: number;   // ✅ NEW: max 2 revisions per quote
  createdAt: string;
}

// ✅ NEW: Escrow is the CORE product — the trust mechanism.
// It holds the buyer's money and releases to maker after confirmation.
export interface Escrow {
  id: string;
  orderId: string;
  status: EscrowStatus;
  amountNgn: number;        // Total held from buyer
  platformFeeNgn: number;   // Brutige commission (fee transparency)
  makerPayoutNgn: number;   // What the maker actually receives
  heldAt?: string;
  autoReleaseAt?: string;   // 7-day auto-release window
  releasedAt?: string;
  refundedAt?: string;
}

// ✅ RENAMED: Order → ProductionOrder (matches ratified state diagram)
export interface ProductionOrder {
  id: string;
  quoteId: string;
  briefId: string;
  makerName: string;
  garmentType: string;
  quantity: number;
  totalAmountNgn: number;
  status: OrderStatus;
  escrow: Escrow;           // ✅ NEW: embedded escrow so buyer sees money state
  expectedDelivery: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  orderId?: string;
  briefId?: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystemNote?: boolean;
}

// ============================================
// MOCK DATA (Nigerian context, coherent chain)
// ============================================

export const mockMakers: Maker[] = [
  {
    id: 'mkr_001',
    name: 'Aura Studio',
    handle: '@aurastudio',
    specialty: 'Heavyweight Streetwear & Cut-and-Sew',
    location: 'Lagos, Nigeria',
    minOrderQuantity: 20,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
  },
  {
    id: 'mkr_002',
    name: 'Lagos Atelier',
    handle: '@lagosatelier',
    specialty: 'Bespoke Tailoring & Adire',
    location: 'Lagos, Nigeria',
    minOrderQuantity: 10,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200'
  },
  {
    id: 'mkr_003',
    name: 'Abuja Studio',
    handle: '@abujastudio',
    specialty: 'Technical Outerwear',
    location: 'Abuja, Nigeria',
    minOrderQuantity: 25,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  }
];

export const mockBriefs: Brief[] = [
  // SENT — waiting for makers to quote (7-day clock ticking)
  {
    id: 'brf_001',
    clientId: 'usr_123',
    clientName: 'John Doe',
    garmentType: '450GSM Heavyweight Hoodie',
    quantity: 50,
    budgetNgn: 3500000,
    deadline: '2026-12-15',
    description: 'Boxy fit, drop shoulder, puff print branding on the back. Need tech pack review.',
    referenceImages: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'],
    status: 'SENT',
    createdAt: '2026-08-18T10:00:00Z',
    expiresAt: '2026-08-25T10:00:00Z'
  },
  // QUOTED — has quotes, client deciding
  {
    id: 'brf_002',
    clientId: 'usr_123',
    clientName: 'John Doe',
    garmentType: 'Custom Adire Shirt',
    quantity: 30,
    budgetNgn: 1200000,
    deadline: '2026-10-01',
    description: 'Hand-dyed adire pattern, relaxed fit, mother-of-pearl buttons.',
    referenceImages: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500'],
    status: 'QUOTED',
    createdAt: '2026-08-15T14:30:00Z',
    expiresAt: '2026-08-22T14:30:00Z'
  },
  // DECLINED — maker declined, reason mandatory
  {
    id: 'brf_003',
    clientId: 'usr_123',
    clientName: 'John Doe',
    garmentType: 'Leather Bomber Jacket',
    quantity: 15,
    budgetNgn: 900000,
    deadline: '2026-09-20',
    description: 'Genuine leather, custom zippers.',
    referenceImages: [],
    status: 'DECLINED',
    createdAt: '2026-08-10T09:00:00Z',
    expiresAt: '2026-08-17T09:00:00Z',
    declineReason: 'Budget below our minimum for genuine leather sourcing.'
  },
  // EXPIRED — 7-day clock ran out with no accepted quote
  {
    id: 'brf_004',
    clientId: 'usr_123',
    clientName: 'John Doe',
    garmentType: 'Cargo Trousers',
    quantity: 40,
    budgetNgn: 1600000,
    deadline: '2026-09-30',
    description: 'Ripstop cargo with articulated knees.',
    referenceImages: [],
    status: 'EXPIRED',
    createdAt: '2026-08-01T08:00:00Z',
    expiresAt: '2026-08-08T08:00:00Z'
  }
];

export const mockQuotes: Quote[] = [
  // Revision 1 — superseded by revision 2
  {
    id: 'quo_001',
    briefId: 'brf_002',
    makerId: 'mkr_002',
    makerName: 'Lagos Atelier',
    quotedPriceNgn: 1250000,
    productionTimeDays: 28,
    notes: 'Initial quote. Sourcing imported buttons raised cost.',
    status: 'SUPERSEDED',
    revisionNumber: 1,
    createdAt: '2026-08-16T09:15:00Z'
  },
  // Revision 2 — accepted by client
  {
    id: 'quo_002',
    briefId: 'brf_002',
    makerId: 'mkr_002',
    makerName: 'Lagos Atelier',
    quotedPriceNgn: 1100000,
    productionTimeDays: 21,
    notes: 'Revised: local mother-of-pearl buttons, traditional resist-dye method.',
    status: 'ACCEPTED',
    revisionNumber: 2,
    createdAt: '2026-08-17T11:00:00Z'
  }
];

export const mockOrders: ProductionOrder[] = [
  // IN_ESCROW — money held, this is the trust mechanism in action
  {
    id: 'ord_001',
    quoteId: 'quo_002',
    briefId: 'brf_002',
    makerName: 'Lagos Atelier',
    garmentType: 'Custom Adire Shirt',
    quantity: 30,
    totalAmountNgn: 1100000,
    status: 'IN_ESCROW',
    escrow: {
      id: 'esc_001',
      orderId: 'ord_001',
      status: 'HELD',
      amountNgn: 1100000,
      platformFeeNgn: 110000,      // 10% Brutige commission
      makerPayoutNgn: 990000,
      heldAt: '2026-08-19T12:00:00Z',
      autoReleaseAt: '2026-08-26T12:00:00Z'   // 7-day auto-release window
    },
    expectedDelivery: '2026-10-01',
    createdAt: '2026-08-19T12:00:00Z'
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg_001',
    orderId: 'ord_001',
    senderId: 'usr_123',
    senderName: 'John Doe',
    text: 'Hi, can you confirm the deposit was received?',
    timestamp: '2026-08-19T12:30:00Z'
  },
  {
    id: 'msg_002',
    orderId: 'ord_001',
    senderId: 'mkr_002',
    senderName: 'Lagos Atelier',
    text: 'Yes, funds are held in escrow. We start dyeing the fabric tomorrow.',
    timestamp: '2026-08-19T13:00:00Z'
  },
  {
    id: 'msg_003',
    orderId: 'ord_001',
    senderId: 'system',
    senderName: 'Brutige',
    text: 'Payment of ₦1,100,000 held in escrow. Auto-release in 7 days after delivery confirmation.',
    timestamp: '2026-08-19T13:05:00Z',
    isSystemNote: true
  }
];