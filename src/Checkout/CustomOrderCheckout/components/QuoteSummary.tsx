import React from 'react';
import styles from './QuoteSummary.module.css';

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
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  createdAt: string;
}

interface QuoteSummaryProps {
  quote: Quote;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ quote }) => {
  const formatNaira = (amount: number) => 
    `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <div>
            <h2>Quote Details</h2>
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
      <div className={styles.itemsTable}>
        <div className={styles.tableHeader}>
          <span className={styles.colItem}>Item</span>
          <span className={styles.colQty}>Qty</span>
          <span className={styles.colPrice}>Unit Price</span>
          <span className={styles.colTotal}>Total</span>
        </div>
        
        {quote.items.map((item) => (
          <div key={item.id} className={styles.tableRow}>
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

      {/* Totals */}
      <div className={styles.totals}>
        <div className={styles.totalRow}>
          <span>Subtotal</span>
          <span>{formatNaira(quote.subtotal)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Shipping</span>
          <span>{formatNaira(quote.shipping)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Tax (7.5%)</span>
          <span>{formatNaira(quote.tax)}</span>
        </div>
        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
          <span>Total</span>
          <span>{formatNaira(quote.total)}</span>
        </div>
      </div>

      {/* Notes */}
      {quote.notes && (
        <div className={styles.notes}>
          <h4>Maker's Notes</h4>
          <p>{quote.notes}</p>
        </div>
      )}
    </div>
  );
};

export default QuoteSummary;