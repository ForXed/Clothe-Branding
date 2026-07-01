/**
 * Order Management Utilities
 * Handles order creation, storage, and retrieval
 */

export interface Order {
  id: string;
  type: 'regular' | 'custom';
  status: OrderStatus;
  
  // Items
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  shippingCost: number;
  vat: number;
  total: number;
  
  // Shipping
  shippingMethod: string;
  shippingAddress: ShippingAddress;
  
  // Payment
  paymentRef: string;
  paidAt: string;
  
  // Metadata
  createdAt: string;
  trackingNumber?: string;
  quoteId?: string; // For custom orders
  deliveryDate?: string;
  
  // Maker info (for custom orders)
  maker?: {
    id: string;
    name: string;
    email: string;
  };
}

export type OrderStatus = 
  | 'pending_payment'
  | 'confirmed'
  | 'in_production'
  | 'quality_check'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface OrderItem {
  id: string | number;
  title: string;
  quantity: number;
  price: number;
  subtotal?: number;
  img?: string;
}

export interface ShippingAddress {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip?: string;
  country: string;
}

// Generate unique order ID
export const generateOrderId = (prefix: string = 'ORD'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Generate tracking number
export const generateTrackingNumber = (): string => {
  return `BRU-${Date.now().toString().slice(-8)}`;
};

// Create new order
export const createOrder = (data: Partial<Order>): Order => {
  const orderId = data.id || generateOrderId();
  
  const order: Order = {
    id: orderId,
    type: data.type || 'regular',
    status: 'confirmed',
    items: data.items || [],
    subtotal: data.subtotal || 0,
    shippingCost: data.shippingCost || 0,
    vat: data.vat || 0,
    total: data.total || 0,
    shippingMethod: data.shippingMethod || '',
    shippingAddress: data.shippingAddress || {} as ShippingAddress,
    paymentRef: data.paymentRef || '',
    paidAt: data.paidAt || new Date().toISOString(),
    createdAt: data.createdAt || new Date().toISOString(),
    trackingNumber: data.trackingNumber || generateTrackingNumber(),
    quoteId: data.quoteId,
    deliveryDate: data.deliveryDate,
    maker: data.maker
  };
  
  return order;
};

// Save order to localStorage
export const saveOrder = (order: Order): void => {
  localStorage.setItem(`order_${order.id}`, JSON.stringify(order));
  
  // Also add to orders list
  const ordersList = getOrdersList();
  if (!ordersList.includes(order.id)) {
    ordersList.push(order.id);
    localStorage.setItem('brutige_orders_list', JSON.stringify(ordersList));
  }
};

// Get order by ID
export const getOrder = (orderId: string): Order | null => {
  const saved = localStorage.getItem(`order_${orderId}`);
  return saved ? JSON.parse(saved) : null;
};

// Get all orders
export const getAllOrders = (): Order[] => {
  const ordersList = getOrdersList();
  return ordersList
    .map(id => getOrder(id))
    .filter((order): order is Order => order !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get orders list from localStorage
const getOrdersList = (): string[] => {
  const saved = localStorage.getItem('brutige_orders_list');
  return saved ? JSON.parse(saved) : [];
};

// Update order status
export const updateOrderStatus = (orderId: string, status: OrderStatus): void => {
  const order = getOrder(orderId);
  if (order) {
    order.status = status;
    saveOrder(order);
  }
};

// Delete order
export const deleteOrder = (orderId: string): void => {
  localStorage.removeItem(`order_${orderId}`);
  
  const ordersList = getOrdersList();
  const updatedList = ordersList.filter(id => id !== orderId);
  localStorage.setItem('brutige_orders_list', JSON.stringify(updatedList));
};

// Get orders by status
export const getOrdersByStatus = (status: OrderStatus): Order[] => {
  return getAllOrders().filter(order => order.status === status);
};

// Calculate order totals
export const calculateOrderTotals = (
  items: OrderItem[],
  shippingCost: number = 0,
  taxRate: number = 7.5
): { subtotal: number; vat: number; total: number } => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  const vat = subtotal * (taxRate / 100);
  const total = subtotal + shippingCost + vat;
  
  return { subtotal, vat, total };
};

// Format order status for display
export const formatOrderStatus = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    pending_payment: 'Pending Payment',
    confirmed: 'Confirmed',
    in_production: 'In Production',
    quality_check: 'Quality Check',
    shipped: 'Shipped',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    disputed: 'Disputed'
  };
  
  return statusMap[status] || status;
};

// Get status color
export const getStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    pending_payment: '#f59e0b',
    confirmed: '#3b82f6',
    in_production: '#8b5cf6',
    quality_check: '#ec4899',
    shipped: '#06b6d4',
    delivered: '#10b981',
    completed: '#22c55e',
    cancelled: '#6b7280',
    disputed: '#ef4444'
  };
  
  return colorMap[status] || '#6b7280';
};