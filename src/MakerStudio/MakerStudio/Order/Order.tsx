import React, { useState, useMemo } from 'react';
import styles from './Order.module.css';

const Order = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullView, setShowFullView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');

  // Enhanced Mock Data with Items Array
  const [orders, setOrders] = useState([
    { 
      id: 'BR-001', 
      customer: 'Alex M.', 
      email: 'alex@example.com', 
      total: '234', 
      status: 'pending', 
      date: '2024-01-15', 
      address: '123 Studio Way, NY',
      tracking: '',
      items: [
        { name: "Oversized 'Brut' Tee", variant: "Black / L", qty: 1, price: 45 },
        { name: "Infrastructure Hoodie", variant: "Grey / XL", qty: 1, price: 89 }
      ] 
    },
    { 
      id: 'BR-002', 
      customer: 'Sarah K.', 
      email: 'sarah@example.com', 
      total: '145', 
      status: 'processing', 
      date: '2024-01-14', 
      address: '456 Oak Ave, LA',
      tracking: '',
      items: [
        { name: "Essential Cargo", variant: "Olive / 32", qty: 1, price: 145 }
      ] 
    },
    { 
      id: 'BR-003', 
      customer: 'Mike R.', 
      email: 'mike@example.com', 
      total: '354', 
      status: 'shipped', 
      date: '2024-01-13', 
      address: '789 Industrial Pk, TX',
      tracking: '1Z999AA10123456784',
      items: [
        { name: "Technical Vest", variant: "Black / M", qty: 2, price: 89 },
        { name: "Studio Cap", variant: "White / OS", qty: 2, price: 35 }
      ] 
    },
    { 
      id: 'BR-004', 
      customer: 'Emma L.', 
      email: 'emma@example.com', 
      total: '89', 
      status: 'completed', 
      date: '2024-01-12', 
      address: '101 Artisan Rd, CA',
      tracking: '1Z999AA10123456785',
      items: [
        { name: "Oversized 'Brut' Tee", variant: "White / S", qty: 1, price: 45 },
        { name: "Sticker Pack", variant: "N/A", qty: 2, price: 10 }
      ] 
    },
    { 
      id: 'BR-005', 
      customer: 'James W.', 
      email: 'james@example.com', 
      total: '210', 
      status: 'cancelled', 
      date: '2024-01-11', 
      address: '202 Maker St, OR',
      tracking: '',
      items: [
        { name: "Infrastructure Hoodie", variant: "Black / L", qty: 1, price: 89 },
        { name: "Essential Cargo", variant: "Black / 34", qty: 1, price: 121 }
      ] 
    },
  ]);

  const statuses = ['pending', 'processing', 'shipped', 'completed'];

  // Filter Logic (Status + Search)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = filter === 'all' || order.status === filter;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower);
      
      return matchesStatus && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleSaveTracking = () => {
    if (selectedOrder) {
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, tracking: trackingInput } : o));
      setSelectedOrder(prev => ({ ...prev, tracking: trackingInput }));
      alert("Tracking number saved!");
    }
  };

  const calculateProgressWidth = (status) => {
    const index = statuses.indexOf(status);
    if (index === -1) return 0;
    return (index / (statuses.length - 1)) * 100;
  };

  const handlePrint = () => {
    window.print();
  };

  const totalUnits = (items) => items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className={styles.container}>
      {/* HEADER & FILTERS */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>Infrastructure Ledger</h2>
          <button className={styles.printBtn} onClick={handlePrint}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            <span>Print</span>
          </button>
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.searchBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search ID, Customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterWrapper}>
            {['all', ...statuses, 'cancelled'].map(f => (
              <button 
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className={styles.tableWrapper}>
        <div className={styles.scrollArea}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className={styles.bold}>{order.id}</td>
                    <td>
                      <div className={styles.customerBox}>
                        <span className={styles.name}>{order.customer}</span>
                        <span className={styles.email}>{order.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.itemsPreview}>
                        <span className={styles.qtyBadge}>{totalUnits(order.items)}</span>
                        <span className={styles.itemsText}>
                          {order.items.length > 1 ? `${order.items[0].name} +${order.items.length - 1} more` : order.items[0].name}
                        </span>
                      </div>
                    </td>
                    <td className={styles.bold}>${order.total}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.viewBtn} onClick={() => { setSelectedOrder(order); setTrackingInput(order.tracking || ''); setShowFullView(true); }}>View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.emptyState}>No orders found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL VIEW */}
      {showFullView && selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setShowFullView(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <h2>{selectedOrder.id}</h2>
                <p>Placed: {selectedOrder.date}</p>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.printBtnSmall} onClick={handlePrint} title="Print Packing Slip">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                  </svg>
                </button>
                <button className={styles.closeBtn} onClick={() => setShowFullView(false)}>✕</button>
              </div>
            </div>

            <div className={styles.modalBody}>
              {/* TIMELINE */}
              <div className={styles.timelineBox}>
                <div className={styles.lineTrack}>
                    <div 
                        className={styles.lineFill} 
                        style={{ width: `${calculateProgressWidth(selectedOrder.status)}%` }} 
                    />
                </div>
                <div className={styles.steps}>
                  {statuses.map((s, idx) => (
                    <div key={s} className={`${styles.step} ${statuses.indexOf(selectedOrder.status) >= idx ? styles.activeStep : ''}`}>
                      <div className={styles.dot} />
                      <span className={styles.stepLabel}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DATA GRID */}
              <div className={styles.infoGrid}>
                <div className={styles.infoSection}>
                  <label className={styles.capsLabel}>Identity Meta</label>
                  <p><strong>Name:</strong> {selectedOrder.customer}</p>
                  <p><strong>Email:</strong> {selectedOrder.email}</p>
                  <p><strong>Node:</strong> {selectedOrder.address}</p>
                </div>
                <div className={styles.infoSection}>
                  <label className={styles.capsLabel}>Loop Load</label>
                  <p><strong>Units:</strong> {totalUnits(selectedOrder.items)} Garments</p>
                  <p><strong>Total:</strong> <span className={styles.greenText}>${selectedOrder.total}</span></p>
                  {selectedOrder.tracking && (
                     <p><strong>Tracking:</strong> <span className={styles.trackingText}>{selectedOrder.tracking}</span></p>
                  )}
                </div>
              </div>

              {/* ITEMS LIST */}
              <div className={styles.itemsListSection}>
                <label className={styles.capsLabel}>Order Contents</label>
                <div className={styles.itemsList}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemVariant}>{item.variant}</span>
                      </div>
                      <div className={styles.itemMeta}>
                        <span>x{item.qty}</span>
                        <span>${item.price * item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STATUS & TRACKING UPDATE */}
              <div className={styles.updateArea}>
                <div className={styles.updateRow}>
                  <label className={styles.capsLabel}>Update Infrastructure Status</label>
                  <div className={styles.statusGrid}>
                    {statuses.map(s => (
                      <button
                        key={s}
                        className={`${styles.statusOption} ${selectedOrder.status === s ? styles.activeStatus : ''}`}
                        onClick={() => handleStatusChange(selectedOrder.id, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedOrder.status === 'shipped' && (
                  <div className={styles.trackingRow}>
                    <label className={styles.capsLabel}>Tracking Number</label>
                    <div className={styles.trackingInputWrapper}>
                      <input 
                        type="text" 
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="Enter carrier tracking ID"
                      />
                      <button className={styles.saveTrackBtn} onClick={handleSaveTracking}>Save</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;