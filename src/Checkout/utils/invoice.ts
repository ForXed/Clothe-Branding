/**
 * Invoice Generation Utilities
 * Creates professional PDF invoices for makers
 */

import jsPDF from 'jspdf';

export interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  date: string;
  dueDate?: string;
  
  // Maker info
  maker: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  
  // Customer info
  customer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;
  };
  
  // Items
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  
  // Totals
  subtotal: number;
  tax: number;
  taxRate?: number;
  shipping: number;
  total: number;
  
  // Additional
  notes?: string;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

// Generate PDF invoice
export const generateInvoice = (data: InvoiceData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header - Brutige branding
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Powered by Brutige', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;

  // Invoice details (left side)
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Details:', 20, yPos);
  
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${data.invoiceNumber}`, 20, yPos);
  yPos += 5;
  doc.text(`Order ID: ${data.orderId}`, 20, yPos);
  yPos += 5;
  doc.text(`Date: ${formatDate(data.date)}`, 20, yPos);
  
  if (data.dueDate) {
    yPos += 5;
    doc.text(`Due Date: ${formatDate(data.dueDate)}`, 20, yPos);
  }

  // Payment status (right side)
  const statusColor = data.paymentStatus === 'paid' ? [34, 197, 94] : 
                      data.paymentStatus === 'failed' ? [239, 68, 68] : 
                      [245, 158, 11];
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(`Status: ${(data.paymentStatus || 'pending').toUpperCase()}`, pageWidth - 20, yPos + 10, { align: 'right' });
  
  yPos += 20;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // From (Maker)
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('From:', 20, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(data.maker.name, 20, yPos);
  yPos += 5;
  doc.text(data.maker.email, 20, yPos);
  if (data.maker.phone) {
    yPos += 5;
    doc.text(data.maker.phone, 20, yPos);
  }
  if (data.maker.address) {
    yPos += 5;
    doc.text(data.maker.address, 20, yPos);
  }

  // To (Customer)
  yPos = 80;
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', pageWidth / 2, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(data.customer.name, pageWidth / 2, yPos);
  yPos += 5;
  doc.text(data.customer.email, pageWidth / 2, yPos);
  if (data.customer.company) {
    yPos += 5;
    doc.text(data.customer.company, pageWidth / 2, yPos);
  }
  if (data.customer.phone) {
    yPos += 5;
    doc.text(data.customer.phone, pageWidth / 2, yPos);
  }
  if (data.customer.address) {
    yPos += 5;
    doc.text(data.customer.address, pageWidth / 2, yPos);
  }

  yPos += 15;

  // Items table header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos, pageWidth - 40, 8, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 25, yPos + 6);
  doc.text('Qty', 120, yPos + 6);
  doc.text('Unit Price', 140, yPos + 6);
  doc.text('Total', pageWidth - 25, yPos + 6, { align: 'right' });
  
  yPos += 12;

  // Items
  doc.setFont('helvetica', 'normal');
  data.items.forEach(item => {
    doc.text(item.description.substring(0, 50), 25, yPos);
    doc.text(item.quantity.toString(), 120, yPos);
    doc.text(`₦${item.unitPrice.toLocaleString()}`, 140, yPos);
    doc.text(`₦${item.total.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
    yPos += 8;
  });

  yPos += 5;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  // Totals
  doc.text('Subtotal:', 140, yPos);
  doc.text(`₦${data.subtotal.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 6;
  
  doc.text(`Tax (${data.taxRate || 7.5}%):`, 140, yPos);
  doc.text(`₦${data.tax.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 6;
  
  doc.text('Shipping:', 140, yPos);
  doc.text(`₦${data.shipping.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 8;

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setDrawColor(0, 0, 0);
  doc.line(140, yPos - 2, pageWidth - 20, yPos - 2);
  doc.text('TOTAL:', 140, yPos + 4);
  doc.text(`₦${data.total.toLocaleString()}`, pageWidth - 25, yPos + 4, { align: 'right' });

  yPos += 15;

  // Notes
  if (data.notes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Notes:', 20, yPos);
    yPos += 5;
    const splitNotes = doc.splitTextToSize(data.notes, pageWidth - 40);
    doc.text(splitNotes, 20, yPos);
  }

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for your business!', pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text('brutige.com | support@brutige.com', pageWidth / 2, yPos, { align: 'center' });

  return doc;
};

// Download invoice as PDF
export const downloadInvoice = (data: InvoiceData, filename?: string): void => {
  const doc = generateInvoice(data);
  const defaultFilename = `invoice-${data.invoiceNumber}.pdf`;
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

// Create invoice data from order
export const createInvoiceFromOrder = (order: any): InvoiceData => {
  return {
    invoiceNumber: `INV-${order.id}`,
    orderId: order.id,
    date: order.paidAt || new Date().toISOString(),
    maker: order.maker || {
      name: 'Brutige Maker',
      email: 'maker@brutige.com'
    },
    customer: {
      name: order.address?.fullName || 'Customer',
      email: order.address?.email || 'customer@brutige.com',
      phone: order.address?.phone,
      company: order.address?.company,
      address: `${order.address?.address1}, ${order.address?.city}, ${order.address?.state}`
    },
    items: order.items.map((item: any) => ({
      description: item.title || item.productName,
      quantity: item.quantity,
      unitPrice: item.price || (item.subtotal / item.quantity),
      total: item.subtotal || (item.price * item.quantity)
    })),
    subtotal: order.subtotal,
    tax: order.vat || order.tax || 0,
    taxRate: 7.5,
    shipping: order.shippingCost || 0,
    total: order.total,
    paymentMethod: 'Escrow (Paystack)',
    paymentStatus: 'paid'
  };
};