import React from 'react';
import styles from './ShippingSelector.module.css';

interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  days: string;
  price: number;
}

interface ShippingSelectorProps {
  isLoading: boolean;
  selectedShipping: string | null;
  onSelectShipping: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
  shippingOptions?: ShippingOption[];
}

// Default shipping options (fallback)
const DEFAULT_SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'lagos-same', name: 'Same Day Delivery (Lagos)', carrier: 'GIG Logistics', days: 'Same day', price: 3500 },
  { id: 'lagos-std', name: 'Lagos Standard', carrier: 'GIG Logistics', days: '1-2', price: 2500 },
  { id: 'naija-std', name: 'Nationwide Standard', carrier: 'GIG Logistics', days: '3-5', price: 5000 },
  { id: 'naija-exp', name: 'Nationwide Express', carrier: 'DHL Nigeria', days: '2-3', price: 8500 },
];

const ShippingSelector: React.FC<ShippingSelectorProps> = ({
  isLoading,
  selectedShipping,
  onSelectShipping,
  onBack,
  onContinue,
  shippingOptions = DEFAULT_SHIPPING_OPTIONS
}) => {
  const formatNaira = (amount: number) => 
    `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;

  return (
    <div className={styles.formSection}>
      <h2 className={styles.title}>Select Shipping Method</h2>
      <p className={styles.subText}>Delivery options for your location</p>

      {isLoading ? (
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
              onClick={() => onSelectShipping(option.id)}
            >
              <div className={styles.radioCircle}>
                {selectedShipping === option.id && <div className={styles.radioDot} />}
              </div>
              <div className={styles.shippingInfo}>
                <h4>{option.name}</h4>
                <p className={styles.carrier}>{option.carrier}</p>
                <p className={styles.deliveryTime}>
                  Est. Delivery: {option.days} {option.days.includes('-') || option.days === 'Same day' ? '' : 'day'}
                </p>
              </div>
              <div className={styles.shippingPrice}>
                {formatNaira(option.price)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actionRow}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <button 
          type="button" 
          className={styles.continueBtn} 
          onClick={onContinue} 
          disabled={!selectedShipping}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default ShippingSelector;