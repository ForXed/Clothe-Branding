import React from 'react';
import styles from './Transaction.module.css';

const Transaction = ({ transactions }) => {
  const totalSales = transactions
    .filter(t => t.type === 'Sale' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = transactions
    .filter(t => t.type === 'Refund')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const handleExport = () => {
    console.log('Exporting transactions...');
    // In real app, this would generate CSV/PDF
  };

  return (
    <div className={styles.container}>
      {/* Summary Cards */}
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span className={styles.label}>Total Sales</span>
          <span className={styles.value}>${totalSales.toLocaleString()}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.label}>Total Refunds</span>
          <span className={`${styles.value} ${styles.negative}`}>${totalRefunds.toLocaleString()}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.label}>Net Revenue</span>
          <span className={styles.value}>${(totalSales - totalRefunds).toLocaleString()}</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h3>Recent Transactions</h3>
          <button className={styles.exportBtn} onClick={handleExport}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id}>
                <td className={styles.txnId}>{txn.id}</td>
                <td>{txn.date}</td>
                <td>{txn.customer}</td>
                <td>
                  <span className={`${styles.type} ${styles[txn.type.toLowerCase()]}`}>
                    {txn.type}
                  </span>
                </td>
                <td className={txn.amount < 0 ? styles.negative : styles.positive}>
                  {txn.amount < 0 ? '-' : ''}${Math.abs(txn.amount).toLocaleString()}
                </td>
                <td>
                  <span className={`${styles.status} ${styles[txn.status]}`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaction;
