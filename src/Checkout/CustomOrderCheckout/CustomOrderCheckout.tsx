import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import QuoteSummary from './components/QuoteSummary';
import TimelineDisplay from './components/TimelineDisplay';
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
  
  // Items
  items: QuoteItem[];
  
  // Pricing
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  
  // Timeline
  productionDays: number;
  startDate: string;
  estimatedDelivery: string;
  
  // Metadata
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt?: string;
  notes?: string;
  terms?: string;
  
  // Shipping (from quote)
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
  
  // Support both URL param and query string
  const actualQuoteId = quoteId || searchParams.get('quoteId');
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [escrowAccepted, setEscrowAccepted] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load quote from localStorage (later: from API)
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
      
      // Check if quote is expired
      if (parsedQuote.expiresAt && new Date(parsedQuote.expiresAt) < new Date()) {
        setError('This quote has expired. Please request a new one from the maker.');
        setLoading(false);
        return;
      }
      
      // Check if quote is already processed
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
    
    // Create order from quote
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
    
    // Save order to localStorage
    localStorage.setItem(`order_${order.id}`, JSON.stringify(order));
    
    // Mark quote as processed
    const updatedQuote = { ...quote, status: 'accepted' as const };
    localStorage.setItem(`accepted_quote_${quote.id}`, JSON.stringify(updatedQuote));
    
    // Add to orders list
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
    img: '' // Custom orders don't have product images
  }));

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
          {/* Quote Summary */}
          <QuoteSummary quote={quote} />

          {/* Production Timeline */}
          <TimelineDisplay 
            startDate={quote.startDate}
            productionDays={quote.productionDays}
            estimatedDelivery={quote.estimatedDelivery}
          />

          {/* Shipping Address (from quote) */}
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

          {/* Terms & Notes */}
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