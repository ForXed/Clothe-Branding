import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CartView.module.css';
import { Product, CartItem } from '../BrutigeContext/BrutigeContext'; 

interface ExtendedCartItem extends CartItem {
  isCustom?: boolean;
  makerName?: string;
}

interface CartViewProps {
  cartItems: ExtendedCartItem[];
  updateQuantity: (id: number | string, size: string, newQuantity: number) => void;
  removeItem: (id: number | string, size: string) => void;
  toggleSaved: (product: Product) => void;
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const CartView: React.FC<CartViewProps> = ({ cartItems, updateQuantity, removeItem, toggleSaved, notify }) => {
  const navigate = useNavigate();
  
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; amount: number } | null>(null);
  const [mockupApproved, setMockupApproved] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  // ✅ Helper to format Naira cleanly (no decimals)
  const formatNaira = (amount: number) => {
    return `₦${Math.round(amount).toLocaleString('en-NG')}`;
  };

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce((sum, item) => {
    // ✅ FIX: Strip ₦, $, commas, and spaces so parseFloat works perfectly
    const price = parseFloat(item.price.toString().replace(/[₦,$,\s]/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  // Nigerian shipping & tax
  const shipping = subtotal > 100000 ? 0 : 5000; 
  const tax = subtotal * 0.075; 
  
  // Calculate discount based on applied promo
  const discount = appliedPromo ? appliedPromo.amount : 0;
  const total = subtotal + shipping + tax - discount;

  // ✅ PROMO CODE LOGIC
  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    
    if (code === 'BRUTIGE10') {
      const amount = subtotal * 0.1;
      setAppliedPromo({ code, amount });
      if (notify) notify('Promo applied: 10% off!', 'success');
    } else if (code === 'BRUTIGE20') {
      const amount = subtotal * 0.2;
      setAppliedPromo({ code, amount });
      if (notify) notify('Promo applied: 20% off!', 'success');
    } else if (code === 'WELCOME' && subtotal >= 50000) {
      setAppliedPromo({ code, amount: 5000 });
      if (notify) notify('Welcome promo applied: ₦5,000 off!', 'success');
    } else {
      if (notify) notify('Invalid promo code', 'error');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const hasCustomItems = cartItems.some(item => item.isCustom);
  const canCheckout = !hasCustomItems || mockupApproved;

  // --- HANDLERS ---
  const handleIncrement = (item: ExtendedCartItem) => {
    if (updateQuantity) updateQuantity(item.id, item.size, item.quantity + 1);
  };

  const handleDecrement = (item: ExtendedCartItem) => {
    if (item.quantity <= 1) {
      handleRemove(item);
    } else {
      if (updateQuantity) updateQuantity(item.id, item.size, item.quantity - 1);
    }
  };

  const handleRemove = (item: ExtendedCartItem) => {
    if (removeItem) {
      removeItem(item.id, item.size);
      setDeleteMessage(`${item.title} (${item.size}) removed from cart`);
      setTimeout(() => setDeleteMessage(null), 3000);
    }
  };

  const handleImageClick = (item: ExtendedCartItem) => {
    navigate('/platform/shop', { state: { selectedProduct: item } });
  };

  const handleCheckout = () => {
    if (!canCheckout) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      navigate('/checkout', { 
        state: { cartItems, subtotal, shipping, tax, total, formData: {} } 
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
            <p>Calculating Shipping & Generating Waybills</p>
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

      {/* ✅ REMOVED: The 4-step tracker. It's cleaner without it on the cart page! */}

      <div className={styles.cartLayout}>
        <div className={styles.itemsSection}>
          <h2 className={styles.title}>Production Cart ({cartItems.length})</h2>
          
          <div className={styles.itemsList}>
            {cartItems.map((item, idx) => {
              // ✅ FIX: Same regex fix here for individual item prices
              const price = parseFloat(item.price.toString().replace(/[₦,$,\s]/g, ''));
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
                          <span className={styles.oldPrice}>{formatNaira(price)}</span>
                          <span className={styles.newPrice}>{formatNaira(unitPrice)}</span>
                        </>
                      ) : (
                        <span className={styles.newPrice}>{formatNaira(unitPrice)}</span>
                      )}
                      <span className={styles.lineTotal}>{formatNaira(lineTotal)}</span>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button type="button" onClick={() => handleDecrement(item)} aria-label="Decrease quantity">−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => handleIncrement(item)} aria-label="Increase quantity">+</button>
                    </div>
                    
                    <button 
                      type="button"
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

            {/* ✅ PROMO SECTION: Shows input OR applied badge */}
            <div className={styles.promoSection}>
              {appliedPromo ? (
                <div className={styles.appliedPromo}>
                  <span className={styles.promoBadge}>✓ {appliedPromo.code} Applied</span>
                  <button type="button" className={styles.removePromoBtn} onClick={removePromo}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    value={promoCode} 
                    onChange={(e) => setPromoCode(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                  />
                  <button type="button" onClick={applyPromo}>Apply</button>
                </>
              )}
            </div>

            <div className={styles.summaryLine}><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div>
            <div className={styles.summaryLine}><span>Shipping</span><strong>{shipping === 0 ? 'FREE' : formatNaira(shipping)}</strong></div>
            <div className={styles.summaryLine}><span>VAT (7.5%)</span><strong>{formatNaira(tax)}</strong></div>
            {discount > 0 && <div className={`${styles.summaryLine} ${styles.discount}`}><span>Promo Discount</span><strong>-{formatNaira(discount)}</strong></div>}

            <div className={styles.divider} />
            <div className={`${styles.summaryLine} ${styles.total}`}><span>Total Due</span><strong>{formatNaira(total)}</strong></div>

            <button 
              type="button"
              className={styles.checkoutBtn} 
              disabled={!canCheckout || isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut ? 'Processing...' : (canCheckout ? 'Proceed to Checkout' : 'Approve Mockups to Continue')}
            </button>

            <div className={styles.logisticsNote}>
              <p>Secure payment via Paystack • Escrow protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;