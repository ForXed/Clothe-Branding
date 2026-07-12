import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './OrdersView.module.css';

// --- TypeScript Interfaces ---
interface TimelineStep {
  stage: string;
  date: string;
  completed: boolean;
}

interface ItemDetail {
  name: string;
  size: string;
  quantity: number;
  price: string;
  image?: string;
  maker?: string;
}

interface CustomSpec {
  label: string;
  value: string;
}

interface Order {
  id: string;
  orderType: 'standard' | 'custom';
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'confirmed' | 'cancelled' | 'requested' | 'quoted' | 'approved' | 'in_production';
  progress: number;
  items: number;
  total: string;
  tracking: string | null;
  timeline: TimelineStep[];
  items_detail: ItemDetail[];
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'deposit_paid';
  estimatedDelivery: string;
  confirmationCode: string;
  makerName: string;
  makerId: string;
  notes?: string;
  createdAt: string;
  // Custom order specific fields
  quoteAmount?: string;
  depositAmount?: string;
  depositPercentage?: number;
  customSpecs?: CustomSpec[];
  referenceImages?: string[];
  quoteExpiry?: string;
}

interface Filter {
  id: string;
  label: string;
  count: number;
}

const OrdersView: React.FC = () => {
  const navigate = useNavigate();
  
  // --- State ---
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmationInput, setConfirmationInput] = useState<string>('');
  const [cancelReason, setCancelReason] = useState<string>('');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- Helper: Show toast notification ---
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Load Orders ---
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockOrders: Order[] = [
        // Standard Orders
        {
          id: 'BRT-2025-001',
          orderType: 'standard',
          date: 'Jan 28, 2025',
          status: 'delivered',
          progress: 90,
          items: 2,
          total: '₦45,500',
          tracking: 'TRK123456789',
          shippingAddress: '12 Victoria Island, Lagos, Nigeria',
          paymentMethod: 'Bank Transfer',
          paymentStatus: 'paid',
          estimatedDelivery: 'Feb 6, 2025',
          confirmationCode: 'BRT-7X9K2M',
          makerName: 'Lagos Atelier',
          makerId: 'lagos-atelier',
          createdAt: '2025-01-28T10:00:00Z',
          timeline: [
            { stage: 'Order Received', date: 'Jan 28', completed: true },
            { stage: 'Production', date: 'Jan 30', completed: true },
            { stage: 'Quality Check', date: 'Feb 02', completed: true },
            { stage: 'Shipped', date: 'Feb 04', completed: true },
            { stage: 'Delivered', date: 'Feb 06', completed: true }
          ],
          items_detail: [
            { name: "Oversized 'Brut' Tee", size: 'L', quantity: 1, price: '₦18,000', maker: 'Lagos Atelier' },
            { name: 'Infrastructure Hoodie', size: 'M', quantity: 1, price: '₦27,500', maker: 'Lagos Atelier' }
          ]
        },
        {
          id: 'BRT-2025-002',
          orderType: 'standard',
          date: 'Feb 02, 2025',
          status: 'processing',
          progress: 45,
          items: 1,
          total: '₦78,000',
          tracking: null,
          shippingAddress: '45 Maitama, Abuja, Nigeria',
          paymentMethod: 'Card Payment',
          paymentStatus: 'paid',
          estimatedDelivery: 'Feb 14, 2025',
          confirmationCode: 'BRT-3H8N5P',
          makerName: 'Abuja Studio',
          makerId: 'abuja-studio',
          createdAt: '2025-02-02T14:30:00Z',
          timeline: [
            { stage: 'Order Received', date: 'Feb 02', completed: true },
            { stage: 'Production', date: 'In Progress', completed: false },
            { stage: 'Quality Check', date: 'Pending', completed: false },
            { stage: 'Shipped', date: 'Pending', completed: false },
            { stage: 'Delivered', date: 'Pending', completed: false }
          ],
          items_detail: [
            { name: 'Architectural Coat', size: 'L', quantity: 1, price: '₦78,000', maker: 'Abuja Studio' }
          ]
        },
        {
          id: 'BRT-2025-003',
          orderType: 'standard',
          date: 'Feb 04, 2025',
          status: 'shipped',
          progress: 80,
          items: 3,
          total: '₦95,000',
          tracking: 'TRK987654321',
          shippingAddress: '8 GRA, Port Harcourt, Nigeria',
          paymentMethod: 'Bank Transfer',
          paymentStatus: 'paid',
          estimatedDelivery: 'Feb 14, 2025',
          confirmationCode: 'BRT-9K4M7X',
          makerName: 'Kano Craft Co.',
          makerId: 'kano-craft',
          notes: 'Please deliver before 5pm',
          createdAt: '2025-02-04T09:15:00Z',
          timeline: [
            { stage: 'Order Received', date: 'Feb 04', completed: true },
            { stage: 'Production', date: 'Feb 06', completed: true },
            { stage: 'Quality Check', date: 'Feb 08', completed: true },
            { stage: 'Shipped', date: 'Feb 10', completed: true },
            { stage: 'Delivered', date: 'Expected Feb 14', completed: false }
          ],
          items_detail: [
            { name: 'Minimalist Shell Jacket', size: 'M', quantity: 2, price: '₦38,000', maker: 'Kano Craft Co.' },
            { name: "Oversized 'Brut' Tee", size: 'XL', quantity: 1, price: '₦19,000', maker: 'Kano Craft Co.' }
          ]
        },
        {
          id: 'BRT-2025-004',
          orderType: 'standard',
          date: 'Jan 15, 2025',
          status: 'confirmed',
          progress: 100,
          items: 1,
          total: '₦32,000',
          tracking: 'TRK555666777',
          shippingAddress: '22 Lekki Phase 1, Lagos, Nigeria',
          paymentMethod: 'Card Payment',
          paymentStatus: 'paid',
          estimatedDelivery: 'Jan 25, 2025',
          confirmationCode: 'BRT-2P5N8K',
          makerName: 'Lagos Atelier',
          makerId: 'lagos-atelier',
          createdAt: '2025-01-15T11:20:00Z',
          timeline: [
            { stage: 'Order Received', date: 'Jan 15', completed: true },
            { stage: 'Production', date: 'Jan 17', completed: true },
            { stage: 'Quality Check', date: 'Jan 20', completed: true },
            { stage: 'Shipped', date: 'Jan 22', completed: true },
            { stage: 'Delivered', date: 'Jan 24', completed: true },
            { stage: 'Confirmed', date: 'Jan 25', completed: true }
          ],
          items_detail: [
            { name: 'Heavy Sweatpants', size: 'M', quantity: 1, price: '₦32,000', maker: 'Lagos Atelier' }
          ]
        },
        // Custom Orders
        {
          id: 'CUST-2025-001',
          orderType: 'custom',
          date: 'Feb 08, 2025',
          status: 'quoted',
          progress: 20,
          items: 1,
          total: '₦125,000',
          tracking: null,
          shippingAddress: '15 Ikoyi, Lagos, Nigeria',
          paymentMethod: 'Bank Transfer',
          paymentStatus: 'pending',
          estimatedDelivery: 'Mar 10, 2025',
          confirmationCode: 'BRT-5K8M2N',
          makerName: 'Lagos Atelier',
          makerId: 'lagos-atelier',
          createdAt: '2025-02-08T16:45:00Z',
          quoteAmount: '₦125,000',
          depositAmount: '₦37,500',
          depositPercentage: 30,
          quoteExpiry: 'Feb 15, 2025',
          customSpecs: [
            { label: 'Style', value: 'Custom Bomber Jacket' },
            { label: 'Material', value: 'Premium Leather' },
            { label: 'Color', value: 'Black with Gold Accents' },
            { label: 'Size', value: 'XL (Custom Fit)' },
            { label: 'Special Request', value: 'Embroidered initials "JK" on chest' }
          ],
          referenceImages: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
            'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=300'
          ],
          notes: 'Need it for a wedding on March 15th',
          timeline: [
            { stage: 'Request Submitted', date: 'Feb 08', completed: true },
            { stage: 'Quote Received', date: 'Feb 10', completed: true },
            { stage: 'Customer Approval', date: 'Pending', completed: false },
            { stage: 'Deposit Payment', date: 'Pending', completed: false },
            { stage: 'Production', date: 'Pending', completed: false },
            { stage: 'Delivery', date: 'Pending', completed: false }
          ],
          items_detail: [
            { name: 'Custom Leather Bomber Jacket', size: 'XL', quantity: 1, price: '₦125,000', maker: 'Lagos Atelier' }
          ]
        },
        {
          id: 'CUST-2025-002',
          orderType: 'custom',
          date: 'Jan 20, 2025',
          status: 'in_production',
          progress: 60,
          items: 1,
          total: '₦85,000',
          tracking: null,
          shippingAddress: '30 Wuse 2, Abuja, Nigeria',
          paymentMethod: 'Card Payment',
          paymentStatus: 'deposit_paid',
          estimatedDelivery: 'Feb 20, 2025',
          confirmationCode: 'BRT-9N3K7P',
          makerName: 'Abuja Studio',
          makerId: 'abuja-studio',
          createdAt: '2025-01-20T10:30:00Z',
          quoteAmount: '₦85,000',
          depositAmount: '₦25,500',
          depositPercentage: 30,
          customSpecs: [
            { label: 'Style', value: 'Custom Wedding Gown' },
            { label: 'Material', value: 'Silk & Lace' },
            { label: 'Color', value: 'Ivory White' },
            { label: 'Size', value: 'Custom Measurements' },
            { label: 'Special Request', value: 'Hand-beaded bodice, 3-meter train' }
          ],
          referenceImages: [
            'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=300'
          ],
          notes: 'Wedding date is March 1st, please prioritize',
          timeline: [
            { stage: 'Request Submitted', date: 'Jan 20', completed: true },
            { stage: 'Quote Received', date: 'Jan 22', completed: true },
            { stage: 'Customer Approval', date: 'Jan 23', completed: true },
            { stage: 'Deposit Paid', date: 'Jan 24', completed: true },
            { stage: 'Production', date: 'In Progress (60%)', completed: false },
            { stage: 'Delivery', date: 'Expected Feb 20', completed: false }
          ],
          items_detail: [
            { name: 'Custom Wedding Gown', size: 'Custom', quantity: 1, price: '₦85,000', maker: 'Abuja Studio' }
          ]
        },
        {
          id: 'CUST-2025-003',
          orderType: 'custom',
          date: 'Feb 05, 2025',
          status: 'requested',
          progress: 10,
          items: 1,
          total: 'Pending Quote',
          tracking: null,
          shippingAddress: '50 Trans Amadi, Port Harcourt, Nigeria',
          paymentMethod: 'Pending',
          paymentStatus: 'pending',
          estimatedDelivery: 'TBD',
          confirmationCode: 'BRT-2M5N8K',
          makerName: 'Kano Craft Co.',
          makerId: 'kano-craft',
          createdAt: '2025-02-05T14:20:00Z',
          customSpecs: [
            { label: 'Style', value: 'Custom Sneakers' },
            { label: 'Material', value: 'Premium Canvas & Leather' },
            { label: 'Color', value: 'Navy Blue with White Sole' },
            { label: 'Size', value: 'US 11' },
            { label: 'Special Request', value: 'Custom logo on tongue, personalized laces' }
          ],
          referenceImages: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
            'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300',
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300'
          ],
          notes: 'Need matching pair for my brand launch event',
          timeline: [
            { stage: 'Request Submitted', date: 'Feb 05', completed: true },
            { stage: 'Maker Review', date: 'In Progress', completed: false },
            { stage: 'Quote', date: 'Pending', completed: false },
            { stage: 'Approval', date: 'Pending', completed: false },
            { stage: 'Production', date: 'Pending', completed: false },
            { stage: 'Delivery', date: 'Pending', completed: false }
          ],
          items_detail: [
            { name: 'Custom Brand Sneakers', size: 'US 11', quantity: 1, price: 'Pending', maker: 'Kano Craft Co.' }
          ]
        }
      ];
      
      setOrders(mockOrders);
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  // --- Filters ---
  const statusFilters: Filter[] = [
    { id: 'all', label: 'All', count: orders.length },
    { id: 'active', label: 'Active', count: orders.filter(o => ['processing', 'shipped', 'requested', 'quoted', 'approved', 'in_production'].includes(o.status)).length },
    { id: 'awaiting', label: 'Awaiting Action', count: orders.filter(o => ['delivered', 'quoted', 'requested'].includes(o.status)).length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => ['confirmed', 'cancelled'].includes(o.status)).length }
  ];

  const typeFilters: Filter[] = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'standard', label: 'Standard', count: orders.filter(o => o.orderType === 'standard').length },
    { id: 'custom', label: 'Custom', count: orders.filter(o => o.orderType === 'custom').length }
  ];

  // --- Handlers ---
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.toUpperCase().trim();
    if (!query) {
      setTrackedOrder(null);
      return;
    }
    
    const found = orders.find(o => 
      o.id.includes(query) || 
      o.confirmationCode.includes(query) ||
      o.tracking?.includes(query)
    );
    
    if (found) {
      setTrackedOrder(found);
      setActiveFilter('all');
    } else {
      setTrackedOrder(null);
      showToast('Order not found. Try "BRT-2025-001" or "CUST-2025-001"', 'error');
    }
  };

  const handleViewDetails = (order: Order) => {
    navigate(`/platform/orders/track/${order.id}`, { state: { order } });
  };

  const handleOpenConfirmModal = (order: Order) => {
    setSelectedOrder(order);
    setConfirmationInput('');
    setShowConfirmModal(true);
  };

  const handleConfirmDelivery = () => {
    if (!selectedOrder) return;
    
    if (confirmationInput.toUpperCase() === selectedOrder.confirmationCode) {
      setOrders(prev => prev.map(o => 
        o.id === selectedOrder.id 
          ? { 
              ...o, 
              status: 'confirmed' as const,
              progress: 100,
              timeline: [
                ...o.timeline.slice(0, -1),
                { stage: 'Delivered', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), completed: true },
                { stage: 'Confirmed', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), completed: true }
              ]
            }
          : o
      ));
      
      setShowConfirmModal(false);
      setTrackedOrder(null);
      showToast('Delivery confirmed! Thank you for your purchase.', 'success');
    } else {
      showToast('Invalid confirmation code. Please check your order details.', 'error');
    }
  };

  const handleOpenCancelModal = (order: Order) => {
    setSelectedOrder(order);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const handleCancelOrder = () => {
    if (!selectedOrder || !cancelReason.trim()) {
      showToast('Please provide a reason for cancellation', 'error');
      return;
    }
    
    setOrders(prev => prev.map(o => 
      o.id === selectedOrder.id 
        ? { ...o, status: 'cancelled' as const, progress: 0 }
        : o
    ));
    
    setShowCancelModal(false);
    setTrackedOrder(null);
    showToast('Order cancelled. Refund will be processed within 3-5 business days.', 'success');
  };

  const handleOpenReceipt = (order: Order) => {
    setSelectedOrder(order);
    setShowReceiptModal(true);
  };

  const handleOpenContact = (order: Order) => {
    setSelectedOrder(order);
    setContactMessage('');
    setShowContactModal(true);
  };

  const handleSendMessage = () => {
    if (!contactMessage.trim()) {
      showToast('Please enter a message', 'error');
      return;
    }
    
    console.log('Message to maker:', {
      orderId: selectedOrder?.id,
      makerId: selectedOrder?.makerId,
      message: contactMessage
    });
    
    setShowContactModal(false);
    showToast('Message sent to maker!', 'success');
  };

  const handleReorder = (order: Order) => {
    showToast('Reorder feature coming soon!', 'success');
  };

  const handleViewQuote = (order: Order) => {
    setSelectedOrder(order);
    setShowQuoteModal(true);
  };

  const handleApproveQuote = () => {
    if (!selectedOrder) return;
    
    setOrders(prev => prev.map(o => 
      o.id === selectedOrder.id 
        ? { 
            ...o, 
            status: 'approved' as const,
            progress: 30,
            timeline: o.timeline.map(step => 
              step.stage === 'Customer Approval' 
                ? { ...step, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), completed: true }
                : step
            )
          }
        : o
    ));
    
    setShowQuoteModal(false);
    showToast('Quote approved! Please proceed with deposit payment.', 'success');
  };

  const handleRejectQuote = () => {
    if (!selectedOrder) return;
    
    setOrders(prev => prev.map(o => 
      o.id === selectedOrder.id 
        ? { ...o, status: 'cancelled' as const, progress: 0 }
        : o
    ));
    
    setShowQuoteModal(false);
    showToast('Quote rejected. Order has been cancelled.', 'success');
  };

  const handlePayDeposit = (order: Order) => {
    navigate(`/checkout/custom/${order.id}`, { state: { order } });
  };

  // --- Filtered Orders ---
  const filteredOrders = trackedOrder 
    ? [trackedOrder] 
    : orders.filter(order => {
        // Type filter
        if (orderTypeFilter !== 'all' && order.orderType !== orderTypeFilter) return false;
        
        // Status filter
        if (activeFilter === 'all') return true;
        if (activeFilter === 'active') return ['processing', 'shipped', 'requested', 'quoted', 'approved', 'in_production'].includes(order.status);
        if (activeFilter === 'awaiting') return ['delivered', 'quoted', 'requested'].includes(order.status);
        if (activeFilter === 'completed') return ['confirmed', 'cancelled'].includes(order.status);
        
        return true;
      });

  // --- Status Badge Config with SVG icons ---
  const getStatusConfig = (status: string, orderType: string): { label: string, class: string, icon: React.ReactNode } => {
    const configs: Record<string, { label: string, class: string, icon: React.ReactNode }> = {
      processing: { 
        label: 'Processing', 
        class: styles.statusProcessing, 
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        )
      },
      shipped: { 
        label: 'Shipped', 
        class: styles.statusShipped, 
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        )
      },
      delivered: { 
        label: 'Awaiting Confirmation', 
        class: styles.statusDelivered, 
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )
      },
      confirmed: { 
        label: 'Confirmed', 
        class: styles.statusConfirmed, 
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        )
      },
      cancelled: { 
        label: 'Cancelled', 
        class: styles.statusCancelled, 
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        )
      },
      requested: { 
        label: 'Awaiting Quote', 
        class: styles.statusRequested, 
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        )
      },
      quoted: { 
        label: 'Quote Received', 
        class: styles.statusQuoted, 
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        )
      },
      approved: { 
        label: 'Approved', 
        class: styles.statusApproved, 
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )
      },
      in_production: { 
        label: 'In Production', 
        class: styles.statusInProduction, 
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        )
      }
    };
    return configs[status] || configs.processing;
  };

  // --- Order Stats ---
  const orderStats = {
    total: orders.length,
    standard: orders.filter(o => o.orderType === 'standard').length,
    custom: orders.filter(o => o.orderType === 'custom').length,
    active: orders.filter(o => ['processing', 'shipped', 'requested', 'quoted', 'approved', 'in_production'].includes(o.status)).length
  };

  // --- Skeleton Loading ---
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.trackingHero}>
          <h1 className={styles.title}>Your Orders</h1>
          <p className={styles.subtitle}>Loading your orders...</p>
        </div>
        <div className={styles.skeletonList}>
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonHeader}></div>
              <div className={styles.skeletonBody}></div>
              <div className={styles.skeletonFooter}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {toast.type === 'success' ? (
              <polyline points="20 6 9 17 4 12"/>
            ) : (
              <>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </>
            )}
          </svg>
          {toast.message}
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <div className={styles.trackingHero}>
        <h1 className={styles.title}>Your Orders</h1>
        <p className={styles.subtitle}>Track production, confirm delivery, and manage your purchases.</p>
        
        {/* Order Stats */}
        {orders.length > 0 && (
          <div className={styles.orderStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{orderStats.total}</span>
              <span className={styles.statLabel}>Total Orders</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{orderStats.standard}</span>
              <span className={styles.statLabel}>Standard</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{orderStats.custom}</span>
              <span className={styles.statLabel}>Custom</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{orderStats.active}</span>
              <span className={styles.statLabel}>Active</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input 
            type="text" 
            placeholder="Search by Order ID, Tracking #, or Confirmation Code" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            autoComplete="off"
          />
          <button type="submit" className={styles.searchBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Search
          </button>
        </form>
      </div>

      {/* --- FILTERS --- */}
      {!trackedOrder && orders.length > 0 && (
        <>
          {/* Order Type Filter */}
          <div className={styles.filterSection}>
            <h4 className={styles.filterLabel}>Order Type</h4>
            <div className={styles.filters}>
              {typeFilters.map(filter => (
                <button
                  key={filter.id}
                  type="button"
                  className={`${styles.filterBtn} ${orderTypeFilter === filter.id ? styles.activeFilter : ''}`}
                  onClick={() => setOrderTypeFilter(filter.id)}
                >
                  {filter.label}
                  <span className={styles.filterCount}>{filter.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className={styles.filterSection}>
            <h4 className={styles.filterLabel}>Status</h4>
            <div className={styles.filters}>
              {statusFilters.map(filter => (
                <button
                  key={filter.id}
                  type="button"
                  className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.activeFilter : ''}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                  <span className={styles.filterCount}>{filter.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Order Policy Link */}
          {orderTypeFilter === 'custom' && (
            <div className={styles.policyNotice}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p>
                Custom orders are subject to our <Link to="/hub/custom-order-policy" className={styles.policyLink}>Custom Order Policy</Link>. 
                Please review cancellation and refund terms.
              </p>
            </div>
          )}
        </>
      )}

      {/* --- RESULTS --- */}
      {filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h2>{trackedOrder ? 'Order Not Found' : 'No Orders Yet'}</h2>
          <p>
            {trackedOrder 
              ? "We couldn't find an order matching your search." 
              : "You haven't placed any orders yet. Start shopping to see your orders here."}
          </p>
          {trackedOrder ? (
            <button 
              type="button" 
              onClick={() => {setSearchQuery(''); setTrackedOrder(null);}} 
              className={styles.resetBtn}
            >
              Clear Search
            </button>
          ) : (
            <button 
              type="button" 
              onClick={() => navigate('/platform/shop')} 
              className={styles.shopBtn}
            >
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div className={styles.ordersList}>
          {filteredOrders.map(order => {
            const statusConfig = getStatusConfig(order.status, order.orderType);
            
            return (
              <div key={order.id} className={`${styles.orderCard} ${trackedOrder ? styles.trackedCard : ''} ${order.orderType === 'custom' ? styles.customOrderCard : ''}`}>
                {/* Order Type Badge */}
                {order.orderType === 'custom' && (
                  <div className={styles.orderTypeBadge}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                    Custom Order
                  </div>
                )}

                {/* Header */}
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <h3>Order {order.id}</h3>
                    <span className={styles.orderDate}>
                      Placed on {order.date} • {order.makerName}
                    </span>
                  </div>
                  <span className={`${styles.statusBadge} ${statusConfig.class}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </div>

                {/* Progress Bar */}
                {order.status !== 'cancelled' && (
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                )}

                {/* Visual Timeline (only for tracked order) */}
                {trackedOrder && (
                  <div className={styles.timelineContainer}>
                    <div className={styles.timeline}>
                      {order.timeline.map((step, idx) => (
                        <div key={idx} className={`${styles.timelineStep} ${step.completed ? styles.completed : ''}`}>
                          <div className={styles.stepMarker}>
                            {step.completed ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            ) : (
                              <span className={styles.dot} />
                            )}
                          </div>
                          <div className={styles.stepInfo}>
                            <span className={styles.stepName}>{step.stage}</span>
                            <span className={styles.stepDate}>{step.date}</span>
                          </div>
                          {idx !== order.timeline.length - 1 && <div className={styles.stepLine} />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Order Quote Display */}
                {order.orderType === 'custom' && order.status === 'quoted' && !trackedOrder && (
                  <div className={styles.quoteBox}>
                    <div className={styles.quoteHeader}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span>Quote Details</span>
                    </div>
                    <div className={styles.quoteInfo}>
                      <div className={styles.quoteRow}>
                        <span>Quoted Amount:</span>
                        <strong>{order.quoteAmount}</strong>
                      </div>
                      <div className={styles.quoteRow}>
                        <span>Deposit ({order.depositPercentage}%):</span>
                        <strong>{order.depositAmount}</strong>
                      </div>
                      {order.quoteExpiry && (
                        <div className={styles.quoteRow}>
                          <span>Expires:</span>
                          <strong className={styles.expiryDate}>{order.quoteExpiry}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Custom Order Specs (for custom orders) */}
                {order.orderType === 'custom' && order.customSpecs && !trackedOrder && (
                  <div className={styles.specsBox}>
                    <h4 className={styles.specsTitle}>Specifications</h4>
                    <div className={styles.specsList}>
                      {order.customSpecs.slice(0, 3).map((spec, idx) => (
                        <div key={idx} className={styles.specItem}>
                          <span className={styles.specLabel}>{spec.label}:</span>
                          <span className={styles.specValue}>{spec.value}</span>
                        </div>
                      ))}
                      {order.customSpecs.length > 3 && (
                        <span className={styles.specsMore}>+{order.customSpecs.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Confirmation Code (for delivered orders) */}
                {order.status === 'delivered' && (
                  <div className={styles.confirmationCodeBox}>
                    <div className={styles.codeHeader}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <span>Delivery Confirmation Code</span>
                    </div>
                    <div className={styles.codeValue}>{order.confirmationCode}</div>
                    <p className={styles.codeHint}>
                      Enter this code when you receive your package to confirm delivery
                    </p>
                  </div>
                )}

                {/* Body Details */}
                <div className={styles.orderBody}>
                  <div className={styles.orderSummary}>
                    <div className={styles.summaryItem}>
                      <span className={styles.label}>Items</span>
                      <span className={styles.value}>{order.items}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.label}>Total</span>
                      <span className={styles.value}>{order.total}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.label}>Est. Delivery</span>
                      <span className={styles.value}>{order.estimatedDelivery}</span>
                    </div>
                    {order.tracking && (
                      <div className={styles.summaryItem}>
                        <span className={styles.label}>Tracking</span>
                        <span className={styles.valueCode}>{order.tracking}</span>
                      </div>
                    )}
                  </div>

                  {/* Shipping Address */}
                  <div className={styles.shippingInfo}>
                    <span className={styles.label}>Shipping To</span>
                    <span className={styles.address}>{order.shippingAddress}</span>
                  </div>

                  {!trackedOrder && (
                    <div className={styles.orderItems}>
                      {order.items_detail.map((item, idx) => (
                        <div key={idx} className={styles.orderItem}>
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.itemDetails}>
                            Size: {item.size} • Qty: {item.quantity} • {item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className={styles.orderActions}>
                  {/* Standard Order Actions */}
                  {order.orderType === 'standard' && (
                    <>
                      {order.status === 'processing' && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleOpenCancelModal(order)}
                            className={styles.btnSecondary}
                          >
                            Cancel Order
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleOpenContact(order)}
                            className={styles.btnSecondary}
                          >
                            Contact Maker
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleViewDetails(order)}
                            className={styles.btnPrimary}
                          >
                            View Details
                          </button>
                        </>
                      )}

                      {order.status === 'shipped' && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleOpenContact(order)}
                            className={styles.btnSecondary}
                          >
                            Contact Maker
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleViewDetails(order)}
                            className={styles.btnPrimary}
                          >
                            Track Shipment
                          </button>
                        </>
                      )}

                      {order.status === 'delivered' && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleOpenReceipt(order)}
                            className={styles.btnSecondary}
                          >
                            View Receipt
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleOpenConfirmModal(order)}
                            className={styles.btnPrimary}
                          >
                            Confirm Receipt
                          </button>
                        </>
                      )}

                      {order.status === 'confirmed' && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleReorder(order)}
                            className={styles.btnSecondary}
                          >
                            Reorder
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleOpenReceipt(order)}
                            className={styles.btnSecondary}
                          >
                            View Receipt
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleViewDetails(order)}
                            className={styles.btnPrimary}
                          >
                            Order Details
                          </button>
                        </>
                      )}

                      {order.status === 'cancelled' && (
                        <button 
                          type="button" 
                          onClick={() => handleViewDetails(order)}
                          className={styles.btnPrimary}
                        >
                          View Details
                        </button>
                      )}
                    </>
                  )}

                  {/* Custom Order Actions */}
                  {order.orderType === 'custom' && (
                    <>
                      {order.status === 'requested' && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleOpenCancelModal(order)}
                            className={styles.btnSecondary}
                          >
                            Cancel Request
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleOpenContact(order)}
                            className={styles.btnSecondary}
                          >
                            Contact Maker
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleViewDetails(order)}
                            className={styles.btnPrimary}
                          >
                            View Details
                          </button>
                        </>
                      )}

                      {order.status === 'quoted' && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleOpenContact(order)}
                            className={styles.btnSecondary}
                          >
                            Contact Maker
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleViewQuote(order)}
                            className={styles.btnPrimary}
                          >
                            Review Quote
                          </button>
                        </>
                      )}

                      {order.status === 'approved' && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleOpenContact(order)}
                            className={styles.btnSecondary}
                          >
                            Contact Maker
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handlePayDeposit(order)}
                            className={styles.btnPrimary}
                          >
                            Pay Deposit
                          </button>
                        </>
                      )}

                      {order.status === 'in_production' && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleOpenContact(order)}
                            className={styles.btnSecondary}
                          >
                            Contact Maker
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleViewDetails(order)}
                            className={styles.btnPrimary}
                          >
                            Track Progress
                          </button>
                        </>
                      )}

                      {order.status === 'delivered' && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleOpenReceipt(order)}
                            className={styles.btnSecondary}
                          >
                            View Receipt
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleOpenConfirmModal(order)}
                            className={styles.btnPrimary}
                          >
                            Confirm Receipt
                          </button>
                        </>
                      )}

                      {order.status === 'confirmed' && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => handleOpenReceipt(order)}
                            className={styles.btnSecondary}
                          >
                            View Receipt
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleViewDetails(order)}
                            className={styles.btnPrimary}
                          >
                            Order Details
                          </button>
                        </>
                      )}

                      {order.status === 'cancelled' && (
                        <button 
                          type="button" 
                          onClick={() => handleViewDetails(order)}
                          className={styles.btnPrimary}
                        >
                          View Details
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- CONFIRM DELIVERY MODAL --- */}
      {showConfirmModal && selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirmModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Confirm Delivery</h3>
              <button 
                type="button" 
                onClick={() => setShowConfirmModal(false)}
                className={styles.modalClose}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.confirmInfo}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <h4>Enter Your Confirmation Code</h4>
                <p>
                  This code was included in your order confirmation email and on the package.
                  Enter it below to confirm you've received your order.
                </p>
              </div>

              <div className={styles.codeDisplay}>
                <span className={styles.codeLabel}>Your Confirmation Code:</span>
                <span className={styles.codeValueLarge}>{selectedOrder.confirmationCode}</span>
              </div>

              <div className={styles.formGroup}>
                <label>Enter Code</label>
                <input 
                  type="text"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value.toUpperCase())}
                  placeholder="BRT-XXXXXX"
                  className={styles.codeInput}
                  maxLength={10}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                onClick={() => setShowConfirmModal(false)}
                className={styles.btnSecondary}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleConfirmDelivery}
                disabled={confirmationInput.length < 10}
                className={styles.btnPrimary}
              >
                Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CANCEL ORDER MODAL --- */}
      {showCancelModal && selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Cancel Order</h3>
              <button 
                type="button" 
                onClick={() => setShowCancelModal(false)}
                className={styles.modalClose}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.cancelWarning}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <h4>Are you sure?</h4>
                {selectedOrder.orderType === 'custom' ? (
                  <p>
                    This will cancel your custom order. Please review our <Link to="/hub/custom-order-policy" className={styles.policyLink}>Custom Order Policy</Link> for cancellation terms and potential deposit forfeiture.
                  </p>
                ) : (
                  <p>
                    This will cancel your order and initiate a refund. 
                    The refund will be processed within 3-5 business days.
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Reason for Cancellation</label>
                <select 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="">Select a reason...</option>
                  <option value="changed_mind">Changed my mind</option>
                  <option value="found_better">Found a better option</option>
                  <option value="wrong_item">Ordered wrong item</option>
                  <option value="delivery_time">Delivery time too long</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                onClick={() => setShowCancelModal(false)}
                className={styles.btnSecondary}
              >
                Keep Order
              </button>
              <button 
                type="button" 
                onClick={handleCancelOrder}
                disabled={!cancelReason}
                className={styles.btnDanger}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- QUOTE REVIEW MODAL --- */}
      {showQuoteModal && selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setShowQuoteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Review Quote</h3>
              <button 
                type="button" 
                onClick={() => setShowQuoteModal(false)}
                className={styles.modalClose}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.quoteDetails}>
                <h4>Quote from {selectedOrder.makerName}</h4>
                
                <div className={styles.quoteAmount}>
                  <span>Total Amount:</span>
                  <strong>{selectedOrder.quoteAmount}</strong>
                </div>

                <div className={styles.depositInfo}>
                  <span>Deposit Required ({selectedOrder.depositPercentage}%):</span>
                  <strong>{selectedOrder.depositAmount}</strong>
                </div>

                {selectedOrder.quoteExpiry && (
                  <div className={styles.quoteExpiry}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Quote expires: {selectedOrder.quoteExpiry}</span>
                  </div>
                )}

                {selectedOrder.customSpecs && (
                  <div className={styles.quoteSpecs}>
                    <h5>Specifications</h5>
                    {selectedOrder.customSpecs.map((spec, idx) => (
                      <div key={idx} className={styles.quoteSpecItem}>
                        <span>{spec.label}:</span>
                        <strong>{spec.value}</strong>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.quotePolicy}>
                  <p>
                    By approving this quote, you agree to the <Link to="/hub/custom-order-policy" className={styles.policyLink}>Custom Order Policy</Link> terms, including deposit forfeiture if cancelled after production begins.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                onClick={handleRejectQuote}
                className={styles.btnDanger}
              >
                Reject Quote
              </button>
              <button 
                type="button" 
                onClick={handleApproveQuote}
                className={styles.btnPrimary}
              >
                Approve Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- RECEIPT MODAL --- */}
      {showReceiptModal && selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setShowReceiptModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Order Receipt</h3>
              <button 
                type="button" 
                onClick={() => setShowReceiptModal(false)}
                className={styles.modalClose}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.receipt}>
                <div className={styles.receiptHeader}>
                  <h4>BRUTIGE STUDIO</h4>
                  <p>Order Receipt</p>
                </div>

                <div className={styles.receiptSection}>
                  <div className={styles.receiptRow}>
                    <span>Order ID:</span>
                    <strong>{selectedOrder.id}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Type:</span>
                    <strong>{selectedOrder.orderType.toUpperCase()}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Date:</span>
                    <strong>{selectedOrder.date}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Status:</span>
                    <strong>{selectedOrder.status.toUpperCase()}</strong>
                  </div>
                </div>

                <div className={styles.receiptSection}>
                  <h5>Items</h5>
                  {selectedOrder.items_detail.map((item, idx) => (
                    <div key={idx} className={styles.receiptItem}>
                      <span>{item.name} ({item.size}) x{item.quantity}</span>
                      <strong>{item.price}</strong>
                    </div>
                  ))}
                </div>

                <div className={styles.receiptSection}>
                  <div className={styles.receiptTotal}>
                    <span>Total:</span>
                    <strong>{selectedOrder.total}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Payment:</span>
                    <strong>{selectedOrder.paymentMethod}</strong>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Status:</span>
                    <strong>{selectedOrder.paymentStatus.toUpperCase()}</strong>
                  </div>
                </div>

                <div className={styles.receiptFooter}>
                  <p>Thank you for your purchase!</p>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                onClick={() => setShowReceiptModal(false)}
                className={styles.btnSecondary}
              >
                Close
              </button>
              <button 
                type="button" 
                onClick={() => {
                  showToast('Download feature coming soon!', 'success');
                }}
                className={styles.btnPrimary}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTACT MAKER MODAL --- */}
      {showContactModal && selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setShowContactModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Contact {selectedOrder.makerName}</h3>
              <button 
                type="button" 
                onClick={() => setShowContactModal(false)}
                className={styles.modalClose}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Your Message</label>
                <textarea 
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={6}
                  className={styles.textareaInput}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                onClick={() => setShowContactModal(false)}
                className={styles.btnSecondary}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSendMessage}
                disabled={!contactMessage.trim()}
                className={styles.btnPrimary}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;