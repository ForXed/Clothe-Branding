import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OrderSummary from '../../shared/OrderSummary';
import EscrowNotice from '../../shared/EscrowNotice';
import PaymentButton from '../../shared/PaymentButton';
import ShippingSelector from './components/ShippingSelector';
import CustomSelect from '../../shared/CustomSelect';
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
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
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

// Shipping options
const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'lagos-same', name: 'Same Day Delivery (Lagos)', carrier: 'GIG Logistics', days: 'Same day', price: 3500 },
  { id: 'lagos-std', name: 'Lagos Standard', carrier: 'GIG Logistics', days: '1-2', price: 2500 },
  { id: 'naija-std', name: 'Nationwide Standard', carrier: 'GIG Logistics', days: '3-5', price: 5000 },
  { id: 'naija-exp', name: 'Nationwide Express', carrier: 'DHL Nigeria', days: '2-3', price: 8500 },
];

const CheckoutView: React.FC<CheckoutViewProps> = ({ 
  cartItems: propCartItems, 
  clearCart, 
  notify, 
  onComplete 
}) => {
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
  const [escrowAccepted, setEscrowAccepted] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '', company: '', email: '', phone: '',
    address1: '', address2: '', city: '', state: '', zip: '', country: 'Nigeria'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressComplete = () => {
    if (!formData.fullName || !formData.address1 || !formData.city || !formData.state) {
      if (notify) notify('Please fill in all required fields', 'error');
      return;
    }
    
    setIsLoadingRates(true);
    setTimeout(() => {
      setIsLoadingRates(false);
      setStep(2);
      if (notify) notify('Shipping rates calculated successfully', 'success');
    }, 1500);
  };

  const handleConfirmShipping = () => {
    if (!selectedShipping) {
      if (notify) notify('Please select a shipping method', 'error');
      return;
    }
    setStep(3);
  };

  const handlePaymentSuccess = (response: any) => {
    setProcessing(true);
    
    if (notify) notify('Processing order & generating waybill...', 'success');
    
    // Create order object
    const order = {
      id: `ORD-${Date.now()}`,
      type: 'regular',
      items: safeItems,
      shipping: selectedShipping,
      address: formData,
      subtotal: safeSubtotal,
      shippingCost: shippingCost,
      vat: vat,
      total: finalTotal,
      paymentRef: response.reference,
      paidAt: new Date().toISOString(),
      status: 'confirmed',
      trackingNumber: `BRU-${Date.now().toString().slice(-8)}`
    };
    
    // Save order to localStorage (later: API)
    localStorage.setItem(`order_${order.id}`, JSON.stringify(order));
    
    setTimeout(() => {
      if (clearCart) clearCart();
      if (onComplete) {
        onComplete();
      } else {
        navigate(`/checkout/success?orderId=${order.id}`);
      }
    }, 2000);
  };

  const handlePaymentClose = () => {
    if (notify) notify('Payment cancelled', 'info');
  };

  const shippingCost = selectedShipping 
    ? (SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.price || 0) 
    : 0;
  const vat = safeSubtotal * 0.075; // 7.5% Nigerian VAT
  const finalTotal = safeSubtotal + shippingCost + vat;

  // Get selected shipping option
  const selectedShippingOption = SHIPPING_OPTIONS.find(o => o.id === selectedShipping);

  // Convert cart items to summary format
  const summaryItems = safeItems.map(item => ({
    id: item.id,
    title: item.title,
    quantity: item.quantity,
    price: parseFloat(String(item.price).replace(/[₦,]/g, '')),
    img: item.img
  }));

  // Convert states to options format
  const stateOptions = NIGERIAN_STATES.map(state => ({
    value: state,
    label: state
  }));

  return (
    <div className={styles.container}>
      <div className={styles.progressTrack}>
        <div className={`${styles.trackStep} ${step >= 1 ? styles.active : ''}`}>Information</div>
        <div className={`${styles.trackStep} ${step >= 2 ? styles.active : ''}`}>Shipping</div>
        <div className={`${styles.trackStep} ${step >= 3 ? styles.active : ''}`}>Review</div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.mainForm}>
          
          {/* STEP 1: Shipping Information */}
          {step === 1 && (
            <div className={styles.formSection}>
              <h2>Shipping Information</h2>
              <p className={styles.subText}>Where should we deliver your order?</p>
              
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Full Name *</label>
                  <input 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    placeholder="Chinedu Okafor"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Company Name (Optional)</label>
                  <input 
                    name="company" 
                    value={formData.company} 
                    onChange={handleInputChange} 
                    placeholder="Your Brand Ltd" 
                  />
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Email Address *</label>
                  <input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="you@brand.com"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number *</label>
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+234 801 234 5678"
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Street Address *</label>
                <input 
                  name="address1" 
                  value={formData.address1} 
                  onChange={handleInputChange} 
                  placeholder="123 Admiralty Way, Lekki"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Apartment, suite, etc. (optional)</label>
                <input 
                  name="address2" 
                  value={formData.address2} 
                  onChange={handleInputChange} 
                  placeholder="Floor 3, Suite 5"
                />
              </div>

              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>City *</label>
                  <input 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    placeholder="Lagos"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>State *</label>
                  {/* ✅ Custom Dropdown with Search */}
                  <CustomSelect
                    options={stateOptions}
                    value={formData.state}
                    onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                    placeholder="Select State"
                    searchable={true}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Country</label>
                {/* ✅ Custom Dropdown (Disabled) */}
                <CustomSelect
                  options={[{ value: 'Nigeria', label: 'Nigeria', flag: '🇳🇬' }]}
                  value={formData.country}
                  onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                  disabled={true}
                />
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

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <ShippingSelector
              isLoading={isLoadingRates}
              selectedShipping={selectedShipping}
              onSelectShipping={setSelectedShipping}
              onBack={() => setStep(1)}
              onContinue={handleConfirmShipping}
            />
          )}

          {/* STEP 3: Review & Pay */}
          {step === 3 && (
            <div className={styles.formSection}>
              <h2>Review & Confirm</h2>
              
              <div className={styles.reviewGrid}>
                <div className={styles.reviewBox}>
                  <h4>Shipping To</h4>
                  <p><strong>{formData.fullName}</strong></p>
                  <p>{formData.address1}</p>
                  {formData.address2 && <p>{formData.address2}</p>}
                  <p>{formData.city}, {formData.state}</p>
                  <p>{formData.country}</p>
                  <p className={styles.contactInfo}>{formData.phone}</p>
                  <p className={styles.contactInfo}>{formData.email}</p>
                </div>
                <div className={styles.reviewBox}>
                  <h4>Delivery Method</h4>
                  <p><strong>{selectedShippingOption?.name || 'Not selected'}</strong></p>
                  <p className={styles.carrier}>{selectedShippingOption?.carrier}</p>
                  <p className={styles.deliveryInfo}>
                    {selectedShippingOption?.days} days
                  </p>
                </div>
              </div>

              <div className={styles.waybillPreview}>
                <div className={styles.waybillHeader}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  <h4>Order Waybill</h4>
                </div>
                <div className={styles.hsCodes}>
                  <div className={styles.codeRow}>
                    <span className={styles.codeLabel}>Tracking:</span>
                    <span className={styles.codeValue}>BRU-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className={styles.codeRow}>
                    <span className={styles.codeLabel}>Origin:</span>
                    <span className={styles.codeValue}>Lagos, Nigeria</span>
                  </div>
                  <div className={styles.codeRow}>
                    <span className={styles.codeLabel}>Status:</span>
                    <span className={styles.statusGreen}>Ready to Ship</span>
                  </div>
                </div>
              </div>

              {/* Escrow Notice Component */}
              <EscrowNotice 
                checked={escrowAccepted}
                onChange={setEscrowAccepted}
              />

              {/* Payment Button Component */}
              <PaymentButton
                amount={finalTotal}
                email={formData.email}
                reference={`BRUTIGE_${Date.now()}`}
                onSuccess={handlePaymentSuccess}
                onClose={handlePaymentClose}
                disabled={!escrowAccepted}
                loading={processing}
              />

              <div className={styles.actionRow}>
                <button 
                  type="button" 
                  className={styles.backBtn} 
                  onClick={() => setStep(2)}
                  disabled={processing}
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

        </div>

        {/* SIDEBAR: Order Summary Component */}
        <OrderSummary
          items={summaryItems}
          subtotal={safeSubtotal}
          shipping={shippingCost}
          vat={vat}
          total={finalTotal}
        />
      </div>
    </div>
  );
};

export default CheckoutView;