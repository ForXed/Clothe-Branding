// src/Transform/Briefs/BriefsView.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { briefService } from '../../services/briefService';
import type { Brief, BriefStatus } from '../../types/brief';
import styles from './BriefsView.module.css';

const BriefsView: React.FC = () => {
  const navigate = useNavigate();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filterTabs = ['ALL', 'DRAFT', 'SENT', 'QUOTED', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'WITHDRAWN'];

  const fetchBriefs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await briefService.getBriefs();
      setBriefs(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load briefs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefs();
  }, [fetchBriefs]);

  const filteredBriefs = briefs.filter((b) => statusFilter === 'ALL' || b.status === statusFilter);

  // expiresAt is string | null on the real Brief — guard against null (mock had it non-null).
  const getTimeRemaining = (expiresAt: string | null): { label: string; isExpired: boolean; isUrgent: boolean } => {
    if (!expiresAt) return { label: '', isExpired: false, isUrgent: false };
    const diffMs = new Date(expiresAt).getTime() - Date.now();
    if (diffMs <= 0) return { label: 'Expired', isExpired: true, isUrgent: false };
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return { label: `${diffDays} day${diffDays !== 1 ? 's' : ''} left`, isExpired: false, isUrgent: diffDays <= 2 };
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

  const formatCurrency = (amount: number): string => `₦${amount.toLocaleString('en-NG')}`;
  const formatDate = (dateString?: string | null): string =>
    dateString ? new Date(dateString).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const showCountdown = (status: BriefStatus, expiresAt: string | null): boolean =>
    (status === 'SENT' || status === 'QUOTED') && !!expiresAt;

  // A brief can be quoted-on (i.e. has a quotes screen) once it's left DRAFT/WITHDRAWN.
  const canViewQuotes = (status: BriefStatus): boolean =>
    status !== 'DRAFT' && status !== 'WITHDRAWN';

  const handleWithdraw = async (briefId: string) => {
    if (!window.confirm('Withdraw this brief? The maker will no longer be able to quote it.')) return;
    setBusyId(briefId);
    try {
      await briefService.withdrawBrief(briefId);
      await fetchBriefs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to withdraw brief.');
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}><p>Loading briefs…</p></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Manufacturing Briefs</h1>
            <p className={styles.subtitle}>Track your briefs through the loop. Briefs expire 7 days after being sent.</p>
          </div>
          {/* ✅ P3.2.13 reachability: the only way into the create form */}
          <button type="button" className={styles.newBriefBtn} onClick={() => navigate('/platform/briefs/new')}>
            + New Brief
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <span>{error}</span>
          <button type="button" onClick={fetchBriefs}>Retry</button>
        </div>
      )}

      <div className={styles.filterBar}>
        {filterTabs.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`${styles.filterBtn} ${statusFilter === status ? styles.filterBtnActive : ''}`}
          >
            {status.toLowerCase()}
          </button>
        ))}
      </div>

      {filteredBriefs.length === 0 ? (
        <div className={styles.emptyState}>
          <p>{briefs.length === 0 ? 'No briefs yet. Create your first one.' : 'No briefs found with this status.'}</p>
        </div>
      ) : (
        <div className={styles.briefList}>
          {filteredBriefs.map((brief: Brief) => {
            const timeLeft = getTimeRemaining(brief.expiresAt);
            const isBusy = busyId === brief.id;

            return (
              <div key={brief.id} className={styles.briefCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.titleRow}>
                      <h3 className={styles.briefTitle}>{brief.garmentType}</h3>
                      <span className={styles.statusBadge} style={{ backgroundColor: getStatusColor(brief.status) }}>
                        {brief.status}
                      </span>
                      {showCountdown(brief.status, brief.expiresAt) && (
                        <span className={`${styles.countdownBadge} ${timeLeft.isUrgent ? styles.countdownUrgent : styles.countdownNormal}`}>
                          ⏱ {timeLeft.label}
                        </span>
                      )}
                    </div>
                    <p className={styles.metaLine}>
                      Brief ID: {brief.id} • Sent {formatDate(brief.sentAt)} • Expires {formatDate(brief.expiresAt)}
                    </p>
                  </div>
                </div>

                <p className={styles.description}>{brief.description}</p>

                {brief.status === 'DECLINED' && brief.declineReason && (
                  <div className={styles.declineBox}>
                    <p className={styles.declineLabel}>Decline Reason</p>
                    <p className={styles.declineText}>{brief.declineReason}</p>
                  </div>
                )}

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

                {/* ✅ Card actions: quotes reachability + withdraw */}
                <div className={styles.cardActions}>
                  {canViewQuotes(brief.status) && (
                    <button
                      type="button"
                      className={styles.viewQuotesBtn}
                      onClick={() => navigate(`/platform/briefs/${brief.id}/quotes`)}
                    >
                      View Quotes
                    </button>
                  )}
                  {brief.status === 'SENT' && (
                    <button
                      type="button"
                      className={styles.withdrawBtn}
                      onClick={() => handleWithdraw(brief.id)}
                      disabled={isBusy}
                    >
                      {isBusy ? 'Withdrawing…' : 'Withdraw'}
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

export default BriefsView;