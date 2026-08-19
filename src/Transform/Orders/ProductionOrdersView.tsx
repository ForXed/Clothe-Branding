// src/Transform/Orders/ProductionOrdersView.tsx

import React, { useState } from 'react';
import { mockOrders } from '../../data/mockTransform';
import type { ProductionOrder, OrderStatus, EscrowStatus } from '../../data/mockTransform';
import styles from './ProductionOrdersView.module.css';

const ProductionOrdersView: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([...mockOrders]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filterTabs = ['ALL', 'IN_ESCROW', 'IN_PRODUCTION', 'DELIVERED', 'COMPLETED', 'DISPUTED'];

  const filteredOrders = orders.filter(o => statusFilter === 'ALL' || o.status === statusFilter);

  const getOrderStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'AWAITING_PAYMENT': return '#f59e0b';
      case 'IN_ESCROW': return '#3b82f6';
      case 'IN_PRODUCTION': return '#8b5cf6';
      case 'DELIVERED': return '#14b8a6';
      case 'COMPLETED': return '#10b981';
      case 'CANCELLED': return '#6b7280';
      case 'DISPUTED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEscrowStatusColor = (status: EscrowStatus): string => {
    switch (status) {
      case 'AWAITING': return '#6b7280';
      case 'HELD': return '#3b82f6';
      case 'RELEASED': return '#10b981';
      case 'REFUNDED': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getAutoReleaseDays = (autoReleaseAt?: string): number | null => {
    if (!autoReleaseAt) return null;
    const diffMs = new Date(autoReleaseAt).getTime() - new Date().getTime();
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const handleConfirmDelivery = (orderId: string) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
            ...o,
            status: 'COMPLETED' as OrderStatus,
            escrow: { ...o.escrow, status: 'RELEASED' as EscrowStatus, releasedAt: new Date().toISOString() }
          }
        : o
    ));
  };

  const handleDispute = (orderId: string) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'DISPUTED' as OrderStatus } : o
    ));
  };

  const formatCurrency = (amount: number): string => `₦${amount.toLocaleString('en-NG')}`;
  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Production Orders</h1>
        <p className={styles.subtitle}>
          Your money is held in escrow and only released when you confirm delivery.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        {filterTabs.map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`${styles.filterBtn} ${statusFilter === status ? styles.filterBtnActive : ''}`}
          >
            {status.toLowerCase().replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No orders found with this status.</p>
        </div>
      ) : (
        <div className={styles.orderList}>
          {filteredOrders.map((order: ProductionOrder) => {
            const autoReleaseDays = getAutoReleaseDays(order.escrow.autoReleaseAt);

            return (
              <div key={order.id} className={styles.orderCard}>
                {/* Order Header */}
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.titleRow}>
                      <h3 className={styles.orderTitle}>{order.garmentType}</h3>
                      <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: getOrderStatusColor(order.status) }}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className={styles.metaLine}>
                      Order {order.id} • {order.makerName} • {order.quantity} units • Est. delivery {formatDate(order.expectedDelivery)}
                    </p>
                  </div>
                </div>

                {/* 🔒 ESCROW SECTION */}
                <div className={styles.escrowSection}>
                  <div className={styles.escrowHeader}>
                    <div className={styles.escrowTitleWrap}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <h4 className={styles.escrowTitle}>Escrow Protection</h4>
                    </div>
                    <span
                      className={styles.escrowStatusBadge}
                      style={{ backgroundColor: getEscrowStatusColor(order.escrow.status) }}
                    >
                      {order.escrow.status}
                    </span>
                  </div>

                  {/* Fee Transparency Breakdown */}
                  <div className={styles.feeBreakdown}>
                    <div className={styles.feeRow}>
                      <span className={styles.feeLabel}>Total Paid</span>
                      <span className={styles.feeValue}>{formatCurrency(order.escrow.amountNgn)}</span>
                    </div>
                    <div className={styles.feeRow}>
                      <span className={styles.feeLabel}>Brutige Platform Fee</span>
                      <span className={styles.feeValueNegative}>−{formatCurrency(order.escrow.platformFeeNgn)}</span>
                    </div>
                    <div className={styles.feeTotalRow}>
                      <span className={styles.feeTotalLabel}>Maker Receives</span>
                      <span className={styles.feeTotalValue}>{formatCurrency(order.escrow.makerPayoutNgn)}</span>
                    </div>
                  </div>

                  {/* Auto-release countdown */}
                  {order.escrow.status === 'HELD' && autoReleaseDays !== null && (
                    <p className={styles.autoReleaseInfo}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {autoReleaseDays > 0
                        ? `Auto-releases in ${autoReleaseDays} day${autoReleaseDays !== 1 ? 's' : ''} (${formatDate(order.escrow.autoReleaseAt!)})`
                        : 'Auto-release window reached'}
                      {' '}— confirm delivery below, or funds release automatically.
                    </p>
                  )}
                  {order.escrow.status === 'RELEASED' && order.escrow.releasedAt && (
                    <p className={styles.releasedInfo}>
                      ✓ Funds released to maker on {formatDate(order.escrow.releasedAt)}
                    </p>
                  )}
                </div>

                {/* Buyer Actions */}
                {order.status === 'DELIVERED' && (
                  <div className={styles.actionRow}>
                    <button
                      onClick={() => handleDispute(order.id)}
                      className={styles.disputeBtn}
                    >
                      Dispute Order
                    </button>
                    <button
                      onClick={() => handleConfirmDelivery(order.id)}
                      className={styles.confirmBtn}
                    >
                      Confirm Delivery & Release Funds
                    </button>
                  </div>
                )}

                {/* Dispute Warning */}
                {order.status === 'DISPUTED' && (
                  <div className={styles.disputeBox}>
                    <p className={styles.disputeText}>
                      ⚠️ This order is under dispute. Escrow funds are held pending resolution by Brutige mediation.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductionOrdersView;