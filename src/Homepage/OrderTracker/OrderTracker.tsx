import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './OrderTracker.module.css';

const OrderTracker = ({ notify }) => {
  const { orderId } = useParams(); // Gets ID from URL
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  
  // Mock Data - In real app, fetch from API based on orderId
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Simulate API Fetch
    const mockOrder = {
      id: orderId || 'BRT-2025-001',
      status: 'delivered', // Options: processing, shipped, delivered
      estimatedDelivery: 'Oct 24, 2024',
      carrier: 'DHL Express',
      trackingNumber: 'TRK987654321',
      items: [
        { name: "Oversized 'Brut' Tee", size: 'L', qty: 1 },
        { name: 'Infrastructure Hoodie', size: 'M', qty: 1 }
      ],
      timeline: [
        { step: 'Order Placed', date: 'Oct 10', completed: true },
        { step: 'Tech Pack Verified', date: 'Oct 12', completed: true },
        { step: 'Production Started', date: 'Oct 15', completed: true },
        { step: 'Quality Check', date: 'Oct 20', completed: true },
        { step: 'Shipped', date: 'Oct 22', completed: true },
        { step: 'Delivered', date: 'Oct 24', completed: true },
      ]
    };
    setOrder(mockOrder);
  }, [orderId]);

  // --- Signature Pad Logic ---
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setHasSigned(true);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleConfirmDelivery = () => {
    if (!hasSigned) {
      if(notify) notify("Please sign to confirm receipt.", "error");
      return;
    }
    // Here you would send the signature image data to backend
    if(notify) notify("Delivery confirmed. Thank you!", "success");
    setShowSignatureModal(false);
    // Optionally redirect back to orders
    setTimeout(() => navigate('/platform/orders'), 1500);
  };

  if (!order) return <div className={styles.loading}>Loading Infrastructure Data...</div>;

  const isDelivered = order.status === 'delivered';

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate('/platform/orders')}>
        ← Back to Orders
      </button>

      <div className={styles.header}>
        <div>
          <h1>Order {order.id}</h1>
          <p className={styles.subHeader}>Tracking: {order.trackingNumber}</p>
        </div>
        <div className={`${styles.statusBadge} ${styles[order.status]}`}>
          {order.status.toUpperCase()}
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className={styles.timelineContainer}>
        <div className={styles.timeline}>
          {order.timeline.map((item, index) => (
            <div key={index} className={`${styles.step} ${item.completed ? styles.completed : ''}`}>
              <div className={styles.marker}>
                {item.completed && <span>✓</span>}
              </div>
              <div className={styles.stepInfo}>
                <h4>{item.step}</h4>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className={styles.detailsCard}>
        <h3>Shipment Details</h3>
        <div className={styles.grid}>
          <div>
            <span className={styles.label}>Carrier</span>
            <p>{order.carrier}</p>
          </div>
          <div>
            <span className={styles.label}>Est. Delivery</span>
            <p>{order.estimatedDelivery}</p>
          </div>
        </div>
        
        <h3>Items</h3>
        <ul className={styles.itemList}>
          {order.items.map((item, i) => (
            <li key={i}>
              {item.name} <span>(Size: {item.size}, Qty: {item.qty})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Area: Only show Confirm button if Delivered */}
      {isDelivered && (
        <div className={styles.actionArea}>
          <p>Received your goods? Please confirm delivery.</p>
          <button className={styles.confirmBtn} onClick={() => setShowSignatureModal(true)}>
            Confirm Receipt & Sign
          </button>
        </div>
      )}

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Confirm Delivery</h2>
            <p>Sign below to verify you have received your order in good condition.</p>
            
            <div className={styles.canvasWrapper}>
              <canvas
                ref={canvasRef}
                width={500}
                height={250}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className={styles.signatureCanvas}
              />
            </div>
            
            <div className={styles.modalActions}>
              <button className={styles.clearBtn} onClick={clearSignature}>Clear</button>
              <button 
                className={`${styles.saveBtn} ${!hasSigned ? styles.disabled : ''}`} 
                onClick={handleConfirmDelivery}
                disabled={!hasSigned}
              >
                Confirm Delivery
              </button>
            </div>
            <button className={styles.closeModal} onClick={() => setShowSignatureModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;