import React, { useEffect, useRef, useState } from 'react';
import { makerService } from '../../services/makerService';
import type { MakerProfile } from '../../types/maker';

interface StudioSettingsProps {
  isPro?: boolean;
  onUpgradeClick?: () => void;
  notify?: (message: string, type: 'success' | 'error') => void;
}

interface FormState {
  brandName: string;
  bio: string;
  location: string;
  leadTimeDays: string;
  minBatch: string;
  maxBatch: string;
  specializations: string;
}

const EMPTY: FormState = {
  brandName: '',
  bio: '',
  location: '',
  leadTimeDays: '',
  minBatch: '',
  maxBatch: '',
  specializations: '',
};

const toForm = (profile: MakerProfile): FormState => ({
  brandName: profile.brandName ?? '',
  bio: profile.bio ?? '',
  location: profile.location ?? '',
  leadTimeDays: profile.leadTimeDays ? String(profile.leadTimeDays) : '',
  minBatch: profile.minBatch ? String(profile.minBatch) : '',
  maxBatch: profile.maxBatch ? String(profile.maxBatch) : '',
  specializations: (profile.specializations ?? []).join(', '),
});

const numberOrUndefined = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * Studio settings for v1: the maker profile the API can actually store.
 *
 * GET/PUT /api/v1/makers/me accepts brandName, bio, location, leadTimeDays, minBatch,
 * maxBatch and specializations. Currency, shipping, tax, policies, notification and 2FA
 * settings do not exist on the server, so they are listed as not built instead of being
 * held in component state and "saved" with a timeout.
 */
const StudioSettings: React.FC<StudioSettingsProps> = ({ notify }) => {
  const [profile, setProfile] = useState<MakerProfile | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = () => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    makerService
      .getMyProfile()
      .then((data) => {
        if (id !== requestId.current) return;
        setProfile(data);
        setForm(toForm(data));
      })
      .catch((e: unknown) => {
        if (id !== requestId.current) return;
        setError(e instanceof Error ? e.message : 'Could not load your maker profile.');
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  };

  useEffect(load, []);

  const update = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.brandName.trim()) {
      notify?.('A brand name is required', 'error');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = await makerService.updateMyProfile({
        brandName: form.brandName.trim(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        leadTimeDays: numberOrUndefined(form.leadTimeDays),
        minBatch: numberOrUndefined(form.minBatch),
        maxBatch: numberOrUndefined(form.maxBatch),
        specializations: form.specializations
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
      });
      setProfile(saved);
      setForm(toForm(saved));
      notify?.('Profile saved', 'success');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Could not save your profile.';
      setError(message);
      notify?.(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.skeleton} aria-hidden="true" />
        <div style={styles.skeleton} aria-hidden="true" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.page}>
        <div style={styles.notice}>
          <p style={styles.noticeLead}>You do not have a maker profile yet.</p>
          <p style={styles.noticeLine}>
            Apply from the studio first; an admin reviews the application before buyers can find
            you.
          </p>
          {error && <p style={styles.noticeLine}>{error}</p>}
        </div>
      </div>
    );
  }

  const status = profile.verificationStatus;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Studio settings</h1>
        <p style={styles.subtitle}>
          These are the fields the API stores for a maker. Everything else — branding colours,
          shipping, tax, policies, notification preferences, two-factor — is listed as not built
          rather than pretending to save.
        </p>
        {status && (
          <span style={status === 'VERIFIED' ? styles.badgeOk : status === 'PENDING' ? styles.badgeWarn : styles.badgeBad}>
            {status === 'VERIFIED' ? 'Verified maker' : status === 'PENDING' ? 'Pending review' : 'Application rejected'}
          </span>
        )}
        {status === 'REJECTED' && profile.rejectionNote && (
          <p style={styles.rejection}>
            Reviewer note: {profile.rejectionNote}
          </p>
        )}
      </header>

      <form onSubmit={handleSave} style={styles.card}>
        <label style={styles.label}>
          Brand name
          <input style={styles.input} value={form.brandName} onChange={update('brandName')} />
        </label>
        <label style={styles.label}>
          About your work
          <textarea
            style={{ ...styles.input, minHeight: '96px', resize: 'vertical' }}
            value={form.bio}
            onChange={update('bio')}
          />
        </label>
        <div style={styles.grid}>
          <label style={styles.label}>
            Location
            <input style={styles.input} value={form.location} onChange={update('location')} placeholder="Lagos" />
          </label>
          <label style={styles.label}>
            Lead time (days)
            <input style={styles.input} value={form.leadTimeDays} onChange={update('leadTimeDays')} inputMode="numeric" />
          </label>
          <label style={styles.label}>
            Minimum batch
            <input style={styles.input} value={form.minBatch} onChange={update('minBatch')} inputMode="numeric" />
          </label>
          <label style={styles.label}>
            Maximum batch
            <input style={styles.input} value={form.maxBatch} onChange={update('maxBatch')} inputMode="numeric" />
          </label>
        </div>
        <label style={styles.label}>
          Crafts (comma separated)
          <input
            style={styles.input}
            value={form.specializations}
            onChange={update('specializations')}
            placeholder="agbada, kaftan"
          />
        </label>
        <p style={styles.hint}>
          Crafts are what buyers search on, so keep them to garment names people would type.
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
          <button type="button" style={styles.resetBtn} onClick={() => setForm(toForm(profile))} disabled={saving}>
            Reset
          </button>
        </div>
      </form>

      <div style={styles.notice}>
        <p style={styles.noticeLead}>Not built in v1</p>
        <ul style={styles.list}>
          <li>Brand colours and storefront theme — the API stores no theme fields.</li>
          <li>Currency, timezone and tax — every amount is NGN and computed server-side.</li>
          <li>Shipping rates and fulfilment rules — v1 has no fulfilment model.</li>
          <li>Return policy, shipping policy and terms — no storage for policy text.</li>
          <li>Notification preferences — orders and briefs arrive by transactional email only.</li>
          <li>Two-factor authentication — not implemented on the backend.</li>
        </ul>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  header: { marginBottom: '18px' },
  title: { fontSize: '24px', fontWeight: 700, margin: '0 0 6px', color: 'var(--brut-text, #0f172a)' },
  subtitle: { margin: '0 0 10px', color: '#64748b', fontSize: '13px', lineHeight: 1.55, maxWidth: '640px' },
  badgeOk: { display: 'inline-block', fontSize: '12px', padding: '3px 10px', borderRadius: '999px', background: '#dcfce7', color: '#15803d', fontWeight: 600 },
  badgeWarn: { display: 'inline-block', fontSize: '12px', padding: '3px 10px', borderRadius: '999px', background: '#fef3c7', color: '#b45309', fontWeight: 600 },
  badgeBad: { display: 'inline-block', fontSize: '12px', padding: '3px 10px', borderRadius: '999px', background: '#fee2e2', color: '#b91c1c', fontWeight: 600 },
  rejection: { margin: '10px 0 0', fontSize: '13px', color: '#b91c1c' },
  card: {
    border: '1.5px solid #e2e8f0',
    borderRadius: '14px',
    padding: '20px',
    background: 'var(--brut-card, #fff)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#475569', fontWeight: 500 },
  input: {
    padding: '10px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    color: 'var(--brut-text, #0f172a)',
    background: '#fff',
    fontFamily: 'inherit',
  },
  hint: { margin: 0, fontSize: '12px', color: '#94a3b8' },
  error: { margin: 0, fontSize: '13px', color: '#b91c1c' },
  actions: { display: 'flex', gap: '10px' },
  saveBtn: { padding: '11px 20px', border: 'none', borderRadius: '10px', background: '#6c47ff', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' },
  resetBtn: { padding: '11px 18px', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', color: '#475569', fontWeight: 600, fontSize: '14px', cursor: 'pointer' },
  notice: { marginTop: '18px', border: '1.5px dashed #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fafafa' },
  noticeLead: { margin: '0 0 8px', fontWeight: 600, color: '#b45309', fontSize: '14px' },
  noticeLine: { margin: '0 0 6px', color: '#475569', fontSize: '13px', lineHeight: 1.55 },
  list: { margin: 0, paddingLeft: '18px', color: '#475569', fontSize: '13px', lineHeight: 1.7 },
  skeleton: { height: '120px', borderRadius: '14px', background: '#f1f5f9', marginBottom: '12px' },
};

export default StudioSettings;
