// // ─── Notification Categories ─────────────────────────────────────────────────

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
  | "verification_approved";
//   | "verification_rejected";

// ─── Base Notification ────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  actionLabel?: string;
  onAction?: () => void;
}

// export interface Notification {
//   id: string;
//   timestamp: string;
//   read: boolean;
//   type: NotificationType;
//   title: string;
//   message: string;
// }
export const NOTIFICATION_TYPES = {
  BUYER: "buyer",
  MAKER: "maker",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export interface BuyerNotification extends Notification {
  type: typeof NOTIFICATION_TYPES.BUYER;
  category: BuyerCategory;
  eventType: BuyerEventType;
}

export interface MakerNotification extends Notification {
  type: typeof NOTIFICATION_TYPES.MAKER;
  category: MakerCategory;
  eventType: MakerEventType;
  amount?: string; // for payout notifications
}

export type AppNotification = BuyerNotification | MakerNotification;

// // ─── Mock Data Factory ────────────────────────────────────────────────────────

export interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addBuyerNotification: (
    notification: Omit<BuyerNotification, "id" | "timestamp" | "read">,
  ) => void;

  addMakerNotification: (
    notification: Omit<MakerNotification, "id" | "timestamp" | "read">,
  ) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
  getByType: (type: NotificationType) => AppNotification[];
  getUnread: () => AppNotification[];
  _setUnreadCount: (count: number) => void;
  initializeNotifications: (notifications: AppNotification[]) => void;
}

// -----------------------------------------------------------------------------
// Buyer Notifications
// -----------------------------------------------------------------------------

export const buyerNotifications: BuyerNotification[] = [
  {
    id: "buyer-1",
    type: "buyer",
    category: "order",
    eventType: "order_submitted",
    title: "Order Submitted",
    message: "Your order #ORD-1042 has been submitted successfully.",
    timestamp: "2026-07-09T08:15:00Z",
    read: false,
    orderId: "ORD-1042",
    actionLabel: "View Order",
  },
  {
    id: "buyer-2",
    type: "buyer",
    category: "order",
    eventType: "order_accepted",
    title: "Order Accepted",
    message: "Pixel Studio accepted your branding project.",
    timestamp: "2026-07-09T09:30:00Z",
    read: false,
    orderId: "ORD-1042",
    actionLabel: "Open Order",
  },
  {
    id: "buyer-3",
    type: "buyer",
    category: "order",
    eventType: "production_started",
    title: "Production Started",
    message: "Work has officially started on your project.",
    timestamp: "2026-07-08T13:20:00Z",
    read: true,
    orderId: "ORD-1042",
  },
  {
    id: "buyer-4",
    type: "buyer",
    category: "order",
    eventType: "order_shipped",
    title: "Files Delivered",
    message: "Your designer has delivered the final project files.",
    timestamp: "2026-07-07T17:05:00Z",
    read: false,
    orderId: "ORD-1042",
    actionLabel: "Review Delivery",
  },
  {
    id: "buyer-5",
    type: "buyer",
    category: "order",
    eventType: "delivery_confirmation_needed",
    title: "Confirm Delivery",
    message: "Please confirm you've received your project.",
    timestamp: "2026-07-07T17:30:00Z",
    read: false,
    orderId: "ORD-1042",
    actionLabel: "Confirm",
  },
  {
    id: "buyer-6",
    type: "buyer",
    category: "escrow",
    eventType: "escrow_activated",
    title: "Escrow Activated",
    message: "Your payment is securely held in escrow.",
    timestamp: "2026-07-06T11:40:00Z",
    read: true,
  },
  {
    id: "buyer-7",
    type: "buyer",
    category: "escrow",
    eventType: "escrow_released",
    title: "Escrow Released",
    message: "Payment has been released to the maker.",
    timestamp: "2026-07-05T15:15:00Z",
    read: true,
  },
  {
    id: "buyer-8",
    type: "buyer",
    category: "escrow",
    eventType: "escrow_auto_release_warning",
    title: "Auto Release Reminder",
    message:
      "Escrow will automatically release in 24 hours unless you raise an issue.",
    timestamp: "2026-07-05T09:45:00Z",
    read: false,
  },
  {
    id: "buyer-9",
    type: "buyer",
    category: "brand_vault",
    eventType: "pdf_generated",
    title: "Brand Guide Ready",
    message: "Your Brand Vault PDF has been generated.",
    timestamp: "2026-07-04T10:10:00Z",
    read: true,
    actionLabel: "Download",
  },
  {
    id: "buyer-10",
    type: "buyer",
    category: "brand_vault",
    eventType: "vault_incomplete",
    title: "Complete Your Brand Vault",
    message: "Upload your logo and color palette to finish setup.",
    timestamp: "2026-07-03T08:30:00Z",
    read: false,
    actionLabel: "Complete",
  },
  {
    id: "buyer-11",
    type: "buyer",
    category: "message",
    eventType: "new_message",
    title: "New Message",
    message: "Pixel Studio sent you a new message.",
    timestamp: "2026-07-09T12:50:00Z",
    read: false,
    actionLabel: "Reply",
  },
  {
    id: "buyer-12",
    type: "buyer",
    category: "dispute",
    eventType: "dispute_opened",
    title: "Dispute Opened",
    message: "A dispute has been opened for order #ORD-1038.",
    timestamp: "2026-07-02T16:00:00Z",
    read: true,
    orderId: "ORD-1038",
    actionLabel: "View",
  },
];

