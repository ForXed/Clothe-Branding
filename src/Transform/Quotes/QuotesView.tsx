// src/Transform/Quotes/QuotesView.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quoteService } from '../../services/quoteService';
import type { Quote, QuoteStatus } from '../../types/quote';
import styles from './QuotesView.module.css';

interface NotifyFunction {
  (message: string, type: 'success' | 'error' | 'info'): void;
}

interface QuotesViewProps {
  notify?: NotifyFunction;
}

const QuotesView: React.FC<QuotesViewProps> = ({ notify }) => {
  const { briefId } = useParams<{ briefId: string }>();
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filterTabs: (QuoteStatus | 'ALL')[] = [
    'ALL',
    'PENDING',
    'ACCEPTED',
    'DECLINED',
    'SUPERSEDED',
  ];

  const fetchQuotes = useCallback(async () => {
    if (!briefId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await quoteService.getQuotesForBrief(briefId);
      setQuotes(data);
    } catch (err: any) {
      console.error('Failed to fetch quotes:', err);
      setError(
        err.response?.data?.message ||
          'Failed to load quotes. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [briefId]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const filteredQuotes = quotes.filter(
    (q) => statusFilter === 'ALL' || q.status === statusFilter,
  );

  const getStatusColor = (status: QuoteStatus): string => {
    switch (status) {
      case 'PENDING':
        return '#f59e0b';
      case 'ACCEPTED':
        return '#10b981';
      case 'DECLINED':
        return '#ef4444';
      case 'SUPERSEDED':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const handleAccept = async (quoteId: string) => {
    if (
      !window.confirm(
        'Accept this quote? This will create a production order and lock in the price.',
      )
    )
      return;

    setActionLoadingId(quoteId);

    try {
      const newOrder = await quoteService.acceptQuote(quoteId);

      setQuotes((prev) =>
        prev.map((q) =>
          q.id === quoteId ? { ...q, status: 'ACCEPTED' as QuoteStatus } : q,
        ),
      );

      if (notify) {
        notify(
          `Quote accepted. Order ${newOrder.id} created. Fund escrow to start production.`,
          'success',
        );
      }

      navigate('/platform/orders');
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to accept quote.';
      if (notify) notify(message, 'error');
      else alert(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDecline = async (quoteId: string) => {
    if (
      !window.confirm(
        'Decline this quote? The maker will be allowed ONE revised quote.',
      )
    )
      return;

    setActionLoadingId(quoteId);

    try {
      const updated = await quoteService.declineQuote(quoteId);

      if (updated && updated.id) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? updated : q)),
        );
      } else {
        await fetchQuotes();
      }

      if (notify) notify('Quote declined.', 'info');
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to decline quote.';
      if (notify) notify(message, 'error');
      else alert(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatCurrency = (amount: number): string =>
    `₦${amount.toLocaleString('en-NG')}`;

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  if (!briefId) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>Select a brief to view its quotes.</p>
          <button
            type="button"
            className={styles.acceptBtn}
            onClick={() => navigate('/platform/briefs')}
          >
            Go to Briefs
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Review Quotes</h1>
        <p className={styles.subtitle}>
          Compare quotes from makers on your briefs. Accept one to start
          production. Funds go to escrow after acceptance.
        </p>
      </div>

      {error && (
        <div
          style={{
            color: '#ef4444',
            padding: '1rem',
            background: '#fee2e2',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          {error}
          <button
            onClick={fetchQuotes}
            style={{
              marginLeft: '1rem',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div className={styles.filterBar}>
        {filterTabs.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`${styles.filterBtn} ${
              statusFilter === status ? styles.filterBtnActive : ''
            }`}
          >
            {status.toLowerCase()}
          </button>
        ))}
      </div>

      {filteredQuotes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            {quotes.length === 0
              ? 'No quotes received yet for this brief.'
              : 'No quotes found with this status.'}
          </p>
        </div>
      ) : (
        <div className={styles.quoteList}>
          {filteredQuotes.map((quote: Quote) => {
            const isActionLoading = actionLoadingId === quote.id;

            return (
              <div key={quote.id} className={styles.quoteCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.titleRow}>
                      <h3 className={styles.quoteTitle}>Maker Quote</h3>
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
                      Quote ID: {quote.id} • Brief: {quote.briefId} • Sent{' '}
                      {formatDate(quote.createdAt)}
                    </p>
                  </div>
                </div>

                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Quoted Price</p>
                    <p className={styles.detailValue}>
                      {formatCurrency(quote.priceNgn)}
                    </p>
                  </div>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Maker Receives</p>
                    <p className={styles.detailValue}>
                      {formatCurrency(quote.estimatedMakerPayoutNgn)}
                    </p>
                  </div>
                  <div className={styles.detailItem}>
                    <p className={styles.detailLabel}>Production Time</p>
                    <p className={styles.detailValuePlain}>
                      {quote.timelineDays} days
                    </p>
                  </div>
                </div>

                {quote.terms && (
                  <div className={styles.notesBox}>
                    <p className={styles.notesLabel}>Maker Terms</p>
                    <p className={styles.notesText}>{quote.terms}</p>
                  </div>
                )}

                {quote.status === 'SUPERSEDED' && (
                  <div
                    className={styles.notesBox}
                    style={{ background: 'rgba(107, 114, 128, 0.1)' }}
                  >
                    <p
                      className={styles.notesText}
                      style={{ color: '#6b7280' }}
                    >
                      This quote was superseded by a revised version from the
                      same maker.
                    </p>
                  </div>
                )}

                {quote.status === 'PENDING' && (
                  <div className={styles.actionRow}>
                    <button
                      onClick={() => handleDecline(quote.id)}
                      className={styles.declineBtn}
                      disabled={isActionLoading}
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(quote.id)}
                      className={styles.acceptBtn}
                      disabled={isActionLoading}
                    >
                      {isActionLoading
                        ? 'Processing...'
                        : 'Accept Quote & Create Order'}
                    </button>
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

export default QuotesView;