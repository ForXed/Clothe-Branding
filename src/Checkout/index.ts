/**
 * Checkout Utilities - Central Export
 * Import from here to access all utilities
 */

// Payment utilities
export {
  initializePayment,
  generatePaymentReference,
  verifyPayment,
  getPaymentStatus,
  savePaymentStatus
} from '../Checkout/utils/payment';

export type { PaymentResponse, PaymentConfig } from '../Checkout/utils/payment';

// Invoice utilities
export {
  generateInvoice,
  downloadInvoice,
  createInvoiceFromOrder
} from '../Checkout/utils/invoice';

export type { InvoiceData } from '../Checkout/utils/invoice';

// Receipt utilities
export {
  generateReceipt,
  downloadReceipt,
  createReceiptFromOrder
} from '../Checkout/utils/receipt';

export type { ReceiptData } from '../Checkout/utils/receipt';

// Shipping utilities
export {
  SHIPPING_OPTIONS,
  calculateShipping,
  getShippingOption,
  calculateDeliveryDate,
  formatShippingOption,
  isFreeShipping,
  getDiscountedShipping
} from '../Checkout/utils/shipping';

export type { ShippingOption, ShippingAddress } from '../Checkout/utils/shipping';

// Order utilities
export {
  generateOrderId,
  generateTrackingNumber,
  createOrder,
  saveOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrdersByStatus,
  calculateOrderTotals,
  formatOrderStatus,
  getStatusColor
} from '../Checkout/utils/order';

export type { 
  Order, 
  OrderStatus, 
  OrderItem, 
  ShippingAddress as OrderShippingAddress 
} from '../Checkout/utils/order';

// Formatting utilities
export {
  formatNaira,
  formatDate,
  formatDateTime,
  getRelativeTime,
  formatPhoneNumber,
  formatNumber,
  truncateText,
  formatPercentage,
  getInitials,
  formatFileSize,
  isValidEmail,
  isValidNigerianPhone,
  capitalize,
  toTitleCase
} from '../Checkout/utils/formatting';