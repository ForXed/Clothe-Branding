import React, { useState } from 'react';
import styles from './CartView.module.css';

const CartView = ({ cartItems, updateQuantity, removeItem }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'BRUTIGE10') {
      setDiscount(subtotal * 0.1);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <h2>Your Cart is Empty</h2>
        <p>Start adding items to your cart to continue shopping</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cartLayout}>
        {/* Cart Items */}
        <div className={styles.itemsSection}>
          <h2 className={styles.title}>Shopping Cart ({cartItems.length})</h2>
          
          <div className={styles.itemsList}>
            {cartItems.map((item, index) => {
              const itemPrice = parseFloat(item.price.replace('$', ''));
              const itemTotal = itemPrice * item.quantity;

              return (
                <div key={`${item.id}-${item.size}-${index}`} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.img} alt={item.title} />
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h3>{item.title}</h3>
                    <p className={styles.itemSize}>Size: {item.size}</p>
                    <p className={styles.itemPrice}>${itemPrice.toFixed(2)}</p>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                    </div>

                    <p className={styles.itemTotal}>${itemTotal.toFixed(2)}</p>

                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id, item.size)}
                      aria-label="Remove item"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Order Summary</h3>

            <div className={styles.promoSection}>
              <input 
                type="text"
                placeholder="Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={applyPromo}>Apply</button>
            </div>

            {discount > 0 && (
              <div className={styles.discountApplied}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Discount applied!</span>
              </div>
            )}

            <div className={styles.summaryLine}>
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <div className={styles.summaryLine}>
              <span>Shipping</span>
              <strong>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</strong>
            </div>

            <div className={styles.summaryLine}>
              <span>Tax (8%)</span>
              <strong>${tax.toFixed(2)}</strong>
            </div>

            {discount > 0 && (
              <div className={`${styles.summaryLine} ${styles.discount}`}>
                <span>Discount</span>
                <strong>-${discount.toFixed(2)}</strong>
              </div>
            )}

            <div className={styles.divider} />

            <div className={`${styles.summaryLine} ${styles.total}`}>
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <button className={styles.checkoutBtn}>
              Proceed to Checkout
            </button>

            <div className={styles.benefits}>
              <div className={styles.benefit}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className={styles.benefit}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;