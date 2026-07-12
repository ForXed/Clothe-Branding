import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './OrderTracker.module.css';

// --- TypeScript Interfaces ---
interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: string;
  maker?: string;
}

interface TimelineStep {
  stage: string;
  date: string;
  completed: boolean;
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
  items_detail: OrderItem[];
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

interface OrderTrackerProps {
  notify?: (message: string, type?: 'success' | 'error' | 'info' | string) => void;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ notify }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmationInput, setConfirmationInput] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Check if order was passed via state from OrdersView
      const stateOrder = (location.state as { order?: Order })?.order;
      
      if (stateOrder) {
        setOrder(stateOrder);
      } else {
        // Mock data fallback (for direct URL access) - Custom Order Example
        const mockOrder: Order = {
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
            { label: 'Special Request', value: 'Hand-beaded bodice, 3-meter train' },
            { label: 'Embroidery', value: 'Initials "A.O" on inner lining' }
          ],
          referenceImages: [
            'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400',
            'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400'
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
        };
        setOrder(mockOrder);
      }
      
      setIsLoading(false);
    };

    loadOrder();
  }, [orderId, location.state]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (notify) {
      notify(message, type);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/platform/orders');
    }
  };

  const handleOpenConfirmModal = () => {
    setConfirmationInput('');
    setShowConfirmModal(true);
  };

  const handleConfirmDelivery = async () => {
    if (!order) return;
    
    setIsConfirming(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (confirmationInput.toUpperCase() === order.confirmationCode) {
      setOrder(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          status: 'confirmed' as const,
          progress: 100,
          timeline: [
            ...prev.timeline.slice(0, -1),
            { 
              stage: 'Delivered', 
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
              completed: true 
            },
            { 
              stage: 'Confirmed', 
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
              completed: true 
            }
          ]
        };
      });
      
      setShowConfirmModal(false);
      showToast('Delivery confirmed! Thank you for your purchase.', 'success');
      
      setTimeout(() => navigate('/platform/orders'), 1500);
    } else {
      showToast('Invalid confirmation code. Please check your order details.', 'error');
    }
    
    setIsConfirming(false);
  };

  const handleContactMaker = () => {
    if (!order) return;
    navigate('/platform/chat', { 
      state: { 
        makerId: order.makerId,
        makerName: order.makerName,
        orderId: order.id,
        prefillMessage: `Hi ${order.makerName}, I have a question about my order ${order.id}.`
      } 
    });
  };

  const handleViewReceipt = () => {
    showToast('Receipt download coming soon!', 'success');
  };

  const handleViewQuote = () => {
    setShowQuoteModal(true);
  };

  const handleApproveQuote = () => {
    if (!order) return;
    
    setOrder(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'approved' as const,
        progress: 30,
        timeline: prev.timeline.map(step => 
          step.stage === 'Customer Approval' 
            ? { ...step, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), completed: true }
            : step
        )
      };
    });
    
    setShowQuoteModal(false);
    showToast('Quote approved! Please proceed with deposit payment.', 'success');
  };

  const handleRejectQuote = () => {
    if (!order) return;
    
    setOrder(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'cancelled' as const,
        progress: 0
      };
    });
    
    setShowQuoteModal(false);
    showToast('Quote rejected. Order has been cancelled.', 'success');
  };

  const handlePayDeposit = () => {
    if (!order) return;
    navigate(`/checkout/custom/${order.id}`, { state: { order } });
  };

  const handlePayBalance = () => {
    if (!order) return;
    // Navigate to final payment checkout
    navigate(`/checkout/custom/${order.id}/balance`, { state: { order } });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2>Order Not Found</h2>
          <p>We couldn't find the order you're looking for.</p>
          <button 
            type="button" 
            onClick={() => navigate('/platform/orders')}
            className={styles.btnPrimary}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const config: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
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
    return config[status] || config.processing;
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button type="button" onClick={handleBack} className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Orders
      </button>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            {order.orderType === 'custom' && (
              <div className={styles.customOrderBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Custom Order
              </div>
            )}
            <h1 className={styles.title}>Order {order.id}</h1>
            <p className={styles.subtitle}>
              Placed on {order.date} • {order.makerName}
            </p>
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
      </div>

      {/* Custom Order Quote Section (when quoted and awaiting approval) */}
      {order.orderType === 'custom' && order.status === 'quoted' && (
        <div className={styles.section}>
          <div className={styles.quoteAlert}>
            <div className={styles.quoteAlertHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <div>
                <h2>Quote Received</h2>
                <p>Review the quote below and decide whether to proceed</p>
              </div>
            </div>

            <div className={styles.quoteDetails}>
              <div className={styles.quoteAmount}>
                <span>Total Amount</span>
                <strong>{order.quoteAmount}</strong>
              </div>
              <div className={styles.depositInfo}>
                <span>Deposit Required ({order.depositPercentage}%)</span>
                <strong>{order.depositAmount}</strong>
              </div>
              {order.quoteExpiry && (
                <div className={styles.quoteExpiry}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>Quote expires: {order.quoteExpiry}</span>
                </div>
              )}
            </div>

            <div className={styles.quoteActions}>
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

            <p className={styles.policyNotice}>
              By approving, you agree to our{' '}
              <Link to="/hub/custom-order-policy" className={styles.policyLink}>
                Custom Order Policy
              </Link>
              , including deposit forfeiture if cancelled after production begins.
            </p>
          </div>
        </div>
      )}

      {/* Custom Order Approved - Deposit Payment Section */}
      {order.orderType === 'custom' && order.status === 'approved' && (
        <div className={styles.section}>
          <div className={styles.paymentAlert}>
            <div className={styles.paymentAlertHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <div>
                <h2>Payment Required</h2>
                <p>Pay your deposit to begin production</p>
              </div>
            </div>

            <div className={styles.paymentDetails}>
              <div className={styles.paymentRow}>
                <span>Total Amount</span>
                <strong>{order.quoteAmount}</strong>
              </div>
              <div className={styles.paymentRowHighlight}>
                <span>Deposit Due Now ({order.depositPercentage}%)</span>
                <strong>{order.depositAmount}</strong>
              </div>
              <div className={styles.paymentRow}>
                <span>Balance (Due Before Shipping)</span>
                <strong>
                  ₦{(parseInt(order.quoteAmount?.replace(/[₦,]/g, '') || '0') - 
                       parseInt(order.depositAmount?.replace(/[₦,]/g, '') || '0')).toLocaleString()}
                </strong>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handlePayDeposit}
              className={styles.btnPrimary}
            >
              Pay Deposit ({order.depositAmount})
            </button>
          </div>
        </div>
      )}

      {/* Custom Order In Production - Balance Payment Section */}
      {order.orderType === 'custom' && order.status === 'in_production' && order.progress >= 80 && (
        <div className={styles.section}>
          <div className={styles.balanceAlert}>
            <div className={styles.balanceAlertHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <h2>Production Almost Complete</h2>
                <p>Pay the remaining balance to proceed with shipping</p>
              </div>
            </div>

            <div className={styles.balanceDetails}>
              <div className={styles.balanceRow}>
                <span>Total Amount</span>
                <strong>{order.quoteAmount}</strong>
              </div>
              <div className={styles.balanceRow}>
                <span>Deposit Paid</span>
                <strong>{order.depositAmount}</strong>
              </div>
              <div className={styles.balanceRowHighlight}>
                <span>Balance Due</span>
                <strong>
                  ₦{(parseInt(order.quoteAmount?.replace(/[₦,]/g, '') || '0') - 
                       parseInt(order.depositAmount?.replace(/[₦,]/g, '') || '0')).toLocaleString()}
                </strong>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handlePayBalance}
              className={styles.btnPrimary}
            >
              Pay Balance
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Order Timeline</h2>
        <div className={styles.timelineContainer}>
          <div className={styles.timeline}>
            {order.timeline.map((step, idx) => (
              <div 
                key={idx} 
                className={`${styles.timelineStep} ${step.completed ? styles.completed : ''}`}
              >
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
      </div>

      {/* Custom Specifications (for custom orders) */}
      {order.orderType === 'custom' && order.customSpecs && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Custom Specifications</h2>
          <div className={styles.specsGrid}>
            {order.customSpecs.map((spec, idx) => (
              <div key={idx} className={styles.specItem}>
                <span className={styles.specLabel}>{spec.label}</span>
                <span className={styles.specValue}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reference Images (for custom orders) */}
      {order.orderType === 'custom' && order.referenceImages && order.referenceImages.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Reference Images</h2>
          <div className={styles.referenceImages}>
            {order.referenceImages.map((img, idx) => (
              <div key={idx} className={styles.referenceImage}>
                <img src={img} alt={`Reference ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Order Details</h2>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Total</span>
            <span className={styles.value}>{order.total}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Items</span>
            <span className={styles.value}>{order.items}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Est. Delivery</span>
            <span className={styles.value}>{order.estimatedDelivery}</span>
          </div>
          {order.tracking && (
            <div className={styles.detailItem}>
              <span className={styles.label}>Tracking</span>
              <span className={styles.valueCode}>{order.tracking}</span>
            </div>
          )}
          <div className={styles.detailItem}>
            <span className={styles.label}>Payment</span>
            <span className={styles.value}>{order.paymentMethod}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Payment Status</span>
            <span className={styles.value}>{order.paymentStatus.toUpperCase().replace('_', ' ')}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className={styles.shippingInfo}>
          <div className={styles.shippingHeader}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Shipping Address</span>
          </div>
          <p className={styles.address}>{order.shippingAddress}</p>
        </div>

        {/* Items */}
        <div className={styles.itemsSection}>
          <h3 className={styles.itemsTitle}>Items</h3>
          <div className={styles.itemsList}>
            {order.items_detail.map((item, idx) => (
              <div key={idx} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemDetails}>
                    Size: {item.size} • Qty: {item.quantity}
                  </span>
                </div>
                <span className={styles.itemPrice}>{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className={styles.notesSection}>
            <h3 className={styles.notesTitle}>Order Notes</h3>
            <p className={styles.notesText}>{order.notes}</p>
          </div>
        )}
      </div>

      {/* Confirmation Code Box (for delivered orders) */}
      {order.status === 'delivered' && (
        <div className={styles.section}>
          <div className={styles.confirmationBox}>
            <div className={styles.confirmationHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <h3>Delivery Confirmation</h3>
            </div>
            <p className={styles.confirmationText}>
              Your unique confirmation code is shown below. Enter it to confirm you've received your order.
            </p>
            <div className={styles.codeDisplay}>
              <span className={styles.codeLabel}>Confirmation Code</span>
              <span className={styles.codeValue}>{order.confirmationCode}</span>
            </div>
            <button 
              type="button" 
              onClick={handleOpenConfirmModal}
              className={styles.btnPrimary}
            >
              Confirm Receipt
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button 
          type="button" 
          onClick={handleContactMaker}
          className={styles.btnSecondary}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
          </svg>
          Contact Maker
        </button>
        <button 
          type="button" 
          onClick={handleViewReceipt}
          className={styles.btnSecondary}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          View Receipt
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
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
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
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

              <div className={styles.codeDisplayLarge}>
                <span className={styles.codeLabel}>Your Confirmation Code</span>
                <span className={styles.codeValueLarge}>{order.confirmationCode}</span>
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
                  disabled={isConfirming}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                onClick={() => setShowConfirmModal(false)}
                className={styles.btnSecondary}
                disabled={isConfirming}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleConfirmDelivery}
                disabled={confirmationInput.length < 10 || isConfirming}
                className={styles.btnPrimary}
              >
                {isConfirming ? 'Confirming...' : 'Confirm Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;