import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import OrderSummary from '../shared/OrderSummary';
import EscrowNotice from '../shared/EscrowNotice';
import PaymentButton from '../shared/PaymentButton';
import { generatePaymentReference } from '../utils/payment';
import { generateOrderId, generateTrackingNumber } from '../utils/order';
import { formatNaira } from '../utils/formatting';
import styles from './CustomOrderCheckout.module.css';

// --- TypeScript Interfaces ---
interface QuoteItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

interface Quote {
  id: string;
  makerId: string;
  makerName: string;
  makerEmail: string;
  makerAvatar?: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  productionDays: number;
  startDate: string;
  estimatedDelivery: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt?: string;
  notes?: string;
  terms?: string;
  shippingMethod?: string;
  shippingAddress?: {
    fullName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    country: string;
    phone: string;
  };
}

interface CustomOrderCheckoutProps {
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const CustomOrderCheckout: React.FC<CustomOrderCheckoutProps> = ({ notify }) => {
  const navigate = useNavigate();
  const { quoteId } = useParams<{ quoteId: string }>();
  const [searchParams] = useSearchParams();
  
  const actualQuoteId = quoteId || searchParams.get('quoteId');
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [escrowAccepted, setEscrowAccepted] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!actualQuoteId) {
      setError('Quote ID is missing');
      setLoading(false);
      return;
    }

    const savedQuote = localStorage.getItem(`accepted_quote_${actualQuoteId}`);
    
    if (!savedQuote) {
      setError('Quote not found. It may have expired or been cancelled.');
      setLoading(false);
      return;
    }

    try {
      const parsedQuote: Quote = JSON.parse(savedQuote);
      
      if (parsedQuote.expiresAt && new Date(parsedQuote.expiresAt) < new Date()) {
        setError('This quote has expired. Please request a new one from the maker.');
        setLoading(false);
        return;
      }
      
      if (parsedQuote.status === 'declined') {
        setError('This quote was declined.');
        setLoading(false);
        return;
      }
      
      setQuote(parsedQuote);
    } catch (err) {
      setError('Failed to load quote details.');
      console.error(err);
    }
    
