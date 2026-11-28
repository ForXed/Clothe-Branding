// src/Transform/Quotes/QuoteSubmitForm.tsx
import React, { useState } from 'react';
import { quoteService } from '../../services/quoteService';
import type { QuoteInput } from '../../types/quote';
import styles from './QuoteSubmitForm.module.css';

interface NotifyFunction {
  (message: string, type: 'success' | 'error' | 'info'): void;
}

interface QuoteSubmitFormProps {
  briefId: string;
  lastRevisionNumber?: number;
  notify?: NotifyFunction;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

const MAX_REVISIONS = 2;

const QuoteSubmitForm: React.FC<QuoteSubmitFormProps> = ({
  briefId,
  lastRevisionNumber = 0,
  notify,
  onSubmitted,
  onCancel,
}) => {
  const nextRevision = lastRevisionNumber + 1;
  const atCap = nextRevision > MAX_REVISIONS;

  const [form, setForm] = useState<QuoteInput>({ priceNgn: 0, timelineDays: 0, terms: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (key: keyof QuoteInput, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    if (!form.priceNgn || form.priceNgn < 1) { setError('Enter a quoted price in Naira.'); return false; }
    if (!form.timelineDays || form.timelineDays < 1) { setError('Enter a production timeline in days.'); return false; }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (atCap || !validate()) return;

    setIsSubmitting(true);
    try {
      await quoteService.submitQuote(briefId, {
        priceNgn: form.priceNgn,
        timelineDays: form.timelineDays,
        terms: form.terms?.trim() || undefined, // ✅ fixed: optional chaining
      });
      if (notify) notify(`Quote submitted (revision ${nextRevision}/${MAX_REVISIONS}).`, 'success');
      onSubmitted?.();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit quote.';
      setError(msg);
      if (notify) notify(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (atCap) {
    return (
      <div className={styles.container}>
        <div className={styles.capBox}>
          <h3 className={styles.capTitle}>Revision Limit Reached</h3>
          <p className={styles.capText}>
            This brief already has {MAX_REVISIONS} quote revisions. No further quotes can be submitted.
          </p>
          {onCancel && (
            <button type="button" className={styles.btnGhost} onClick={onCancel}>Close</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Submit Quote</h2>
        <span className={styles.revBadge}>Revision {nextRevision} / {MAX_REVISIONS}</span>
      </div>
      <p className={styles.subtitle}>
        Bid for this brief. The brand sees your price and timeline; if declined you get one revision.
      </p>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.inputGroup}>
          <label htmlFor="price">Quoted Price (₦ total)</label>
          <input
            id="price"
            type="number"
            min={1}
            step={1000}
            value={form.priceNgn || ''}
            onChange={(e) => setField('priceNgn', Number(e.target.value))}
            placeholder="3500000"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="timeline">Production Timeline (days)</label>
          <input
            id="timeline"
            type="number"
            min={1}
            value={form.timelineDays || ''}
            onChange={(e) => setField('timelineDays', Number(e.target.value))}
            placeholder="21"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="terms">Terms / Notes (optional)</label>
          <textarea
            id="terms"
            rows={4}
            value={form.terms ?? ''} // ✅ fixed: nullish coalesce
            onChange={(e) => setField('terms', e.target.value)}
            placeholder="MOQ, batch splits, fabric sourcing, payment milestones…"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.actions}>
          {onCancel && (
            <button type="button" className={styles.btnGhost} onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
          )}
          <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Send Quote →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuoteSubmitForm;