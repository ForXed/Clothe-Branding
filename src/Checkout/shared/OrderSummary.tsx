import React from 'react';
import styles from './OrderSummary.module.css';

interface OrderItem {
  id: string | number;
  title: string;
  quantity: number;
  price: number;
  img?: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shipping?: number;
  vat?: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  items, 
  subtotal, 
  shipping = 0, 
  vat = 0, 
  total 
}) => {
  const formatNaira = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₦0';
    }
    return `₦${Math.round(amount).toLocaleString('en-NG')}`;
  };

  return (
    <div className={styles.sidebar}> {/* ✅ Fixed: was summarySidebar */}
      <h3>Order Summary</h3>
      
      <div className={styles.items}>
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className={styles.item}>
            {item.img && (
              <div 
                className={styles.itemImg} 
                style={{ backgroundImage: `url(${item.img})`, backgroundSize: 'cover' }}
              />
            )}
            <div className={styles.itemInfo}>
              <p className={styles.itemTitle}>{item.title}</p>
              <span className={styles.itemQty}>Qty: {item.quantity}</span>
            </div>
            <span className={styles.itemPrice}>{formatNaira(item.price * item.quantity)}</span>
          </div>
        ))}
        {items.length > 3 && (
          <p className={styles.moreItems}>+{items.length - 3} more items</p>
        )}
      </div>

      <div className={styles.totals}>
        <div className={styles.row}>
          <span>Subtotal</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        {shipping > 0 && (
          <div className={styles.row}>
            <span>Shipping</span>
            <span>{formatNaira(shipping)}</span>
          </div>
        )}
        {vat > 0 && (
          <div className={styles.row}>
            <span>VAT (7.5%)</span>
            <span>{formatNaira(vat)}</span>
          </div>
        )}
        <div className={styles.totalRow}>
          <span>Total</span>
          <span>{formatNaira(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;