// src/Transform/Briefs/BriefForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { briefService } from '../../services/briefService';
import type { BriefInput } from '../../types/brief';
import styles from './BriefForm.module.css';

interface NotifyFunction {
  (message: string, type: 'success' | 'error' | 'info'): void;
}

interface MakerOption {
  id: string;
  displayName: string;
}

interface BriefFormProps {
  notify?: NotifyFunction;
  /** Pre-select a maker when arriving from a discovery/profile card ("Brief this maker") */
  initialMakerId?: string;
}

interface FieldErrors {
  makerId?: string;
  garmentType?: string;
  description?: string;
  quantity?: string;
  budgetNgn?: string;
  deadline?: string;
}

const BriefForm: React.FC<BriefFormProps> = ({ notify, initialMakerId }) => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [makers, setMakers] = useState<MakerOption[]>([]);
  const [makersLoading, setMakersLoading] = useState(true);

  const [form, setForm] = useState<BriefInput>({
    makerId: initialMakerId || '',
    garmentType: '',
    description: '',
    quantity: 0,
    budgetNgn: 0,
    deadline: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  // Load makers for the directed-brief picker.
  // ⚠️ CONFIRM: display field name on the maker object (name vs displayName vs businessName)
  // ⚠️ CONFIRM: should this filter to verified makers only? (product call — likely yes)
  useEffect(() => {
    let cancelled = false;
    apiClient
      .get('/makers')
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : (res.data.makers ?? []);
        setMakers(
          list.map((m: any) => ({
            id: m.id,
            displayName:
              m.name ?? m.displayName ?? m.businessName ?? m.fullName ?? `Maker ${String(m.id).slice(0, 8)}`,
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setBanner('Could not load makers. You can still save a draft once they load.');
      })
      .finally(() => !cancelled && setMakersLoading(false));
    return () => { cancelled = true; };
  }, []);

  const setField = (key: keyof BriefInput, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!form.makerId) e.makerId = 'Choose the maker this brief is directed to.';
    if (!form.garmentType.trim()) e.garmentType = 'Garment type is required.';
    if (!form.description.trim() || form.description.trim().length < 10)
      e.description = 'Add a description (min 10 characters).';
    if (!form.quantity || form.quantity < 1) e.quantity = 'Quantity must be at least 1.';
    if (!form.budgetNgn || form.budgetNgn < 1) e.budgetNgn = 'Set a budget in Naira.';
    if (!form.deadline) e.deadline = 'Pick a production deadline.';
    else if (new Date(form.deadline) <= new Date()) e.deadline = 'Deadline must be in the future.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...picked].slice(0, 8));
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  // sendNow=true => create DRAFT, upload images, then SEND. false => save DRAFT only.
  const submit = async (sendNow: boolean) => {
    setBanner(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const draft = await briefService.createBrief(form);

      // One file per call (endpoint returns a single image object). Best-effort.
      if (images.length > 0) {
        for (const file of images) {
          try {
            await briefService.uploadImage(draft.id, file);
          } catch {
            console.warn(`Image upload failed: ${file.name}; brief still created.`);
          }
        }
      }

      if (sendNow) {
        await briefService.sendBrief(draft.id);
        if (notify) notify('Brief sent to maker. They have 7 days to quote.', 'success');
      } else {
        if (notify) notify('Draft saved.', 'success');
      }

      navigate('/platform/briefs');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create brief. Please try again.';
      setBanner(msg);
      if (notify) notify(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>New Brief</h1>
        <p className={styles.subtitle}>
          Briefs are directed to one maker. Pick who receives it, describe the production run, then send.
        </p>
      </div>

      {banner && <div className={styles.errorBanner}>{banner}</div>}

      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); submit(true); }} noValidate>
        <div className={styles.inputGroup}>
          <label htmlFor="makerId">Directed To</label>
          <select
            id="makerId"
            value={form.makerId}
            onChange={(e) => setField('makerId', e.target.value)}
            disabled={isSubmitting || makersLoading}
          >
            <option value="">{makersLoading ? 'Loading makers…' : 'Select a maker…'}</option>
            {makers.map((m) => (
              <option key={m.id} value={m.id}>{m.displayName}</option>
            ))}
          </select>
          {errors.makerId && <span className={styles.errorText}>{errors.makerId}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="garmentType">Garment Type</label>
          <input
            id="garmentType"
            type="text"
            value={form.garmentType}
            onChange={(e) => setField('garmentType', e.target.value)}
            placeholder="e.g. 450GSM Heavyweight Hoodie"
            disabled={isSubmitting}
          />
          {errors.garmentType && <span className={styles.errorText}>{errors.garmentType}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description">Description / Spec</label>
          <textarea
            id="description"
            rows={5}
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Fabric, fit, printing method, quality bar, anything the maker must know..."
            disabled={isSubmitting}
          />
          {errors.description && <span className={styles.errorText}>{errors.description}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="quantity">Quantity (units)</label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={form.quantity || ''}
              onChange={(e) => setField('quantity', Number(e.target.value))}
              placeholder="700"
              disabled={isSubmitting}
            />
            {errors.quantity && <span className={styles.errorText}>{errors.quantity}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="budget">Budget (₦ total)</label>
            <input
              id="budget"
              type="number"
              min={1}
              step={1000}
              value={form.budgetNgn || ''}
              onChange={(e) => setField('budgetNgn', Number(e.target.value))}
              placeholder="4500000"
              disabled={isSubmitting}
            />
            {errors.budgetNgn && <span className={styles.errorText}>{errors.budgetNgn}</span>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="deadline">Production Deadline</label>
          <input
            id="deadline"
            type="date"
            value={form.deadline}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setField('deadline', e.target.value)}
            disabled={isSubmitting}
          />
          {errors.deadline && <span className={styles.errorText}>{errors.deadline}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label>Reference Images (optional)</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={isSubmitting}
            className={styles.fileInput}
          />
          {images.length > 0 && (
            <div className={styles.imageList}>
              {images.map((f, i) => (
                <div key={`${f.name}-${i}`} className={styles.imageItem}>
                  <span className={styles.imageName}>{f.name}</span>
                  <button type="button" className={styles.removeImg} onClick={() => removeImage(i)} disabled={isSubmitting}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <span className={styles.helper}>JPG/PNG, up to 8. Uploaded one-by-one after the draft is created.</span>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btnGhost} onClick={() => navigate(-1)} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="button" className={styles.btnSecondary} onClick={() => submit(false)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Draft'}
          </button>
          <button type="submit" className={styles.btnPrimary} disabled={isSubmitting || makersLoading}>
            {isSubmitting ? 'Sending…' : 'Create & Send →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BriefForm;