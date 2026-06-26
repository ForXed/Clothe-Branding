import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './CheckoutView.module.css';

// --- TypeScript Interfaces ---
interface FormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  days: string;
  price: number;
}

interface CartItemSummary {
  id: number | string;
  title: string;
  quantity: number;
  price: string | number;
  img: string;
}

interface LocationState {
  cartItems?: CartItemSummary[];
  subtotal?: number;
  total?: number;
}

interface CheckoutViewProps {
  cartItems?: CartItemSummary[];
  clearCart?: () => void;
  notify?: (message: string, type: string) => void;
  onComplete?: () => void;
}

// Nigerian States
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const CheckoutView: React.FC<CheckoutViewProps> = ({ cartItems: propCartItems, clearCart, notify, onComplete }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const locationState = (location.state as LocationState) || {};
  
  const safeItems: CartItemSummary[] = propCartItems || locationState.cartItems || [
    { id: 1, title: 'Demo Product', quantity: 1, price: '₦25,000', img: '' }
  ];
  
  const safeSubtotal: number = locationState.subtotal || safeItems.reduce((sum, item) => {
    const price = parseFloat(String(item.price).replace(/[₦,]/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  const [step, setStep] = useState<number>(1); 
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '', company: '', email: '', phone: '',
    address1: '', address2: '', city: '', state: '', zip: '', country: 'NG'
  });

  // Nigeria-first shipping options
  const shippingOptions: ShippingOption[] = [
    { id: 'lagos-same', name: 'Same Day Delivery (Lagos)', carrier: 'GIG Logistics', days: 'Same day', price: 3500 },
    { id: 'lagos-std', name: 'Lagos Standard', carrier: 'GIG Logistics', days: '1-2', price: 2500 },
    { id: 'naija-std', name: 'Nationwide Standard', carrier: 'GIG Logistics', days: '3-5', price: 5000 },
    { id: 'naija-exp', name: 'Nationwide Express', carrier: 'DHL Nigeria', days: '2-3', price: 8500 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if(notify) notify("Processing order & generating waybill...", "success");
    setTimeout(() => {
      if (clearCart) clearCart();
      if (onComplete) {
        onComplete();
      } else {
        navigate('/platform/orders');
      }
    }, 2000);
  };

  const shippingCost = selectedShipping ? (shippingOptions.find(o => o.id === selectedShipping)?.price || 0) : 0;
  const vat = safeSubtotal * 0.075; // 7.5% Nigerian VAT
  const finalTotal = safeSubtotal + shippingCost + vat;

  // Format Naira
  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

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
              <p className={styles.subText}>Where should we deliver your order?</p>
              
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Chinedu Okafor" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Company Name (Optional)</label>
                  <input name="company" value={formData.company} onChange={handleInputChange} placeholder="Your Brand Ltd" />
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@brand.com" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+234 801 234 5678" />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Street Address</label>
                <input name="address1" value={formData.address1} onChange={handleInputChange} placeholder="123 Admiralty Way, Lekki" />
              </div>
              <div className={styles.inputGroup}>
                <label>Apartment, suite, etc. (optional)</label>
                <input name="address2" value={formData.address2} onChange={handleInputChange} />
              </div>

              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>City</label>
                  <input name="city" value={formData.city} onChange={handleInputChange} placeholder="Lagos" />
                </div>
                <div className={styles.inputGroup}>
                  <label>State</label>
                  <select name="state" value={formData.state} onChange={handleInputChange}>
                    <option value="">Select State</option>
                    {NIGERIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Country</label>
                <select name="country" value={formData.country} onChange={handleInputChange}>
                  <option value="NG">Nigeria</option>
                </select>
              </div>

              <button 
                type="button"
                className={styles.continueBtn} 
                onClick={handleAddressComplete}
                disabled={!formData.fullName || !formData.address1 || !formData.city || !formData.state}
              >
                Calculate Shipping Rates
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className={styles.formSection}>
              <h2>Select Shipping Method</h2>
              <p className={styles.subText}>Delivery options for your location</p>

              {isLoadingRates ? (
                <div className={styles.loadingRates}>
                  <div className={styles.spinner}></div>
                  <p>Calculating delivery options...</p>
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
                        <p className={styles.deliveryTime}>Est. Delivery: {option.days} {option.days.includes('-') || option.days === 'Same day' ? '' : 'day'}</p>
                      </div>
                      <div className={styles.shippingPrice}>{formatNaira(option.price)}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.actionRow}>
                <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>Back</button>
                <button type="button" className={styles.continueBtn} onClick={handleConfirmShipping} disabled={!selectedShipping}>
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
                  <p>{formData.city}, {formData.state}</p>
                  <p>Nigeria</p>
                </div>
                <div className={styles.reviewBox}>
                  <h4>Delivery Method</h4>
                  <p>{shippingOptions.find(o => o.id === selectedShipping)?.name}</p>
                  <p className={styles.carrier}>{shippingOptions.find(o => o.id === selectedShipping)?.carrier}</p>
                </div>
              </div>

              <div className={styles.waybillPreview}>
                <div className={styles.waybillHeader}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <h4>Order Waybill</h4>
                </div>
                <div className={styles.hsCodes}>
                  <div className={styles.codeRow}><span className={styles.codeLabel}>Tracking:</span><span className={styles.codeValue}>BRU-{Date.now().toString().slice(-8)}</span></div>
                  <div className={styles.codeRow}><span className={styles.codeLabel}>Origin:</span><span className={styles.codeValue}>Lagos, Nigeria</span></div>
                  <div className={styles.codeRow}><span className={styles.codeLabel}>Status:</span><span className={styles.statusGreen}>Ready to Ship</span></div>
                </div>
              </div>

              <div className={styles.escrowCheck}>
                <label className={styles.checkboxContainer}>
                  <input type="checkbox" defaultChecked />
                  <div className={styles.checkmark}></div>
                  <span>I agree to hold funds in Escrow until delivery is confirmed.</span>
                </label>
              </div>

              <div className={styles.actionRow}>
                <button type="button" className={styles.backBtn} onClick={() => setStep(2)}>Back</button>
                <button type="button" className={styles.payBtn} onClick={handleFinalize}>
                  Pay {formatNaira(finalTotal)}
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
            <div className={styles.row}><span>Subtotal</span><span>{formatNaira(safeSubtotal)}</span></div>
            <div className={styles.row}><span>Shipping</span><span>{formatNaira(shippingCost)}</span></div>
            <div className={styles.row}><span>VAT (7.5%)</span><span>{formatNaira(vat)}</span></div>
            <div className={styles.rowTotal}><span>Total</span><span>{formatNaira(finalTotal)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;