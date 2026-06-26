// ─── Notification Priority ───────────────────────────────────────────────────

export type NotificationPriority =
  | "critical"
  | "important"
  | "normal"
  | "success";

// ─── Notification Categories ─────────────────────────────────────────────────

export type BuyerCategory =
  | "order"
  | "escrow"
  | "brand_vault"
  | "message"
  | "dispute"
  | "system";

export type MakerCategory =
  | "new_order"
  | "escrow"
  | "message"
  | "shipping"
  | "delivery"
  | "verification"
  | "system";

// ─── Notification Event Types ─────────────────────────────────────────────────

export type BuyerEventType =
  | "order_submitted"
  | "order_accepted"
  | "production_started"
  | "order_shipped"
  | "delivery_confirmation_needed"
  | "escrow_activated"
  | "escrow_released"
  | "escrow_auto_release_warning"
  | "pdf_generated"
  | "vault_incomplete"
  | "new_message"
  | "dispute_opened";

export type MakerEventType =
  | "new_order"
  | "brand_vault_attached"
  | "escrow_secured"
  | "new_message"
  | "deadline_approaching"
  | "production_overdue"
  | "delivery_confirmed"
  | "escrow_released"
  | "verification_submitted"
  | "verification_approved"
  | "verification_rejected";

// ─── Base Notification ────────────────────────────────────────────────────────

export interface BaseNotification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  priority: NotificationPriority;
  orderId?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface BuyerNotification extends BaseNotification {
  type: "buyer";
  category: BuyerCategory;
  eventType: BuyerEventType;
}

export interface MakerNotification extends BaseNotification {
  type: "maker";
  category: MakerCategory;
  eventType: MakerEventType;
  amount?: string; // for payout notifications
}

export type AppNotification = BuyerNotification | MakerNotification;

// ─── Mock Data Factory ────────────────────────────────────────────────────────

export const MOCK_BUYER_NOTIFICATIONS: BuyerNotification[] = [
  {
    id: "b1",
    type: "buyer",
    category: "order",
    eventType: "delivery_confirmation_needed",
    title: "Action Required",
    body: "Please confirm delivery for order #BR-204. Funds cannot be released until confirmed.",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
    priority: "important",
    orderId: "BR-204",
    actionLabel: "Confirm Delivery",
  },
  {
    id: "b2",
    type: "buyer",
    category: "message",
    eventType: "new_message",
    title: "New Message",
    body: "Kova Garments sent a message regarding order #BR-204.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: "normal",
    orderId: "BR-204",
    actionLabel: "Open Conversation",
  },
  {
    id: "b3",
    type: "buyer",
    category: "escrow",
    eventType: "escrow_auto_release_warning",
    title: "Reminder",
    body: "Your escrow will automatically release in 48 hours unless a dispute is raised.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    priority: "important",
    orderId: "BR-204",
    actionLabel: "Review Order",
  },
  {
    id: "b4",
    type: "buyer",
    category: "escrow",
    eventType: "escrow_activated",
    title: "Escrow Activated",
    body: "Your payment has been secured and is being held safely until delivery is confirmed.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
    priority: "success",
    orderId: "BR-204",
  },
  {
    id: "b5",
    type: "buyer",
    category: "order",
    eventType: "order_accepted",
    title: "Order Accepted",
    body: "Kova Garments has accepted your order. Production will begin shortly.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
    priority: "normal",
    orderId: "BR-204",
  },
  {
    id: "b6",
    type: "buyer",
    category: "dispute",
    eventType: "dispute_opened",
    title: "Dispute Opened",
    body: "A dispute has been opened for order #BR-189. The Brutige team will review the case.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    priority: "critical",
    orderId: "BR-189",
    actionLabel: "View Dispute",
  },
  {
    id: "b7",
    type: "buyer",
    category: "brand_vault",
    eventType: "pdf_generated",
    title: "Specification Ready",
    body: "Your production specification sheet was generated successfully.",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
    read: true,
    priority: "normal",
    orderId: "BR-204",
    actionLabel: "View PDF",
  },
];

export const MOCK_MAKER_NOTIFICATIONS: MakerNotification[] = [
  {
    id: "m1",
    type: "maker",
    category: "new_order",
    eventType: "new_order",
    title: "New Order Received",
    body: "A new order (#BR-211) has been placed. Production details are ready.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: "important",
    orderId: "BR-211",
    actionLabel: "Open Order",
  },
  {
    id: "m2",
    type: "maker",
    category: "escrow",
    eventType: "escrow_released",
    title: "Payout Released",
    body: "Funds for order #BR-197 have been released to your payout account.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: "success",
    orderId: "BR-197",
    amount: "₦145,000",
    actionLabel: "View Payout",
  },
  {
    id: "m3",
    type: "maker",
    category: "new_order",
    eventType: "brand_vault_attached",
    title: "Production Spec Received",
    body: "The buyer attached a Brand Vault specification sheet for order #BR-211.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    read: false,
    priority: "important",
    orderId: "BR-211",
    actionLabel: "Open PDF",
  },
  {
    id: "m4",
    type: "maker",
    category: "shipping",
    eventType: "deadline_approaching",
    title: "Production Deadline Approaching",
    body: "Order #BR-204 is due in 3 days. Mark as shipped before the deadline.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    priority: "important",
    orderId: "BR-204",
    actionLabel: "Update Status",
  },
  {
    id: "m5",
    type: "maker",
    category: "escrow",
    eventType: "escrow_secured",
    title: "Payment Secured",
    body: "Funds for order #BR-211 have been placed into escrow. Production may begin.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    priority: "success",
    orderId: "BR-211",
  },
  {
    id: "m6",
    type: "maker",
    category: "delivery",
    eventType: "delivery_confirmed",
    title: "Delivery Confirmed",
    body: "Urban District confirmed receipt of order #BR-197.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    priority: "success",
    orderId: "BR-197",
  },
  {
    id: "m7",
    type: "maker",
    category: "shipping",
    eventType: "production_overdue",
    title: "Production Delayed",
    body: "Order #BR-188 has exceeded its expected completion date.",
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000),
    read: true,
    priority: "critical",
    orderId: "BR-188",
    actionLabel: "Resolve Now",
  },
  {
    id: "m8",
    type: "maker",
    category: "verification",
    eventType: "verification_approved",
    title: "You're Verified",
    body: "Your application has been approved. Studio access is now available.",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true,
    priority: "success",
  },
];