// -----------------------------------------------------------------------------
// Maker Notifications
// -----------------------------------------------------------------------------

export const makerNotifications: MakerNotification[] = [
  {
    id: "maker-1",
    type: "maker",
    category: "new_order",
    eventType: "new_order",
    title: "New Order",
    message: "You received a new branding project.",
    timestamp: "2026-07-09T09:10:00Z",
    read: false,
    orderId: "ORD-2001",
    actionLabel: "Accept",
  },
  {
    id: "maker-2",
    type: "maker",
    category: "new_order",
    eventType: "brand_vault_attached",
    title: "Brand Assets Attached",
    message: "The buyer included a complete Brand Vault.",
    timestamp: "2026-07-09T09:20:00Z",
    read: false,
    orderId: "ORD-2001",
  },
  {
    id: "maker-3",
    type: "maker",
    category: "escrow",
    eventType: "escrow_secured",
    title: "Escrow Secured",
    message: "Payment has been secured. You can start work safely.",
    timestamp: "2026-07-09T09:40:00Z",
    read: false,
  },
  {
    id: "maker-4",
    type: "maker",
    category: "message",
    eventType: "new_message",
    title: "New Message",
    message: "Your buyer has replied.",
    timestamp: "2026-07-09T11:25:00Z",
    read: false,
    actionLabel: "Reply",
  },
  {
    id: "maker-5",
    type: "maker",
    category: "shipping",
    eventType: "deadline_approaching",
    title: "Deadline Approaching",
    message: "Order #ORD-1988 is due in 24 hours.",
    timestamp: "2026-07-08T15:45:00Z",
    read: false,
    orderId: "ORD-1988",
  },
  {
    id: "maker-6",
    type: "maker",
    category: "shipping",
    eventType: "production_overdue",
    title: "Production Overdue",
    message: "This order has passed its expected completion date.",
    timestamp: "2026-07-07T09:30:00Z",
    read: false,
    orderId: "ORD-1975",
  },
  {
    id: "maker-7",
    type: "maker",
    category: "delivery",
    eventType: "delivery_confirmed",
    title: "Delivery Confirmed",
    message: "The buyer confirmed successful delivery.",
    timestamp: "2026-07-06T18:00:00Z",
    read: true,
    orderId: "ORD-1960",
  },
  {
    id: "maker-8",
    type: "maker",
    category: "escrow",
    eventType: "escrow_released",
    title: "Payment Released",
    message: "Escrow funds have been transferred to your wallet.",
    timestamp: "2026-07-06T18:10:00Z",
    read: false,
    amount: "$420.00",
  },
  {
    id: "maker-9",
    type: "maker",
    category: "verification",
    eventType: "verification_submitted",
    title: "Verification Submitted",
    message: "Your identity verification is being reviewed.",
    timestamp: "2026-07-05T14:15:00Z",
    read: true,
  },
  {
    id: "maker-10",
    type: "maker",
    category: "verification",
    eventType: "verification_approved",
    title: "Verification Approved",
    message: "Congratulations! Your account is now verified.",
    timestamp: "2026-07-04T09:00:00Z",
    read: true,
  },
];

export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const isThisYear = date.getFullYear() === now.getFullYear();
  if (isThisYear) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
};

type NotificationCategory = BuyerCategory | MakerCategory;

