// src/Transform/MakerBriefs/IncomingBriefs.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { briefService } from '../../services/briefService';
import { quoteService } from '../../services/quoteService';
import QuoteSubmitForm from '../Quotes/QuoteSubmitForm';
import type { Brief, BriefStatus } from '../../types/brief';
import styles from './IncomingBriefs.module.css';

interface NotifyFunction {
  (message: string, type: 'success' | 'error' | 'info'): void;
}

interface IncomingBriefsProps {
  notify?: NotifyFunction;
}

const STATUS_COLOR: Record<BriefStatus, string> = {
  DRAFT: '#6b7280',
  SENT: '#3b82f6',
  QUOTED: '#8b5cf6',
  ACCEPTED: '#10b981',
  DECLINED: '#ef4444',
  WITHDRAWN: '#6b7280',
  EXPIRED: '#6b7280',
};

const IncomingBriefs: React.FC<IncomingBriefsProps> = ({ notify }) => {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Quote modal state
  const [quoteBriefId, setQuoteBriefId] = useState<string | null>(null);
  const [quoteLastRevision, setQuoteLastRevision] = useState(0);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const fetchBriefs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await briefService.getBriefs();
      setBriefs(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load incoming briefs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefs();
  }, [fetchBriefs]);

  // Open the quote form, computing the next revision from existing quotes.
  const openQuoteForm = async (briefId: string) => {
    setQuoteLoading(true);
    setQuoteBriefId(briefId);
    try {
      const existing = await quoteService.getQuotesForBrief(briefId);
      // Highest revisionNumber among DECLINED/SUPERSEDED = what we're revising from.
      const maxRev = existing.reduce((max, q) => Math.max(max, q.revisionNumber), 0);
      setQuoteLastRevision(maxRev);
    } catch {
      setQuoteLastRevision(0); // first quote
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleDecline = async (brief: Brief) => {
    const reason = window.prompt(
      `Decline brief "${brief.garmentType}"?\nA reason is required and will be shown to the brand.`,
    );
    if (!reason || !reason.trim()) return;

    setBusyId(brief.id);
    try {
      await briefService.declineBrief(brief.id, reason.trim());
      if (notify) notify('Brief declined.', 'info');
      await fetchBriefs();
    } catch (err: any) {
      if (notify)
        notify(err.response?.data?.message || 'Failed to decline brief.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const formatCurrency = (n: number) => `₦${n.toLocaleString('en-NG')}`;
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });

  // Only briefs a maker can act on or track are "incoming". DRAFT never reaches a maker.
  const incoming = briefs.filter((b) => b.status !== 'DRAFT');

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>Loading incoming briefs…</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Incoming Briefs</h1>
        <p className={styles.subtitle}>
          Production requests sent to you by brands. Quote the ones you can fulfil, or decline with a reason.
        </p>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <span>{error}</span>
          <button type="button" onClick={fetchBriefs}>Retry</button>
        </div>
      )}

      {incoming.length === 0 ? (
        <div className={styles.emptyState}>
          No incoming briefs yet. When a brand sends you a brief, it appears here.
        </div>
      ) : (
        <div className={styles.briefList}>
          {incoming.map((brief) => {
            const isBusy = busyId === brief.id;
            const actionable = brief.status === 'SENT';

            return (
              <div key={brief.id} className={styles.briefCard}>
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.titleRow}>
                      <h3 className={styles.briefTitle}>{brief.garmentType}</h3>
                      <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: STATUS_COLOR[brief.status] }}
                      >
                        {brief.status}
                      </span>
                    </div>
                    <p className={styles.meta}>
                      {brief.quantity} units • Budget {formatCurrency(brief.budgetNgn)} •
                      Deadline {formatDate(brief.deadline)}
                    </p>
                  </div>
                  {brief.expiresAt && brief.status === 'SENT' && (
                    <span className={styles.expires}>
                      Quote by {formatDate(brief.expiresAt)}
                    </span>
                  )}
                </div>

                <p className={styles.description}>{brief.description}</p>

                {brief.images?.length > 0 && (
                  <div className={styles.imageRow}>
                    {brief.images.slice(0, 4).map((img) => (
                      <img key={img.id} src={img.fileUrl} alt="reference" className={styles.thumb} />
                    ))}
                    {brief.images.length > 4 && (
                      <span className={styles.moreImages}>+{brief.images.length - 4}</span>
                    )}
                  </div>
                )}

                {brief.status === 'DECLINED' && brief.declineReason && (
                  <div className={styles.declinedBox}>
                    <strong>You declined this brief.</strong> Reason sent to brand: “{brief.declineReason}”
                  </div>
                )}

                {brief.status === 'QUOTED' && (
                  <div className={styles.waitingBox}>
                    ✓ Quote submitted. Awaiting the brand's decision.
                  </div>
                )}

                {brief.status === 'ACCEPTED' && (
                  <div className={styles.acceptedBox}>
                    ✓ Your quote was accepted. A production order has been created.
                  </div>
                )}

                {actionable && (
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.declineBtn}
                      onClick={() => handleDecline(brief)}
                      disabled={isBusy}
                    >
                      {isBusy ? 'Working…' : 'Decline'}
                    </button>
                    <button
                      type="button"
                      className={styles.quoteBtn}
                      onClick={() => openQuoteForm(brief.id)}
                      disabled={isBusy}
                    >
                      Quote This Brief
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quote modal */}
      {quoteBriefId && (
        <div className={styles.modalOverlay} onClick={() => setQuoteBriefId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {quoteLoading ? (
              <div className={styles.emptyState}>Loading quote history…</div>
            ) : (
              <QuoteSubmitForm
                briefId={quoteBriefId}
                lastRevisionNumber={quoteLastRevision}
                notify={notify}
                onSubmitted={() => {
                  setQuoteBriefId(null);
                  fetchBriefs();
                }}
                onCancel={() => setQuoteBriefId(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingBriefs;