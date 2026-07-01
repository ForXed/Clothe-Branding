import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OrderSummary from './shared/OrderSummary';
import { getOrder, Order } from './utils/order';
import { downloadInvoice, createInvoiceFromOrder } from './utils/invoice';
import { downloadReceipt, createReceiptFromOrder } from './utils/receipt';
import { formatNaira, formatDate, formatDateTime } from './utils/formatting';
import styles from './CheckoutSuccess.module.css';

interface CheckoutSuccessProps {
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({ notify }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('orderId');
  const orderType = searchParams.get('type') || 'regular';
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Load order data
  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing');
      setLoading(false);
      return;
    }

    const savedOrder = getOrder(orderId);
    
    if (!savedOrder) {
      setError('Order not found. It may have been deleted or the ID is invalid.');
      setLoading(false);
      return;
    }

    setOrder(savedOrder);
    setLoading(false);
  }, [orderId]);

  const handleDownloadInvoice = () => {
    if (!order) return;
    
    try {
      const invoiceData = createInvoiceFromOrder(order);
      downloadInvoice(invoiceData);
      if (notify) notify('Invoice downloaded successfully', 'success');
    } catch (err) {
      console.error('Invoice download error:', err);
      if (notify) notify('Failed to download invoice', 'error');
    }
  };

  const handleDownloadReceipt = () => {
    if (!order) return;
    
    try {
      const receiptData = createReceiptFromOrder(order);
      downloadReceipt(receiptData);
      if (notify) notify('Receipt downloaded successfully', 'success');
    } catch (err) {
      console.error('Receipt download error:', err);
      if (notify) notify('Failed to download receipt', 'error');
    }
  };

  const handleViewOrder = () => {
    if (orderType === 'custom') {
      navigate('/platform/orders');
    } else {
      navigate('/platform/orders');
    }
  };

  const handleContinueShopping = () => {
    navigate('/platform/shop');
  };

  const handleMessageMaker = () => {
    navigate('/platform/messages');
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <h3>Loading Order Details...</h3>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2>Something Went Wrong</h2>
          <p>{error || 'Order not found'}</p>
          <button 
            type="button"
            className={styles.primaryBtn}
            onClick={() => navigate('/platform/shop')}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Convert order items to summary format
  const summaryItems = order.items.map(item => ({
    id: item.id,
    title: item.title,
    quantity: item.quantity,
    price: item.price,
    img: item.img
  }));

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        
        {/* Success Header */}
        <div className={styles.successHeader}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          
          <h1>Order Confirmed! 🎉</h1>
          <p className={styles.subText}>
            {order.type === 'custom' 
              ? `Your custom order from ${order.maker?.name || 'the maker'} has been placed successfully.`
              : 'Thank you for your order! We\'ve received your payment and will start processing immediately.'
            }
          </p>
          
          <div className={styles.orderIdBox}>
            <span>Order ID:</span>
            <strong>#{order.id}</strong>
          </div>
        </div>

        {/* What's Next Section */}
        <div className={styles.whatsNext}>
          <h3>What happens next?</h3>
          <div className={styles.nextSteps}>
            {order.type === 'custom' ? (
              <>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h4>Production Starts</h4>
                    <p>The maker will begin crafting your order within 24 hours.</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h4>Track Progress</h4>
                    <p>You'll receive updates as your order moves through production.</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h4>Delivery</h4>
                    <p>
                      Estimated delivery:{' '}
                      <strong>
                        {order.deliveryDate 
                          ? formatDate(order.deliveryDate, 'long')
                          : 'TBD'
                        }
                      </strong>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h4>Order Processing</h4>
                    <p>Your order is being prepared for shipment.</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h4>Shipping</h4>
                    <p>You'll receive a tracking number once shipped.</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h4>Delivery</h4>
                    <p>Confirm receipt to release funds to the maker.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className={styles.detailsGrid}>
          
          {/* Order Summary */}
          <div className={styles.detailsSection}>
            <OrderSummary
              items={summaryItems}
              subtotal={order.subtotal}
              shipping={order.shippingCost}
              vat={order.vat}
              total={order.total}
            />
          </div>

          {/* Order Info */}
          <div className={styles.detailsSection}>
            <div className={styles.infoCard}>
              <h3>Order Information</h3>
              
              <div className={styles.infoRow}>
                <span>Order ID</span>
                <strong>#{order.id}</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Order Type</span>
                <strong className={styles.typeBadge}>
                  {order.type === 'custom' ? '🎨 Custom Order' : '📦 Regular Order'}
                </strong>
              </div>
              <div className={styles.infoRow}>
                <span>Payment Method</span>
                <strong>Escrow (Paystack)</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Payment Ref</span>
                <strong className={styles.mono}>{order.paymentRef}</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Order Date</span>
                <strong>{formatDateTime(order.paidAt)}</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Tracking Number</span>
                <strong className={styles.mono}>{order.trackingNumber}</strong>
              </div>
              
              {order.type === 'custom' && order.maker && (
                <div className={styles.infoRow}>
                  <span>Maker</span>
                  <strong>{order.maker.name}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className={styles.detailsSection}>
              <div className={styles.infoCard}>
                <h3>Shipping Address</h3>
                <div className={styles.addressBox}>
                  <p><strong>{order.shippingAddress.fullName}</strong></p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && (
                    <p>{order.shippingAddress.address2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className={styles.phone}>
                    📞 {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Escrow Notice */}
          <div className={styles.detailsSection}>
            <div className={styles.escrowCard}>
              <div className={styles.escrowIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className={styles.escrowContent}>
                <h4>Payment Secured in Escrow</h4>
                <p>
                  Your payment of <strong>{formatNaira(order.total)}</strong> is safely held in escrow. 
                  Funds will be released to the maker only after you confirm delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <div className={styles.downloadButtons}>
            <button 
              type="button"
              className={styles.downloadBtn}
              onClick={handleDownloadInvoice}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Download Invoice
            </button>
            
            <button 
              type="button"
              className={styles.downloadBtn}
              onClick={handleDownloadReceipt}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02"/>
              </svg>
              Download Receipt
            </button>
          </div>

          <div className={styles.mainActions}>
            {order.type === 'custom' && (
              <button 
                type="button"
                className={styles.secondaryBtn}
                onClick={handleMessageMaker}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
                </svg>
                Message Maker
              </button>
            )}
            
            <button 
              type="button"
              className={styles.primaryBtn}
              onClick={handleViewOrder}
            >
              View Order Details
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            
            <button 
              type="button"
              className={styles.tertiaryBtn}
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Support Info */}
        <div className={styles.supportInfo}>
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:support@brutige.com">support@brutige.com</a>
            {' '}or call <strong>+234 800 BRUTIGE</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;