    setLoading(false);
  }, [actualQuoteId]);

  const handlePaymentSuccess = (response: any) => {
    if (!quote) return;
    
    setProcessing(true);
    
    if (notify) notify('Processing your custom order...', 'success');
    
    const order = {
      id: generateOrderId('CUST'),
      type: 'custom' as const,
      quoteId: quote.id,
      items: quote.items,
      subtotal: quote.subtotal,
      shippingCost: quote.shipping,
      vat: quote.tax,
      total: quote.total,
      shippingMethod: quote.shippingMethod || 'Standard',
      shippingAddress: quote.shippingAddress,
      paymentRef: response.reference,
      paidAt: new Date().toISOString(),
      status: 'confirmed' as const,
      trackingNumber: generateTrackingNumber(),
      productionDays: quote.productionDays,
      startDate: quote.startDate,
      deliveryDate: quote.estimatedDelivery,
      maker: {
        id: quote.makerId,
        name: quote.makerName,
        email: quote.makerEmail
      },
      customer: {
        name: quote.customerName,
        email: quote.customerEmail
      },
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`order_${order.id}`, JSON.stringify(order));
    
    const updatedQuote = { ...quote, status: 'accepted' as const };
    localStorage.setItem(`accepted_quote_${quote.id}`, JSON.stringify(updatedQuote));
    
    const ordersList = JSON.parse(localStorage.getItem('brutige_orders_list') || '[]');
    ordersList.push(order.id);
    localStorage.setItem('brutige_orders_list', JSON.stringify(ordersList));
    
    setTimeout(() => {
      if (notify) notify('Order placed successfully! 🎉', 'success');
      navigate(`/checkout/success?orderId=${order.id}&type=custom`);
    }, 2000);
  };

  const handlePaymentClose = () => {
    if (notify) notify('Payment cancelled', 'info');
  };

  const handleBackToChat = () => {
    navigate('/platform/messages');
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <h3>Loading Quote Details...</h3>
          <p>Please wait while we fetch your quote information</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !quote) {
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
          <h2>Unable to Process Quote</h2>
          <p>{error || 'Quote not found'}</p>
          <div className={styles.errorActions}>
            <button 
              type="button"
              className={styles.secondaryBtn}
              onClick={handleBackToChat}
            >
              ← Back to Messages
            </button>
            <button 
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/platform/shop')}
            >
              Browse Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Convert quote items to summary format
  const summaryItems = quote.items.map(item => ({
    id: item.id,
    title: item.productName,
    quantity: item.quantity,
    price: item.unitPrice,
    img: ''
  }));

  // Timeline steps
  const timelineSteps = [
    {
      icon: '💰',
      title: 'Payment Confirmed',
      description: 'Funds secured in escrow',
      date: formatDate(quote.startDate),
      status: 'current'
    },
    {
      icon: '🏭',
      title: 'Production',
      description: `${quote.productionDays} days manufacturing`,
      date: `Starts ${formatDate(quote.startDate)}`,
      status: 'upcoming'
    },
    {
      icon: '✅',
      title: 'Quality Check',
      description: 'Final inspection & packaging',
      date: 'Before shipping',
      status: 'upcoming'
    },
    {
      icon: '📦',
      title: 'Delivery',
      description: 'Shipped to your address',
      date: formatDate(quote.estimatedDelivery),
      status: 'upcoming'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          type="button"
          className={styles.backLink}
          onClick={handleBackToChat}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Conversation
        </button>
        
        <div className={styles.headerContent}>
          <h1>Complete Your Custom Order</h1>
          <p>Review the quote from <strong>{quote.makerName}</strong> and proceed to secure payment</p>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.mainForm}>
          
          {/* ✅ INLINED: Quote Summary */}
          <div className={styles.section}>
            <div className={styles.quoteSummaryHeader}>
              <div className={styles.quoteSummaryTitle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <div>
                  <h3>Quote Details</h3>
                  <p>Created on {formatDate(quote.createdAt)}</p>
                </div>
              </div>
              <div className={styles.quoteBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Accepted</span>
              </div>
            </div>

            {/* Items Table */}
            <div className={styles.quoteItemsTable}>
              <div className={styles.quoteTableHeader}>
                <span className={styles.colItem}>Item</span>
                <span className={styles.colQty}>Qty</span>
                <span className={styles.colPrice}>Unit Price</span>
                <span className={styles.colTotal}>Total</span>
              </div>
              
              {quote.items.map((item) => (
                <div key={item.id} className={styles.quoteTableRow}>
                  <div className={styles.colItem}>
                    <strong>{item.productName}</strong>
                    {item.notes && <p className={styles.itemNotes}>{item.notes}</p>}
                  </div>
                  <span className={styles.colQty}>{item.quantity}</span>
                  <span className={styles.colPrice}>{formatNaira(item.unitPrice)}</span>
                  <span className={styles.colTotal}>{formatNaira(item.subtotal)}</span>
                </div>
              ))}
            </div>

            {/* Quote Notes */}
            {quote.notes && (
              <div className={styles.quoteNotes}>
                <h4>Maker's Notes</h4>
                <p>{quote.notes}</p>
              </div>
            )}
          </div>

          {/* ✅ INLINED: Production Timeline */}
          <div className={styles.section}>
            <div className={styles.timelineHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <h3>Production Timeline</h3>
                <p>Estimated completion: <strong>{formatDate(quote.estimatedDelivery)}</strong></p>
              </div>
            </div>

            <div className={styles.timeline}>
              {timelineSteps.map((step, index) => (
                <div 
                  key={index} 
                  className={`${styles.timelineItem} ${step.status === 'current' ? styles.current : ''}`}
                >
                  <div className={styles.timelineIcon}>
                    <span>{step.icon}</span>
                  </div>
                  
                  {index < timelineSteps.length - 1 && (
                    <div className={styles.timelineLine}></div>
                  )}
                  
                  <div className={styles.timelineContent}>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                    <span className={styles.timelineDate}>{step.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.timelineNotice}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p>
                Production times are estimates. The maker will notify you of any delays 
                or changes to the timeline.
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          {quote.shippingAddress && (
            <div className={styles.section}>
              <h3>Shipping Address</h3>
              <div className={styles.addressBox}>
                <p><strong>{quote.shippingAddress.fullName}</strong></p>
                <p>{quote.shippingAddress.address1}</p>
                {quote.shippingAddress.address2 && (
                  <p>{quote.shippingAddress.address2}</p>
                )}
                <p>
                  {quote.shippingAddress.city}, {quote.shippingAddress.state}
                </p>
                <p>{quote.shippingAddress.country}</p>
                <p className={styles.phone}>{quote.shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Terms */}
          {quote.terms && (
            <div className={styles.section}>
              <h3>Terms & Conditions</h3>
              <div className={styles.termsBox}>
                <p>{quote.terms}</p>
              </div>
            </div>
          )}

          {/* Escrow Notice */}
          <EscrowNotice 
            checked={escrowAccepted}
            onChange={setEscrowAccepted}
          />

          {/* Payment Button */}
          <PaymentButton
            amount={quote.total}
            email={quote.customerEmail}
            reference={generatePaymentReference('CUSTOM')}
            onSuccess={handlePaymentSuccess}
            onClose={handlePaymentClose}
            disabled={!escrowAccepted}
            loading={processing}
          />

          {processing && (
            <div className={styles.processing}>
              <div className={styles.spinner}></div>
              <p>Processing your custom order...</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Maker Info */}
          <div className={styles.makerCard}>
            <div className={styles.makerAvatar}>
              {quote.makerAvatar ? (
                <img src={quote.makerAvatar} alt={quote.makerName} />
              ) : (
                <div className={styles.makerInitials}>
                  {quote.makerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
              )}
            </div>
            <div className={styles.makerInfo}>
              <h4>Made by</h4>
              <p className={styles.makerName}>{quote.makerName}</p>
              <span className={styles.makerEmail}>{quote.makerEmail}</span>
            </div>
          </div>

          {/* Order Summary */}
          <OrderSummary
            items={summaryItems}
            subtotal={quote.subtotal}
            shipping={quote.shipping}
            vat={quote.tax}
            total={quote.total}
          />

          {/* Quote ID */}
          <div className={styles.quoteId}>
            <span>Quote ID:</span>
            <strong>#{quote.id}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderCheckout;