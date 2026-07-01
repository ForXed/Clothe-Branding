import React from 'react';
import styles from './PaymentButton.module.css';

interface PaymentButtonProps {
  amount: number;
  email: string;
  reference: string;
  onSuccess: (response: any) => void;
  onClose?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  email,
  reference,
  onSuccess,
  onClose,
  disabled = false,
  loading = false
}) => {
  const formatNaira = (amt: number) => 
    `₦${amt.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;

  const handlePayment = () => {
    if (disabled || loading) return;

    // Check if Paystack is available
    if (typeof (window as any).PaystackPop === 'undefined') {
      console.warn('Paystack not loaded - using demo mode');
      // Demo mode: simulate successful payment
      const demoResponse = {
        reference: reference,
        status: 'success',
        trans: Date.now(),
        transaction: reference
      };
      onSuccess(demoResponse);
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: 'pk_test_your_paystack_key_here', // Replace with actual key later
      email: email,
      amount: Math.round(amount * 100), // Convert to kobo
      currency: 'NGN',
      ref: reference,
      metadata: {
        order_reference: reference,
        custom_fields: [
          { 
            display_name: "Order Type", 
            variable_name: "order_type", 
            value: "brutige_order" 
          }
        ]
      },
      callback: (response: any) => {
        onSuccess(response);
      },
      onClose: () => {
        if (onClose) onClose();
      }
    });
    
    handler.openIframe();
  };

  return (
    <button 
      type="button"
      className={styles.payButton}
      onClick={handlePayment}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <div className={styles.spinner}></div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <span>Pay {formatNaira(amount)} Securely</span>
        </>
      )}
    </button>
  );
};

export default PaymentButton;