/**
 * Payment Utilities for Brutige Checkout
 * Handles Paystack integration and payment processing
 */

// Payment response interface
export interface PaymentResponse {
  reference: string;
  trans: number;
  status: 'success' | 'failed' | 'abandoned';
  message?: string;
  transaction: string;
  redirecturl?: string;
}

// Payment configuration
export interface PaymentConfig {
  publicKey: string;
  email: string;
  amount: number; // in Naira (not kobo)
  reference: string;
  currency?: string;
  metadata?: Record<string, any>;
}

// Initialize Paystack payment
export const initializePayment = (
  config: PaymentConfig,
  onSuccess: (response: PaymentResponse) => void,
  onClose?: () => void
): void => {
  const paystack = (window as any).PaystackPop;
  
  // Check if Paystack is loaded
  if (!paystack) {
    console.warn('Paystack not loaded - using demo mode');
    // Demo mode: simulate successful payment after 2 seconds
    setTimeout(() => {
      const demoResponse: PaymentResponse = {
        reference: config.reference,
        trans: Date.now(),
        status: 'success',
        message: 'Demo payment successful',
        transaction: config.reference
      };
      onSuccess(demoResponse);
    }, 2000);
    return;
  }

  // Real Paystack integration
  const handler = paystack.setup({
    key: config.publicKey,
    email: config.email,
    amount: Math.round(config.amount * 100), // Convert to kobo
    currency: config.currency || 'NGN',
    ref: config.reference,
    metadata: {
      ...config.metadata,
      custom_fields: [
        {
          display_name: "Platform",
          variable_name: "platform",
          value: "Brutige"
        },
        ...(config.metadata?.custom_fields || [])
      ]
    },
    callback: (response: PaymentResponse) => {
      onSuccess(response);
    },
    onClose: () => {
      if (onClose) onClose();
    }
  });

  handler.openIframe();
};

// Generate unique payment reference
export const generatePaymentReference = (prefix: string = 'BRUTIGE'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

// Verify payment (for backend use later)
export const verifyPayment = async (reference: string): Promise<boolean> => {
  // TODO: Implement with backend API
  // For now, always return true in demo mode
  console.log(`Verifying payment: ${reference}`);
  return true;
};

// Get payment status from localStorage
export const getPaymentStatus = (reference: string): PaymentResponse | null => {
  const saved = localStorage.getItem(`payment_${reference}`);
  return saved ? JSON.parse(saved) : null;
};

// Save payment status to localStorage
export const savePaymentStatus = (response: PaymentResponse): void => {
  localStorage.setItem(`payment_${response.reference}`, JSON.stringify(response));
};