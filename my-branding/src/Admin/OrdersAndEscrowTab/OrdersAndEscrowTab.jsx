import React, { useState, useMemo } from 'react';
import styles from './OrdersAndEscrowTab.module.css';

const OrdersAndEscrowTab = ({ notify }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // Added search state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modal States for Dispute Resolution
  const [disputeAction, setDisputeAction] = useState(null); 
  const [disputeNote, setDisputeNote] = useState('');

  // Mock Data: Orders with Escrow Status
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8821',
      product: 'Heavyweight Oversized Tee - Black',
      buyer: 'John Doe',
      buyerEmail: 'john@example.com',
      maker: 'Urban Thread Co.',
      makerId: 'M-001',
      amount: '$45.00',
      escrowAmount: '$45.00',
      status: 'held',
      date: '2023-10-26',
      tracking: null,
      disputeReason: null
    },
    {
      id: 'ORD-8822',
      product: 'Distressed Cargo Pants',
      buyer: 'Sarah Smith',
      buyerEmail: 'sarah@example.com',
      maker: 'Void Archives',
      makerId: 'M-003',
      amount: '$120.00',
      escrowAmount: '$120.00',
      status: 'in_transit',
      date: '2023-10-24',
      tracking: 'USPS-99283712',
      disputeReason: null
    },
    {
      id: 'ORD-8823',
      product: 'Neon Running Shorts',
      buyer: 'Mike Ross',
      buyerEmail: 'mike@example.com',
      maker: 'Neon Athletics',
      makerId: 'M-002',
      amount: '$35.00',
      escrowAmount: '$0.00',
      status: 'completed', 
      date: '2023-10-20',
      tracking: 'FEDEX-112233',
      disputeReason: null
    },
    {
      id: 'ORD-8824',
      product: 'Fake Designer Hoodie',
      buyer: 'Alex Chen',
      buyerEmail: 'alex@example.com',
      maker: 'Fast Fashion Hub',
      makerId: 'M-004',
      amount: '$30.00',
      escrowAmount: '$30.00',
      status: 'disputed',
      date: '2023-10-22',
      tracking: null,
      disputeReason: 'Item received is counterfeit.'
    },
    {
      id: 'ORD-8825',
      product: 'Basic White Tee',
      buyer: 'Emily Blunt',
      buyerEmail: 'emily@example.com',
      maker: 'Urban Thread Co.',
      makerId: 'M-001',
      amount: '$25.00',
      escrowAmount: '$0.00',
      status: 'refunded',
      date: '2023-10-21',
      tracking: null,
      disputeReason: 'Item never shipped.'
    }
  ]);

  // Updated Filter Logic to include Search
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Check Status Filter
      const matchesStatus = filter === 'all' || order.status === filter;
      
      // 2. Check Search Query (Case Insensitive)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        order.id.toLowerCase().includes(query) ||
        order.product.toLowerCase().includes(query) ||
        order.buyer.toLowerCase().includes(query) ||
        order.maker.toLowerCase().includes(query) ||
        order.buyerEmail.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  const stats = {
    total: orders.length,
    held: orders.filter(o => o.status === 'held').length,
    transit: orders.filter(o => o.status === 'in_transit').length,
    disputed: orders.filter(o => o.status === 'disputed').length,
    volume: '$2,450.00'
  };

  const handleResolveDispute = async (action) => {
    if (!disputeNote.trim() && action === 'refund_buyer') {
      alert("Please add an admin note explaining the decision.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setOrders(prev => prev.map(o => {
        if (o.id === selectedOrder.id) {
          return {
            ...o,
            status: action === 'release_maker' ? 'completed' : 'refunded',
            disputeReason: `${o.disputeReason} (Resolved: ${action})`
          };
        }
        return o;
      }));
      
      setSelectedOrder(null);
      setDisputeAction(null);
      setDisputeNote('');
      setIsProcessing(false);
      
      const msg = action === 'release_maker' 
        ? 'Funds released to Maker.' 
        : 'Funds refunded to Buyer.';
      
      if (notify) notify(msg, 'success');
    }, 1000);
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'held': return 'Funds Held';
      case 'in_transit': return 'In Transit';
      case 'completed': return 'Completed';
      case 'disputed': return 'Disputed';
      case 'refunded': return 'Refunded';
      default: return status;
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Orders</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={`${styles.statItem} ${styles.held}`}>
          <span className={styles.statLabel}>Funds Held</span>
          <span className={styles.statValue}>{stats.held}</span>
        </div>
        <div className={`${styles.statItem} ${styles.transit}`}>
          <span className={styles.statLabel}>In Transit</span>
          <span className={styles.statValue}>{stats.transit}</span>
        </div>
        <div className={`${styles.statItem} ${styles.disputed}`}>
          <span className={styles.statLabel}>Active Disputes</span>
          <span className={styles.statValue}>{stats.disputed}</span>
        </div>
        <div className={`${styles.statItem} ${styles.volume}`}>
          <span className={styles.statLabel}>Escrow Volume</span>
          <span className={styles.statValue}>{stats.volume}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`${styles.filterBtn} ${filter === 'held' ? styles.active : ''}`} onClick={() => setFilter('held')}>
            Funds Held {stats.held > 0 && <span className={styles.badge}>{stats.held}</span>}
          </button>
          <button className={`${styles.filterBtn} ${filter === 'in_transit' ? styles.active : ''}`} onClick={() => setFilter('in_transit')}>In Transit</button>
          <button className={`${styles.filterBtn} ${filter === 'disputed' ? styles.active : ''}`} onClick={() => setFilter('disputed')}>
            Disputed {stats.disputed > 0 && <span className={styles.badge}>{stats.disputed}</span>}
          </button>
          <button className={`${styles.filterBtn} ${filter === 'completed' ? styles.active : ''}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>
        
        <div className={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search Order ID, Product..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID / Product</th>
              <th>Buyer / Maker</th>
              <th>Amount</th>
              <th>Escrow Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id} className={order.status === 'disputed' ? styles.rowDisputed : ''}>
                  <td>
                    <div className={styles.orderCell}>
                      <span className={styles.orderId}>{order.id}</span>
                      <span className={styles.productName}>{order.product}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.userCell}>
                      <span className={styles.userName}>{order.buyer}</span>
                      <span className={styles.makerName}>via {order.maker}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.amount}>{order.amount}</span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <button className={styles.viewBtn} onClick={() => setSelectedOrder(order)}>
                      {order.status === 'disputed' ? 'Resolve' : 'Details'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.emptyState}>No orders found matching your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail / Dispute Modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => { setSelectedOrder(null); setDisputeAction(null); }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            
            {!disputeAction ? (
              // VIEW DETAILS MODE
              <>
                <div className={styles.modalHeader}>
                  <div>
                    <h3>Order {selectedOrder.id}</h3>
                    <p>{selectedOrder.product}</p>
                  </div>
                  <button className={styles.closeBtn} onClick={() => { setSelectedOrder(null); setDisputeAction(null); }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.statusBanner}>
                    <span className={styles.bannerLabel}>Current Escrow State:</span>
                    <span className={`${styles.statusBadge} ${styles[selectedOrder.status]}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>

                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>Buyer</label>
                      <span>{selectedOrder.buyer} <small>({selectedOrder.buyerEmail})</small></span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Maker</label>
                      <span>{selectedOrder.maker}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Order Amount</label>
                      <span className={styles.amount}>{selectedOrder.amount}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Funds in Escrow</label>
                      <span className={styles.escrowAmount}>{selectedOrder.escrowAmount}</span>
                    </div>
                    
                    {selectedOrder.tracking && (
                      <div className={styles.infoItemFull}>
                        <label>Tracking Number</label>
                        <code className={styles.trackingCode}>{selectedOrder.tracking}</code>
                      </div>
                    )}

                    {selectedOrder.disputeReason && (
                      <div className={styles.infoItemFull}>
                        <label>Dispute Reason</label>
                        <div className={styles.alertBox}>{selectedOrder.disputeReason}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.modalActions}>
                  {selectedOrder.status === 'disputed' ? (
                    <>
                      <button className={styles.refundBtn} onClick={() => setDisputeAction('refund_buyer')}>
                        Refund Buyer
                      </button>
                      <button className={styles.releaseBtn} onClick={() => setDisputeAction('release_maker')}>
                        Release to Maker
                      </button>
                    </>
                  ) : (
                    <button className={styles.closeActionBtn} onClick={() => setSelectedOrder(null)}>Close</button>
                  )}
                </div>
              </>
            ) : (
              // DISPUTE RESOLUTION MODE
              <>
                <div className={styles.modalHeader}>
                  <h3>Resolve Dispute: {selectedOrder.id}</h3>
                  <button className={styles.closeBtn} onClick={() => setDisputeAction(null)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.warningText}>
                    You are about to <strong>{disputeAction === 'refund_buyer' ? 'REFUND THE BUYER' : 'RELEASE FUNDS TO MAKER'}</strong>. 
                    This action is final and will move the escrow funds immediately.
                  </div>
                  
                  <div className={styles.reasonSection}>
                    <label>Admin Note (Required for Refunds)</label>
                    <textarea 
                      placeholder="Explain why this decision was made. This may be visible to both parties." 
                      rows={4}
                      value={disputeNote}
                      onChange={(e) => setDisputeNote(e.target.value)}
                      className={styles.reasonInput}
                    />
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setDisputeAction(null)}>Cancel</button>
                  <button 
                    className={disputeAction === 'release_maker' ? styles.confirmReleaseBtn : styles.confirmRefundBtn} 
                    onClick={() => handleResolveDispute(disputeAction)} 
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Decision'}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAndEscrowTab;