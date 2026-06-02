import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './CheckoutView.module.css';

const CheckoutView = ({ notify }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve data passed from CartView
  const { cartItems, subtotal: cartSubtotal, total: cartTotal } = location.state || {};

  // Fallback if accessed directly (for development safety)
  const safeItems = cartItems || [
    { id: 1, title: 'Demo Product', quantity: 1, price: '$50.00', img: '' }
  ];
  const safeSubtotal = cartSubtotal || 50.00;

  const [step, setStep] = useState(1); 
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '', company: '', email: '', phone: '',
    address1: '', address2: '', city: '', state: '', zip: '', country: 'US'
  });

  const shippingOptions = [
    { id: 'std', name: 'Standard International', carrier: 'DHL eCommerce', days: '7-10', price: 45.00 },
    { id: 'exp', name: 'Express Worldwide', carrier: 'FedEx Priority', days: '3-5', price: 89.00 },
    { id: 'ovr', name: 'Overnight Global', carrier: 'DHL Express', days: '1-2', price: 150.00 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressComplete = () => {
    setIsLoadingRates(true);
    setTimeout(() => {
      setIsLoadingRates(false);
      setStep(2);
      if(notify) notify("Shipping rates calculated successfully", "success");
    }, 1500);
  };

  const handleConfirmShipping = () => {
    if (!selectedShipping) return;
    setStep(3);
  };

  const handleFinalize = () => {
    if(notify) notify("Processing Escrow & Generating Waybills...", "success");
    setTimeout(() => {
      navigate('/platform/orders');
    }, 2000);
  };

  // Calculate dynamic total
  const shippingCost = selectedShipping ? shippingOptions.find(o => o.id === selectedShipping).price : 0;
  const tax = safeSubtotal * 0.08;
  const finalTotal = safeSubtotal + shippingCost + tax;

  return (
    <div className={styles.container}>
      <div className={styles.progressTrack}>
        <div className={`${styles.trackStep} ${step >= 1 ? styles.active : ''}`}>Information</div>
        <div className={`${styles.trackStep} ${step >= 2 ? styles.active : ''}`}>Shipping</div>
        <div className={`${styles.trackStep} ${step >= 3 ? styles.active : ''}`}>Review</div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.mainForm}>
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className={styles.formSection}>
              <h2>Shipping Information</h2>
              <p className={styles.subText}>Where should we deliver your production run?</p>
              
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Company Name (Optional)</label>
                  <input name="company" value={formData.company} onChange={handleInputChange} placeholder="Brand LLC" />
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@brand.com" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Street Address</label>
                <input name="address1" value={formData.address1} onChange={handleInputChange} placeholder="123 Production Ave" />
              </div>
              <div className={styles.inputGroup}>
                <label>Apartment, suite, etc. (optional)</label>
                <input name="address2" value={formData.address2} onChange={handleInputChange} />
              </div>

              <div className={styles.grid}>
                <div className={styles.inputGroup}><label>City</label><input name="city" value={formData.city} onChange={handleInputChange} /></div>
                <div className={styles.inputGroup}><label>State / Province</label><input name="state" value={formData.state} onChange={handleInputChange} /></div>
                <div className={styles.inputGroup}><label>ZIP / Postal Code</label><input name="zip" value={formData.zip} onChange={handleInputChange} /></div>
              </div>

              <div className={styles.inputGroup}>
                <label>Country</label>
                <select name="country" value={formData.country} onChange={handleInputChange}>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="EU">European Union</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <button 
                className={styles.continueBtn} 
                onClick={handleAddressComplete}
                disabled={!formData.fullName || !formData.address1 || !formData.city}
              >
                Calculate Shipping Rates
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className={styles.formSection}>
              <h2>Select Shipping Method</h2>
              <p className={styles.subText}>Rates calculated via Global Logistics API</p>

              {isLoadingRates ? (
                <div className={styles.loadingRates}>
                  <div className={styles.spinner}></div>
                  <p>Contacting carriers (DHL, FedEx, UPS)...</p>
                </div>
              ) : (
                <div className={styles.shippingOptions}>
                  {shippingOptions.map(option => (
                    <div 
                      key={option.id}
                      className={`${styles.shippingCard} ${selectedShipping === option.id ? styles.selected : ''}`}
                      onClick={() => setSelectedShipping(option.id)}
                    >
                      <div className={styles.radioCircle}>
                        {selectedShipping === option.id && <div className={styles.radioDot} />}
                      </div>
                      <div className={styles.shippingInfo}>
                        <h4>{option.name}</h4>
                        <p className={styles.carrier}>{option.carrier}</p>
                        <p className={styles.deliveryTime}>Est. Delivery: {option.days} business days</p>
                      </div>
                      <div className={styles.shippingPrice}>${option.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.actionRow}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>Back</button>
                <button className={styles.continueBtn} onClick={handleConfirmShipping} disabled={!selectedShipping}>
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className={styles.formSection}>
              <h2>Review & Confirm</h2>
              
              <div className={styles.reviewGrid}>
                <div className={styles.reviewBox}>
                  <h4>Shipping To</h4>
                  <p>{formData.fullName}</p>
                  <p>{formData.address1}</p>
                  <p>{formData.city}, {formData.state} {formData.zip}</p>
                  <p>{formData.country}</p>
                </div>
                <div className={styles.reviewBox}>
                  <h4>Method</h4>
                  <p>{shippingOptions.find(o => o.id === selectedShipping)?.name}</p>
                  <p className={styles.carrier}>{shippingOptions.find(o => o.id === selectedShipping)?.carrier}</p>
                </div>
              </div>

              <div className={styles.waybillPreview}>
                <div className={styles.waybillHeader}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <h4>Automated Customs Docs</h4>
                </div>
                <div className={styles.hsCodes}>
                  <div className={styles.codeRow}><span className={styles.codeLabel}>HS Code:</span><span className={styles.codeValue}>6109.10 (Cotton T-Shirts)</span></div>
                  <div className={styles.codeRow}><span className={styles.codeLabel}>Origin:</span><span className={styles.codeValue}>Portugal / Milan</span></div>
                  <div className={styles.codeRow}><span className={styles.codeLabel}>Waybill Status:</span><span className={styles.statusGreen}>Ready to Generate</span></div>
                </div>
              </div>

              <div className={styles.escrowCheck}>
                <label className={styles.checkboxContainer}>
                  <input type="checkbox" defaultChecked />
                  <div className={styles.checkmark}></div>
                  <span>I agree to hold funds in Escrow until delivery is confirmed via carrier API.</span>
                </label>
              </div>

              <div className={styles.actionRow}>
                <button className={styles.backBtn} onClick={() => setStep(2)}>Back</button>
                <button className={styles.payBtn} onClick={handleFinalize}>
                  Pay & Generate Waybill
                </button>
              </div>
            </div>
          )}

        </div>

        {/* SIDEBAR */}
        <div className={styles.summarySidebar}>
          <h3>Order Summary</h3>
          <div className={styles.summaryItems}>
            {safeItems.slice(0, 3).map((item, i) => (
              <div key={i} className={styles.miniItem}>
                <div className={styles.miniImg} style={{backgroundImage: `url(${item.img})`, backgroundSize: 'cover'}}></div>
                <div>
                  <p>{item.title}</p>
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>
            ))}
            {safeItems.length > 3 && <p style={{fontSize:'0.8rem', opacity:0.6}}>+{safeItems.length - 3} more items</p>}
          </div>
          <div className={styles.totals}>
            <div className={styles.row}><span>Subtotal</span><span>${safeSubtotal.toFixed(2)}</span></div>
            <div className={styles.row}><span>Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
            <div className={styles.row}><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className={styles.rowTotal}><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;