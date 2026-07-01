/**
 * Receipt Generation Utilities
 * Creates payment receipts for customers
 */

import jsPDF from 'jspdf';

export interface ReceiptData {
  receiptNumber: string;
  orderId: string;
  paymentReference: string;
  date: string;
  
  // Customer info
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  
  // Payment details
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  
  // Order summary
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  
  // Breakdown
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  
  // Additional
  escrowInfo?: boolean;
  deliveryDate?: string;
}

// Generate PDF receipt
export const generateReceipt = (data: ReceiptData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 197, 94); // Green for success
  doc.text('PAYMENT RECEIPT', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your payment!', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;

  // Receipt box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(250, 250, 250);
  doc.rect(20, yPos, pageWidth - 40, 30, 'FD');
  
  // Receipt details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Receipt #:', 25, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.receiptNumber, 60, yPos + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 25, yPos + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(data.date), 60, yPos + 15);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Order ID:', 25, yPos + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(data.orderId, 60, yPos + 22);
  
  yPos += 35;

  // Customer info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Customer Information', 20, yPos);
  yPos += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${data.customer.name}`, 25, yPos);
  yPos += 5;
  doc.text(`Email: ${data.customer.email}`, 25, yPos);
  if (data.customer.phone) {
    yPos += 5;
    doc.text(`Phone: ${data.customer.phone}`, 25, yPos);
  }
  
  yPos += 10;

  // Payment details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Payment Details', 20, yPos);
  yPos += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Payment Method: ${data.paymentMethod}`, 25, yPos);
  yPos += 5;
  doc.text(`Transaction ID: ${data.paymentReference}`, 25, yPos);
  if (data.transactionId) {
    yPos += 5;
    doc.text(`Bank Reference: ${data.transactionId}`, 25, yPos);
  }
  
  yPos += 10;

  // Items
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Order Summary', 20, yPos);
  yPos += 6;
  
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos, pageWidth - 40, 8, 'F');
  
  doc.setFontSize(9);
  doc.text('Item', 25, yPos + 6);
  doc.text('Qty', 120, yPos + 6);
  doc.text('Price', pageWidth - 25, yPos + 6, { align: 'right' });
  
  yPos += 12;

  // Items
  doc.setFont('helvetica', 'normal');
  data.items.forEach(item => {
    doc.text(item.description.substring(0, 45), 25, yPos);
    doc.text(item.quantity.toString(), 120, yPos);
    doc.text(`₦${item.price.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
    yPos += 7;
  });

  yPos += 5;

  // Totals
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  doc.text('Subtotal:', 120, yPos);
  doc.text(`₦${data.subtotal.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 6;
  
  doc.text('Tax (7.5%):', 120, yPos);
  doc.text(`₦${data.tax.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 6;
  
  doc.text('Shipping:', 120, yPos);
  doc.text(`₦${data.shipping.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 8;

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setDrawColor(0, 0, 0);
  doc.line(120, yPos - 2, pageWidth - 20, yPos - 2);
  doc.text('TOTAL PAID:', 120, yPos + 4);
  doc.setTextColor(34, 197, 94);
  doc.text(`₦${data.total.toLocaleString()}`, pageWidth - 25, yPos + 4, { align: 'right' });

  yPos += 15;

  // Escrow notice
  if (data.escrowInfo) {
    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(34, 197, 94);
    doc.rect(20, yPos, pageWidth - 40, 20, 'FD');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('🔒 Secured by Escrow', 25, yPos + 6);
    doc.setFont('helvetica', 'normal');
    doc.text('Your payment is held safely until delivery is confirmed.', 25, yPos + 12);
    doc.text('Funds will be released to the maker after you confirm receipt.', 25, yPos + 17);
    
    yPos += 25;
  }

  // Delivery info
  if (data.deliveryDate) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Estimated Delivery:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(data.deliveryDate), 70, yPos);
    yPos += 10;
  }

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('This is a computer-generated receipt. No signature required.', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text('For support: support@brutige.com | brutige.com', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });

  return doc;
};

// Download receipt as PDF
export const downloadReceipt = (data: ReceiptData, filename?: string): void => {
  const doc = generateReceipt(data);
  const defaultFilename = `receipt-${data.receiptNumber}.pdf`;
  doc.save(filename || defaultFilename);
};

// Format date helper
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Create receipt data from order
export const createReceiptFromOrder = (order: any): ReceiptData => {
  return {
    receiptNumber: `RCP-${order.id}`,
    orderId: order.id,
    paymentReference: order.paymentRef,
    date: order.paidAt || new Date().toISOString(),
    customer: {
      name: order.address?.fullName || 'Customer',
      email: order.address?.email || 'customer@brutige.com',
      phone: order.address?.phone
    },
    amount: order.total,
    paymentMethod: 'Escrow (Paystack)',
    transactionId: order.paymentRef,
    items: order.items.map((item: any) => ({
      description: item.title || item.productName,
      quantity: item.quantity,
      price: item.subtotal || (item.price * item.quantity)
    })),
    subtotal: order.subtotal,
    tax: order.vat || order.tax || 0,
    shipping: order.shippingCost || 0,
    total: order.total,
    escrowInfo: true,
    deliveryDate: order.deliveryDate
  };
};