import React, { useState, useMemo } from 'react';
import styles from './FinanceAndPayoutsTab.module.css';

const FinanceAndPayoutsTab = ({ notify }) => {
  const [activeView, setActiveView] = useState('payouts'); // 'overview', 'payouts', 'ledger'
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock Financial Data
  const [financialStats, setFinancialStats] = useState({
    totalVolume: '$12,450.00',
    platformFees: '$1,245.00', // Your 10% commission
    pendingPayouts: '$3,200.00', // Money waiting to be sent to makers
    availableCash: '$8,005.00'  // Actual cash on hand
  });

  // Mock Payout Requests
  const [payouts, setPayouts] = useState([
    {
      id: 'PAY-001',
      maker: 'Urban Thread Co.',
      makerId: 'M-001',
      amount: '$450.00',
      requestedDate: '2023-10-25',
      status: 'pending',
      method: 'Bank Transfer',
      accountDetails: '**** 1234'
    },
    {
      id: 'PAY-002',
      maker: 'Void Archives',
      makerId: 'M-003',
      amount: '$1,200.00',
      requestedDate: '2023-10-24',
      status: 'pending',
      method: 'PayPal',
      accountDetails: 'void@archives.net'
    },
    {
      id: 'PAY-003',
      maker: 'Neon Athletics',
      makerId: 'M-002',
      amount: '$350.00',
      requestedDate: '2023-10-20',
      status: 'paid',
      paidDate: '2023-10-21',
      method: 'Bank Transfer',
      accountDetails: '**** 9988'
    }
  ]);

  // Mock Ledger Transactions
  const [ledger, setLedger] = useState([
    { id: 'TXN-1001', date: '2023-10-26', type: 'income', description: 'Order #8821 Commission (10%)', amount: '+$4.50' },
    { id: 'TXN-1002', date: '2023-10-26', type: 'liability', description: 'Order #8821 Maker Earnings (Held)', amount: '-$40.50' },
    { id: 'TXN-1003', date: '2023-10-25', type: 'expense', description: 'Payout to Urban Thread Co.', amount: '-$450.00' },
    { id: 'TXN-1004', date: '2023-10-24', type: 'income', description: 'Order #8822 Commission (10%)', amount: '+$12.00' },
    { id: 'TXN-1005', date: '2023-10-24', type: 'liability', description: 'Order #8822 Maker Earnings (Held)', amount: '-$108.00' },
  ]);

  const pendingCount = payouts.filter(p => p.status === 'pending').length;

  const handleApprovePayout = async (id) => {
    if(!window.confirm("Confirm you have manually transferred these funds?")) return;

    setIsProcessing(true);
    setTimeout(() => {
      setPayouts(prev => prev.map(p => 
        p.id === id ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : p
      ));
      setSelectedPayout(null);
      setIsProcessing(false);
      if(notify) notify('Payout marked as paid successfully.', 'success');
    }, 1000);
  };

  const formatCurrency = (val) => val; // Already formatted in mock data

  return (
    <div className={styles.container}>
      
      {/* Top Stats Overview */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Volume</span>
          <span className={styles.statValue}>{financialStats.totalVolume}</span>
        </div>
        <div className={`${styles.statItem} ${styles.revenue}`}>
          <span className={styles.statLabel}>Platform Revenue (Fees)</span>
          <span className={styles.statValue}>{financialStats.platformFees}</span>
        </div>
        <div className={`${styles.statItem} ${styles.pending}`}>
          <span className={styles.statLabel}>Pending Payouts</span>
          <span className={styles.statValue}>{financialStats.pendingPayouts}</span>
        </div>
        <div className={`${styles.statItem} ${styles.cash}`}>
          <span className={styles.statLabel}>Available Cash</span>
          <span className={styles.statValue}>{financialStats.availableCash}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.navTabs}>
        <button 
          className={`${styles.navBtn} ${activeView === 'payouts' ? styles.active : ''}`}
          onClick={() => setActiveView('payouts')}
        >
          Payout Requests
          {pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
        </button>
        <button 
          className={`${styles.navBtn} ${activeView === 'ledger' ? styles.active : ''}`}
          onClick={() => setActiveView('ledger')}
        >
          Financial Ledger
        </button>
      </div>

      {/* VIEW: PAYOUTS */}
      {activeView === 'payouts' && (
        <div className={styles.viewContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Maker</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map(payout => (
                  <tr key={payout.id} className={payout.status === 'pending' ? styles.rowPending : ''}>
                    <td><span className={styles.monospace}>{payout.id}</span></td>
                    <td>
                      <div className={styles.makerInfo}>
                        <span className={styles.makerName}>{payout.maker}</span>
                        <span className={styles.makerDetail}>{payout.accountDetails}</span>
                      </div>
                    </td>
                    <td><span className={styles.amount}>{payout.amount}</span></td>
                    <td>{payout.method}</td>
                    <td>{payout.requestedDate}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[payout.status]}`}>
                        {payout.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {payout.status === 'pending' ? (
                        <button className={styles.actionBtn} onClick={() => setSelectedPayout(payout)}>
                          Review & Pay
                        </button>
                      ) : (
                        <span className={styles.paidDate}>Paid: {payout.paidDate}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: LEDGER */}
      {activeView === 'ledger' && (
        <div className={styles.viewContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th className={styles.rightAlign}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map(txn => (
                  <tr key={txn.id}>
                    <td>{txn.date}</td>
                    <td>{txn.description}</td>
                    <td>
                      <span className={`${styles.typeBadge} ${styles[txn.type]}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className={`${styles.rightAlign} ${styles.amountCell} ${txn.type === 'income' ? styles.positive : styles.negative}`}>
                      {txn.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payout Detail Modal */}
      {selectedPayout && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPayout(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Process Payout: {selectedPayout.id}</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedPayout(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.summaryBox}>
                <div className={styles.summaryRow}>
                  <span>Recipient:</span>
                  <strong>{selectedPayout.maker}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Amount to Transfer:</span>
                  <strong className={styles.highlightAmount}>{selectedPayout.amount}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Destination:</span>
                  <span>{selectedPayout.method} ({selectedPayout.accountDetails})</span>
                </div>
              </div>

              <div className={styles.warningText}>
                <p><strong>Admin Action Required:</strong></p>
                <p>This system does not automatically send money. Please log in to your banking/payment provider and manually transfer <strong>{selectedPayout.amount}</strong> to the maker.</p>
                <p>Once sent, click "Confirm Payment" below to update the status.</p>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setSelectedPayout(null)}>Cancel</button>
              <button 
                className={styles.confirmBtn} 
                onClick={() => handleApprovePayout(selectedPayout.id)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'I Have Sent The Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceAndPayoutsTab;