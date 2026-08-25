// src/Transform/Quotes/QuotesView.tsx

import React, { useState } from 'react';
import { mockQuotes } from '../../data/mockTransform';
import type { Quote, QuoteStatus } from '../../data/mockTransform';
import styles from './QuotesView.module.css';

const QuotesView: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([...mockQuotes]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filterTabs = ['ALL', 'PENDING', 'ACCEPTED', 'DECLINED', 'SUPERSEDED'];

  const filteredQuotes = quotes.filter(q => statusFilter === 'ALL' || q.status === statusFilter);

  const getStatusColor = (status: QuoteStatus): string => {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'ACCEPTED': return '#10b981';
      case 'DECLINED': return '#ef4444';
      case 'SUPERSEDED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleAccept = (quoteId: string) => {
    setQuotes(prev => prev.map(q =>
      q.id === quoteId ? { ...q, status: 'ACCEPTED' as QuoteStatus } : q
    ));
  };

  const handleDecline = (quoteId: string) => {
    setQuotes(prev => prev.map(q =>
      q.id === quoteId ? { ...q, status: 'DECLINED' as QuoteStatus } : q
    ));
  };

  const formatCurrency = (amount: number): string => `₦${amount.toLocaleString('en-NG')}`;
  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Review Quotes</h1>
        <p className={styles.subtitle}>
          Compare quotes from makers on your briefs. Accept one to start production (funds go to escrow).
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

      {/* Quotes List */}
      {filteredQuotes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No quotes found with this status.</p>
        </div>
      ) : (
        <div className={styles.quoteList}>
          {filteredQuotes.map((quote: Quote) => (
            <div key={quote.id} className={styles.quoteCard}>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.titleRow}>
                    <h3 className={styles.quoteTitle}>{quote.makerName}</h3>
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(quote.status) }}
                    >
                      {quote.status}
                    </span>
                    <span className={styles.revisionBadge}>
                      Rev {quote.revisionNumber} / 2
                    </span>
                  </div>
                  <p className={styles.metaLine}>
                    Quote ID: {quote.id} • For Brief: {quote.briefId} • Sent {formatDate(quote.createdAt)}
                  </p>
                </div>
              </div>

              {/* Quote Details Grid */}
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <p className={styles.detailLabel}>Quoted Price</p>
                  <p className={styles.detailValue}>{formatCurrency(quote.quotedPriceNgn)}</p>
                </div>
                <div className={styles.detailItem}>
                  <p className={styles.detailLabel}>Production Time</p>
                  <p className={styles.detailValuePlain}>{quote.productionTimeDays} days</p>
                </div>
              </div>

              {/* Maker Notes */}
              {quote.notes && (
                <div className={styles.notesBox}>
                  <p className={styles.notesLabel}>Maker Notes</p>
                  <p className={styles.notesText}>{quote.notes}</p>
                </div>
              )}

              {/* Accept/Decline Actions (One Loop decision point) */}
              {quote.status === 'PENDING' && (
                <div className={styles.actionRow}>
                  <button
                    onClick={() => handleDecline(quote.id)}
                    className={styles.declineBtn}
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(quote.id)}
                    className={styles.acceptBtn}
                  >
                    Accept Quote
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotesView;