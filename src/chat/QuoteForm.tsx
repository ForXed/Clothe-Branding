import React, { useState } from 'react';
import styles from './QuoteForm.module.css';

// Define types directly in this file
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

interface QuoteFormProps {
  onClose: () => void;
  onSubmit: (quote: QuoteData) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onClose, onSubmit }) => {
  const [items, setItems] = useState<QuoteItem[]>([
    { productName: '', quantity: 1, unitPrice: 0, subtotal: 0 }
  ]);
  const [productionDays, setProductionDays] = useState<number>(7);
  const [notes, setNotes] = useState<string>('');

  const handleItemChange = (index: number, field: keyof QuoteItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate subtotal
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = field === 'quantity' ? Number(value) : updated[index].quantity;
      const price = field === 'unitPrice' ? Number(value) : updated[index].unitPrice;
      updated[index].subtotal = qty * price;
    }
    
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { productName: '', quantity: 1, unitPrice: 0, subtotal: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.075; // 7.5% Nigerian VAT
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = () => {
    // Validate
    const validItems = items.filter(item => item.productName.trim() && item.quantity > 0 && item.unitPrice > 0);
    if (validItems.length === 0) {
      alert('Please add at least one valid item');
      return;
    }

    const { subtotal, tax, total } = calculateTotals();
    
    // Calculate delivery date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + productionDays);

    const quote: QuoteData = {
      id: `quote-${Date.now()}`,
      items: validItems,
      subtotal,
      tax,
      total,
      productionDays,
      deliveryDate: deliveryDate.toISOString(),
      notes: notes.trim() || undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onSubmit(quote);
  };

  const { subtotal, tax, total } = calculateTotals();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2>Create Production Quote</h2>
            <p>Send a detailed quote to your customer</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Products & Quantities</h3>
            <button type="button" className={styles.addBtn} onClick={addItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Item
            </button>
          </div>

          <div className={styles.itemsList}>
            {items.map((item, idx) => (
              <div key={idx} className={styles.itemRow}>
                <div className={styles.itemFields}>
                  <input
                    type="text"
                    placeholder="Product name"
                    value={item.productName}
                    onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                    className={styles.productInput}
                  />
                  <div className={styles.numberInputs}>
                    <div className={styles.numberInput}>
                      <label>Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div className={styles.numberInput}>
                      <label>Price (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <span className={styles.itemSubtotal}>{formatCurrency(item.subtotal)}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeItem(idx)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Production Timeline */}
        <div className={styles.section}>
          <h3>Production Timeline</h3>
          <div className={styles.timelineInput}>
            <label>Production Days</label>
            <input
              type="number"
              min="1"
              max="90"
              value={productionDays}
              onChange={(e) => setProductionDays(Number(e.target.value))}
            />
            <span className={styles.timelineHint}>
              Delivery by {new Date(Date.now() + productionDays * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className={styles.section}>
          <h3>Additional Notes (Optional)</h3>
          <textarea
            placeholder="Payment terms, special requirements, etc..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={styles.notesInput}
          />
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax (7.5%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.submitBtn} onClick={handleSubmit}>
            Send Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;