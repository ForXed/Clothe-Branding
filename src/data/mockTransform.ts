// src/data/mockTransform.ts
// 
// 📋 PURPOSE:
// This file defines the new B2B MVP data shapes (Brief, Quote, Order, Maker).
// It replaces the old product/price/stock shape with manufacturing-specific fields.
// 
// 🔄 BACKEND INTEGRATION:
// When the real API is ready, replace the mock arrays with real fetch calls.
// The interfaces here match the ERD contract, so swapping mocks for real data
// will be a simple find-and-replace.

// ============================================
// INTERFACES (Match the ERD contract)
// ============================================

export interface Maker {
  id: string;
  name: string;
  handle: string;
  specialty: string;        // e.g., "Heavyweight Streetwear", "Technical Outerwear"
  location: string;
  minOrderQuantity: number; // MOQ - Minimum Order Quantity
  avatarUrl: string;
  rating: number;
}

export interface Brief {
  id: string;
  clientId: string;
  clientName: string;
  garmentType: string;       // e.g., "450GSM Heavyweight Hoodie"
  quantity: number;
  budgetNgn: number;         // Budget in Nigerian Naira
  deadline: string;          // ISO date string, e.g., "2026-12-15"
  description: string;
  referenceImages: string[];
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  createdAt: string;         // ISO date string
}

export interface Quote {
  id: string;
  briefId: string;
  makerId: string;
  makerName: string;
  quotedPriceNgn: number;
  productionTimeDays: number;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Order {
  id: string;
  quoteId: string;
  briefId: string;
  makerName: string;
  garmentType: string;
  quantity: number;
  totalAmountNgn: number;
  status: 'deposit_paid' | 'in_production' | 'quality_check' | 'shipped' | 'delivered';
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
// MOCK DATA (Nigerian context, realistic)
// ============================================

export const mockMakers: Maker[] = [
  {
    id: 'mkr_001',
    name: 'Aura Studio',
    handle: '@aurastudio',
    specialty: 'Heavyweight Streetwear & Cut-and-Sew',
    location: 'Lagos, Nigeria',
    minOrderQuantity: 20,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    rating: 4.8
  },
  {
    id: 'mkr_002',
    name: 'Lagos Atelier',
    handle: '@lagosatelier',
    specialty: 'Bespoke Tailoring & Adire',
    location: 'Lagos, Nigeria',
    minOrderQuantity: 10,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    rating: 4.9
  },
  {
    id: 'mkr_003',
    name: 'Abuja Studio',
    handle: '@abujastudio',
    specialty: 'Technical Outerwear',
    location: 'Abuja, Nigeria',
    minOrderQuantity: 25,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    rating: 4.7
  }
];

export const mockBriefs: Brief[] = [
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
    status: 'pending',
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'brf_002',
    clientId: 'usr_123',
    clientName: 'John Doe',
    garmentType: 'Custom Adire Shirt',
    quantity: 30,
    budgetNgn: 1200000,
    deadline: '2026-10-01',
    description: 'Hand-dyed adire pattern, relaxed fit, mother-of-pearl buttons.',
    referenceImages: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'
    ],
    status: 'quoted',
    createdAt: '2026-08-05T14:30:00Z'
  }
];

export const mockQuotes: Quote[] = [
  {
    id: 'quo_001',
    briefId: 'brf_002',
    makerId: 'mkr_002',
    makerName: 'Lagos Atelier',
    quotedPriceNgn: 1100000,
    productionTimeDays: 21,
    notes: 'We can achieve the adire pattern using our traditional resist-dye method. Buttons sourced from Italy.',
    status: 'pending',
    createdAt: '2026-08-08T09:15:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord_001',
    quoteId: 'quo_001',
    briefId: 'brf_002',
    makerName: 'Lagos Atelier',
    garmentType: 'Custom Adire Shirt',
    quantity: 30,
    totalAmountNgn: 1100000,
    status: 'deposit_paid',
    expectedDelivery: '2026-10-01',
    createdAt: '2026-08-09T11:00:00Z'
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg_001',
    orderId: 'ord_001',
    senderId: 'usr_123',
    senderName: 'John Doe',
    text: 'Hi, can you confirm the deposit was received?',
    timestamp: '2026-08-09T11:30:00Z'
  },
  {
    id: 'msg_002',
    orderId: 'ord_001',
    senderId: 'mkr_002',
    senderName: 'Lagos Atelier',
    text: 'Yes, deposit confirmed. We\'ll start dyeing the fabric tomorrow.',
    timestamp: '2026-08-09T12:00:00Z'
  }
];