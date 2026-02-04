import React, { useState } from 'react';
import styles from './OrdersView.module.css';

const OrdersView = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock orders data
  const orders = [
    {
      id: 'BRT-2025-001',
      date: 'Jan 28, 2025',
      status: 'delivered',
      items: 2,
      total: '$125.00',
      tracking: 'TRK123456789',
      items_detail: [
        { name: "Oversized 'Brut' Tee", size: 'L', quantity: 1 },
        { name: 'Infrastructure Hoodie', size: 'M', quantity: 1 }
      ]
    },
    {
      id: 'BRT-2025-002',
      date: 'Feb 02, 2025',
      status: 'processing',
      items: 1,
      total: '$210.00',
      tracking: null,
      items_detail: [
        { name: 'Architectural Coat', size: 'L', quantity: 1 }
      ]
    },
    {
      id: 'BRT-2025-003',
      date: 'Feb 04, 2025',
      status: 'shipped',
      items: 3,
      total: '$270.00',
      tracking: 'TRK987654321',
      items_detail: [
        { name: 'Minimalist Shell', size: 'M', quantity: 2 },
        { name: "Oversized 'Brut' Tee", size: 'XL', quantity: 1 }
      ]
    }
  ];

  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' }
  ];

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { label: 'Processing', class: styles.statusProcessing },
      shipped: { label: 'Shipped', class: styles.statusShipped },
      delivered: { label: 'Delivered', class: styles.statusDelivered }
    };
    return statusConfig[status] || statusConfig.processing;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        
        <div className={styles.filters}>
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.activeFilter : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h2>No Orders Found</h2>
          <p>You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {filteredOrders.map(order => {
            const statusInfo = getStatusBadge(order.status);
            
            return (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <h3>Order {order.id}</h3>
                    <span className={styles.orderDate}>{order.date}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${statusInfo.class}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className={styles.orderBody}>
                  <div className={styles.orderSummary}>
                    <div className={styles.summaryItem}>
                      <span className={styles.label}>Items</span>
                      <span className={styles.value}>{order.items}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.label}>Total</span>
                      <span className={styles.value}>{order.total}</span>
                    </div>
                    {order.tracking && (
                      <div className={styles.summaryItem}>
                        <span className={styles.label}>Tracking</span>
                        <span className={styles.value}>{order.tracking}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.orderItems}>
                    {order.items_detail.map((item, idx) => (
                      <div key={idx} className={styles.orderItem}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemDetails}>
                          Size: {item.size} • Qty: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.orderActions}>
                  {order.tracking && (
                    <button className={styles.btnSecondary}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Track Package
                    </button>
                  )}
                  <button className={styles.btnPrimary}>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersView;