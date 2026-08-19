// src/Transform/Briefs/BriefsView.tsx

import React, { useState } from 'react';
import { mockBriefs } from '../../data/mockTransform';
import type { Brief, BriefStatus } from '../../data/mockTransform';
import styles from './BriefsView.module.css';

const BriefsView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filterTabs = ['ALL', 'SENT', 'QUOTED', 'ACCEPTED', 'DECLINED', 'EXPIRED'];

  const filteredBriefs = mockBriefs.filter(brief => {
    return statusFilter === 'ALL' || brief.status === statusFilter;
  });

  const getTimeRemaining = (expiresAt: string): { label: string; isExpired: boolean; isUrgent: boolean } => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diffMs = expiry - now;

    if (diffMs <= 0) {
      return { label: 'Expired', isExpired: true, isUrgent: false };
    }

    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      label: `${diffDays} day${diffDays !== 1 ? 's' : ''} left`,
      isExpired: false,
      isUrgent: diffDays <= 2
    };
  };

  const getStatusColor = (status: BriefStatus): string => {
    switch (status) {
      case 'DRAFT': return '#6b7280';
      case 'SENT': return '#3b82f6';
      case 'QUOTED': return '#f59e0b';
      case 'ACCEPTED': return '#10b981';
      case 'DECLINED': return '#ef4444';
      case 'WITHDRAWN': return '#9ca3af';
      case 'EXPIRED': return '#111827';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const showCountdown = (status: BriefStatus): boolean => {
    return status === 'SENT' || status === 'QUOTED';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manufacturing Briefs</h1>
        <p className={styles.subtitle}>
          Track your briefs through the loop. Briefs expire 7 days after being sent.
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
            {status.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Briefs List */}
      {filteredBriefs.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No briefs found with this status.</p>
        </div>
      ) : (
        <div className={styles.briefList}>
          {filteredBriefs.map((brief: Brief) => {
            const timeLeft = getTimeRemaining(brief.expiresAt);

            return (
              <div key={brief.id} className={styles.briefCard}>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.titleRow}>
                      <h3 className={styles.briefTitle}>{brief.garmentType}</h3>
                      <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(brief.status) }}
                      >
                        {brief.status}
                      </span>
                      {showCountdown(brief.status) && (
                        <span className={`${styles.countdownBadge} ${timeLeft.isUrgent ? styles.countdownUrgent : styles.countdownNormal}`}>
                          ⏱ {timeLeft.label}
                        </span>
                      )}
                    </div>
                    <p className={styles.metaLine}>
                      Brief ID: {brief.id} • Sent {formatDate(brief.createdAt)} • Expires {formatDate(brief.expiresAt)}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className={styles.description}>{brief.description}</p>

                {/* Decline Reason Box */}
                {brief.status === 'DECLINED' && brief.declineReason && (
                  <div className={styles.declineBox}>
                    <p className={styles.declineLabel}>Decline Reason</p>
                    <p className={styles.declineText}>{brief.declineReason}</p>
                  </div>
                )}

                {/* Key Details Grid */}
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Quantity</p>
                    <p className={styles.detailValue}>{brief.quantity} units</p>
                  </div>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Budget</p>
                    <p className={styles.detailValue}>{formatCurrency(brief.budgetNgn)}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Deadline</p>
                    <p className={styles.detailValue}>{formatDate(brief.deadline)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BriefsView;