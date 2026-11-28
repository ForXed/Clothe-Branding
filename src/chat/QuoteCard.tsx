import React, { useState } from 'react';
import styles from './QuoteCard.module.css';

// --- TypeScript Interfaces ---
export interface QuoteItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface QuoteData {
  id: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  productionDays: number;
  deliveryDate: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

interface QuoteCardProps {
  quote: QuoteData;
  sent: boolean; // Is this user the sender?
  onAccept?: (quoteId: string) => void;
  onDecline?: (quoteId: string) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, sent, onAccept, onDecline }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = () => {
    switch (quote.status) {
      case 'pending':
        return <span className={`${styles.statusBadge} ${styles.pending}`}>Pending Review</span>;
      case 'accepted':
        return <span className={`${styles.statusBadge} ${styles.accepted}`}>Accepted</span>;
      case 'declined':
        return <span className={`${styles.statusBadge} ${styles.declined}`}>Declined</span>;
    }
  };

  return (
    <div className={`${styles.quoteCard} ${sent ? styles.sent : styles.received}`}>
      {/* Header */}
      <div className={styles.quoteHeader}>
        <div className={styles.quoteIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div className={styles.quoteTitle}>
          <h4>Production Quote</h4>
          <span className={styles.quoteDate}>{formatDate(quote.createdAt)}</span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Summary (always visible) */}
      <div className={styles.quoteSummary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Items</span>
          <span className={styles.summaryValue}>{quote.items.length} product{quote.items.length !== 1 ? 's' : ''}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Production</span>
          <span className={styles.summaryValue}>{quote.productionDays} days</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Delivery</span>
          <span className={styles.summaryValue}>{formatDate(quote.deliveryDate)}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span className={styles.summaryLabel}>Total</span>
          <span className={styles.summaryValue}>{formatCurrency(quote.total)}</span>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className={styles.quoteDetails}>
          <div className={styles.itemsList}>
            {quote.items.map((item, idx) => (
              <div key={idx} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.productName}</span>
                  <span className={styles.itemQty}>Qty: {item.quantity}</span>
                </div>
                <span className={styles.itemPrice}>{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className={styles.breakdown}>
            <div className={styles.breakdownRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(quote.subtotal)}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span>Tax (7.5%)</span>
              <span>{formatCurrency(quote.tax)}</span>
            </div>
            <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
              <span>Total</span>
              <span>{formatCurrency(quote.total)}</span>
            </div>
          </div>

          {quote.notes && (
            <div className={styles.quoteNotes}>
              <strong>Notes:</strong>
              <p>{quote.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Toggle Details Button */}
      <button
        type="button"
        className={styles.toggleDetails}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide' : 'View'} Details
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={showDetails ? styles.rotated : ''}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Action Buttons (only for received quotes that are pending) */}
      {!sent && quote.status === 'pending' && (
        <div className={styles.quoteActions}>
          <button
            type="button"
            className={styles.declineBtn}
            onClick={() => onDecline?.(quote.id)}
          >
            Decline
          </button>
          <button
            type="button"
            className={styles.acceptBtn}
            onClick={() => onAccept?.(quote.id)}
          >
            Accept Quote
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteCard;