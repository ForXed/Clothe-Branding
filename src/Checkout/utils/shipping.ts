/**
 * Shipping Utilities
 * Calculates shipping rates and manages shipping options
 */

export interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  days: string;
  price: number;
  description?: string;
}

export interface ShippingAddress {
  city: string;
  state: string;
  country: string;
}

// Available shipping options
export const SHIPPING_OPTIONS: ShippingOption[] = [
  { 
    id: 'lagos-same', 
    name: 'Same Day Delivery (Lagos)', 
    carrier: 'GIG Logistics', 
    days: 'Same day', 
    price: 3500,
    description: 'Delivered today if ordered before 12 PM'
  },
  { 
    id: 'lagos-std', 
    name: 'Lagos Standard', 
    carrier: 'GIG Logistics', 
    days: '1-2', 
    price: 2500,
    description: 'Standard delivery within Lagos'
  },
  { 
    id: 'naija-std', 
    name: 'Nationwide Standard', 
    carrier: 'GIG Logistics', 
    days: '3-5', 
    price: 5000,
    description: 'Standard delivery across Nigeria'
  },
  { 
    id: 'naija-exp', 
    name: 'Nationwide Express', 
    carrier: 'DHL Nigeria', 
    days: '2-3', 
    price: 8500,
    description: 'Express delivery nationwide'
  },
];

// Calculate shipping based on address
export const calculateShipping = (address: ShippingAddress): ShippingOption[] => {
  // If Lagos, show Lagos options first
  if (address.state === 'Lagos' && address.country === 'Nigeria') {
    return SHIPPING_OPTIONS;
  }
  
  // For other states, show nationwide options
  return SHIPPING_OPTIONS.filter(option => 
    option.id.includes('naija')
  );
};

// Get shipping option by ID
export const getShippingOption = (id: string | null): ShippingOption | undefined => {
  if (!id) return undefined;
  return SHIPPING_OPTIONS.find(option => option.id === id);
};

// Calculate estimated delivery date
export const calculateDeliveryDate = (
  shippingOption: ShippingOption,
  startDate: Date = new Date()
): Date => {
  const deliveryDate = new Date(startDate);
  
  // Parse days from shipping option
  if (shippingOption.days === 'Same day') {
    // Same day delivery
    return deliveryDate;
  }
  
  const daysMatch = shippingOption.days.match(/(\d+)-(\d+)/);
  if (daysMatch) {
    const maxDays = parseInt(daysMatch[2]);
    deliveryDate.setDate(deliveryDate.getDate() + maxDays);
  } else {
    // Default to 3 days
    deliveryDate.setDate(deliveryDate.getDate() + 3);
  }
  
  return deliveryDate;
};

// Format shipping option for display
export const formatShippingOption = (option: ShippingOption): string => {
  return `${option.name} - ₦${option.price.toLocaleString()} (${option.days} days)`;
};

// Check if shipping is free (for future use)
export const isFreeShipping = (subtotal: number): boolean => {
  // Free shipping for orders over ₦100,000
  return subtotal >= 100000;
};

// Get discounted shipping (for future use)
export const getDiscountedShipping = (
  option: ShippingOption,
  discount: number = 0
): number => {
  return Math.max(0, option.price - discount);
};