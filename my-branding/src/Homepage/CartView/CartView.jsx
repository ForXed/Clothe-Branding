import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CartView.module.css';

const CartView = ({ cartItems, updateQuantity, removeItem, toggleSaved }) => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [mockupApproved, setMockupApproved] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // NEW STATE FOR THE CUSTOM DELETE MESSAGE
  const [deleteMessage, setDeleteMessage] = useState(null);

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 500 ? 0 : 45;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'BRUTIGE10') setDiscount(subtotal * 0.1);
  };

  const hasCustomItems = cartItems.some(item => item.isCustom);
  const canCheckout = !hasCustomItems || mockupApproved;

  // --- HANDLERS ---
  const handleIncrement = (item) => {
    if (updateQuantity) {
      updateQuantity(item.id, item.size, item.quantity + 1);
    }
  };

  const handleDecrement = (item) => {
    if (item.quantity <= 1) {
      handleRemove(item);
    } else {
      if (updateQuantity) {
        updateQuantity(item.id, item.size, item.quantity - 1);
      }
    }
  };

  const handleRemove = (item) => {
    // 1. Call the parent function to actually remove the item
    if (removeItem) {
      removeItem(item.id, item.size);
      
      // 2. Set the custom message to show the toast
      setDeleteMessage(`${item.title} (${item.size}) removed from cart`);

      // 3. Hide the message after 3 seconds
      setTimeout(() => {
        setDeleteMessage(null);
      }, 3000);
    }
  };

  const handleImageClick = (item) => {
    navigate('/platform/shop', { state: { selectedProduct: item } });
  };

  const handleCheckout = () => {
    if (!canCheckout) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      navigate('/platform/checkout', { 
        state: { 
          items: cartItems, 
          subtotal, 
          shipping, 
          tax, 
          total,
          formData: {} // You can pass form data later if needed
        } 
      });
      setIsCheckingOut(false);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.illustrationBox}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>
            </svg>
        </div>
        <h2>Production Cart Empty</h2>
        <p>No active production runs. Connect with a maker to start sourcing.</p>
        <button className={styles.continueBtn} onClick={() => navigate('/platform/shop')}>
            Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* PRELOADER */}
      {isCheckingOut && (
        <div className={styles.preloaderOverlay}>
          <div className={styles.preloaderContent}>
            <div className={styles.spinner}></div>
            <h3>Initializing Logistics...</h3>
            <p>Calculating HS Codes & Generating Waybills</p>
          </div>
        </div>
      )}

      {/* DELETE NOTIFICATION TOAST */}
      {deleteMessage && (
        <div className={styles.deleteNotification}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{deleteMessage}</span>
        </div>
      )}

      <div className={styles.checkoutSteps}>
        {['Cart', 'Details', 'Logistics', 'Payment'].map((label, i) => (
            <div key={label} className={`${styles.step} ${i === 0 ? styles.stepActive : ''}`}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span className={styles.stepLabel}>{label}</span>
                {i < 3 && <div className={styles.stepLine} />}
            </div>
        ))}
      </div>

      <div className={styles.cartLayout}>
        <div className={styles.itemsSection}>
          <h2 className={styles.title}>Production Cart ({cartItems.length})</h2>
          
          <div className={styles.itemsList}>
            {cartItems.map((item, idx) => {
              const price = parseFloat(item.price.replace('$', ''));
              let unitPrice = price;
              let discountPercent = 0;
              if (item.quantity >= 50) { unitPrice = price * 0.85; discountPercent = 15; }
              else if (item.quantity >= 20) { unitPrice = price * 0.90; discountPercent = 10; }
              else if (item.quantity >= 5) { unitPrice = price * 0.95; discountPercent = 5; }
              const lineTotal = unitPrice * item.quantity;

              return (
                <div key={`${item.id}-${item.size}-${idx}`} className={styles.cartItem}>
                  <div className={styles.itemImage} onClick={() => handleImageClick(item)}>
                    <img src={item.img} alt={item.title} />
                    {discountPercent > 0 && (
                      <span className={styles.bulkBadge}>-{discountPercent}% Bulk</span>
                    )}
                    <div className={styles.imageHoverHint}>Click to view</div>
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h3>{item.title}</h3>
                    <p className={styles.itemMeta}>Size: {item.size} • Maker: {item.makerName || 'Brutige'}</p>
                    {item.isCustom && <p className={styles.customTag}>Custom Branding Work</p>}
                    
                    <div className={styles.priceRow}>
                      {discountPercent > 0 ? (
                        <>
                          <span className={styles.oldPrice}>${price.toFixed(2)}</span>
                          <span className={styles.newPrice}>${unitPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className={styles.newPrice}>${unitPrice.toFixed(2)}</span>
                      )}
                      <span className={styles.lineTotal}>${lineTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button onClick={() => handleDecrement(item)} aria-label="Decrease quantity">−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleIncrement(item)} aria-label="Increase quantity">+</button>
                    </div>
                    
                    <button 
                      className={styles.removeBtn} 
                      onClick={() => handleRemove(item)} 
                      title="Remove Item"
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

          {hasCustomItems && (
            <div className={styles.complianceGate}>
              <label className={styles.checkboxContainer}>
                <input type="checkbox" checked={mockupApproved} onChange={(e) => setMockupApproved(e.target.checked)} />
                <div className={styles.checkmark}></div>
                <span>I confirm that all digital mockups and tech packs have been reviewed and approved for production.</span>
              </label>
              {!mockupApproved && (
                <p className={styles.warningText}>⚠️ You must approve mockups before checkout for custom items.</p>
              )}
            </div>
          )}
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Order Summary</h3>
            
            <div className={styles.escrowNotice}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <p>Funds held in Escrow until delivery confirmation.</p>
            </div>

            <div className={styles.promoSection}>
              <input type="text" placeholder="Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <button onClick={applyPromo}>Apply</button>
            </div>

            <div className={styles.summaryLine}><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div className={styles.summaryLine}><span>Global Shipping</span><strong>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</strong></div>
            <div className={styles.summaryLine}><span>Est. Taxes & Duties</span><strong>${tax.toFixed(2)}</strong></div>
            {discount > 0 && <div className={`${styles.summaryLine} ${styles.discount}`}><span>Promo Discount</span><strong>-${discount.toFixed(2)}</strong></div>}

            <div className={styles.divider} />
            <div className={`${styles.summaryLine} ${styles.total}`}><span>Total Due</span><strong>${total.toFixed(2)}</strong></div>

            <button 
              className={styles.checkoutBtn} 
              disabled={!canCheckout || isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut ? 'Processing...' : (canCheckout ? 'Proceed to Logistics' : 'Approve Mockups to Continue')}
            </button>

            <div className={styles.logisticsNote}>
              <p>Automated Waybills & HS Codes generated at next step.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;