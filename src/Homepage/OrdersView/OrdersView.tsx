import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrdersView.module.css';

const OrdersView = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Mock orders data with Timeline details
  const orders = [
    {
      id: 'BRT-2025-001',
      date: 'Jan 28, 2025',
      status: 'delivered',
      progress: 100,
      items: 2,
      total: '$125.00',
      tracking: 'TRK123456789',
      timeline: [
        { stage: 'Order Received', date: 'Jan 28', completed: true },
        { stage: 'Production', date: 'Jan 30', completed: true },
        { stage: 'Quality Check', date: 'Feb 02', completed: true },
        { stage: 'Shipped', date: 'Feb 04', completed: true },
        { stage: 'Delivered', date: 'Feb 06', completed: true }
      ],
      items_detail: [
        { name: "Oversized 'Brut' Tee", size: 'L', quantity: 1 },
        { name: 'Infrastructure Hoodie', size: 'M', quantity: 1 }
      ]
    },
    {
      id: 'BRT-2025-002',
      date: 'Feb 02, 2025',
      status: 'processing',
      progress: 45,
      items: 1,
      total: '$210.00',
      tracking: null,
      timeline: [
        { stage: 'Order Received', date: 'Feb 02', completed: true },
        { stage: 'Production', date: 'In Progress', completed: false },
        { stage: 'Quality Check', date: 'Pending', completed: false },
        { stage: 'Shipped', date: 'Pending', completed: false },
        { stage: 'Delivered', date: 'Pending', completed: false }
      ],
      items_detail: [
        { name: 'Architectural Coat', size: 'L', quantity: 1 }
      ]
    },
    {
      id: 'BRT-2025-003',
      date: 'Feb 04, 2025',
      status: 'shipped',
      progress: 80,
      items: 3,
      total: '$270.00',
      tracking: 'TRK987654321',
      timeline: [
        { stage: 'Order Received', date: 'Feb 04', completed: true },
        { stage: 'Production', date: 'Feb 06', completed: true },
        { stage: 'Quality Check', date: 'Feb 08', completed: true },
        { stage: 'Shipped', date: 'Feb 10', completed: true },
        { stage: 'Delivered', date: 'Expected Feb 14', completed: false }
      ],
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

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toUpperCase().trim();
    if (!query) {
      setTrackedOrder(null);
      return;
    }
    
    // Simulate finding an order (supports partial match for demo)
    const found = orders.find(o => o.id.includes(query) || query === 'DEMO');
    if (found) {
      setTrackedOrder(found);
      setActiveFilter('all'); // Reset filter to show result
    } else {
      setTrackedOrder(null);
      alert('Order not found. Try "BRT-2025-001" or "DEMO"');
    }
  };

  const handleViewDetailedTrack = (order) => {
    // Navigate to the dedicated tracker page with signature pad
    navigate(`/platform/orders/track/${order.id}`);
  };

  const filteredOrders = trackedOrder 
    ? [trackedOrder] 
    : (activeFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === activeFilter));

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
      {/* --- TRACKING HERO SECTION --- */}
      <div className={styles.trackingHero}>
        <h1 className={styles.title}>Track Production</h1>
        <p className={styles.subtitle}>Enter your Order ID to view real-time manufacturing status.</p>
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g., BRT-2025-001)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Track
          </button>
        </form>
      </div>

      {/* --- FILTERS (Hidden when tracking a specific order) --- */}
      {!trackedOrder && (
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
      )}

      {/* --- RESULTS --- */}
      {filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h2>No Orders Found</h2>
          <p>{trackedOrder ? "That Order ID doesn't exist." : "You haven't placed any orders yet."}</p>
          {trackedOrder && (
            <button onClick={() => {setSearchQuery(''); setTrackedOrder(null);}} className={styles.resetBtn}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className={styles.ordersList}>
          {filteredOrders.map(order => {
            const statusInfo = getStatusBadge(order.status);
            
            return (
              <div key={order.id} className={`${styles.orderCard} ${trackedOrder ? styles.trackedCard : ''}`}>
                {/* Header */}
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <h3>Order {order.id}</h3>
                    <span className={styles.orderDate}>{order.date}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${statusInfo.class}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* VISUAL TIMELINE (Only shown when tracking) */}
                {trackedOrder && (
                  <div className={styles.timelineContainer}>
                    <div className={styles.timeline}>
                      {order.timeline.map((step, idx) => (
                        <div key={idx} className={`${styles.timelineStep} ${step.completed ? styles.completed : ''}`}>
                          <div className={styles.stepMarker}>
                            {step.completed ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            ) : (
                              <span className={styles.dot} />
                            )}
                          </div>
                          <div className={styles.stepInfo}>
                            <span className={styles.stepName}>{step.stage}</span>
                            <span className={styles.stepDate}>{step.date}</span>
                          </div>
                          {idx !== order.timeline.length - 1 && <div className={styles.stepLine} />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Body Details */}
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
                        <span className={styles.valueCode}>{order.tracking}</span>
                      </div>
                    )}
                  </div>

                  {!trackedOrder && (
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
                  )}
                </div>

                {/* Actions */}
                <div className={styles.orderActions}>
                  {order.tracking && !trackedOrder && (
                    <button className={styles.btnSecondary}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Carrier Site
                    </button>
                  )}
                  
                  {trackedOrder && order.status === 'delivered' ? (
                     <button onClick={() => handleViewDetailedTrack(order)} className={styles.btnPrimary}>
                       Confirm Receipt & Sign
                     </button>
                  ) : (
                    <button onClick={() => trackedOrder ? handleViewDetailedTrack(order) : null} className={styles.btnPrimary}>
                      {trackedOrder ? 'Full Details & Updates' : 'View Details'}
                    </button>
                  )}
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