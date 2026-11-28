import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { makerService } from '../../services/makerService';
import type { MakerSummary } from '../../types/maker';
import type { Page } from '../../types/common';
import styles from './MakerSearchView.module.css';

/**
 * v1 search: the API has no free-text endpoint, so this matches the query against the
 * one field the server can filter on — a maker's craft (garmentType) — and/or the batch
 * size a buyer needs. Results are real Verified makers from GET /api/v1/makers.
 */
const MakerSearchView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [minBatch, setMinBatch] = useState(searchParams.get('minBatch') ?? '');
  const [makers, setMakers] = useState<MakerSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const requestId = useRef(0);

  const activeQuery = (searchParams.get('q') ?? '').trim();
  const activeMinBatch = searchParams.get('minBatch') ?? '';

  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);

    makerService
      .listMakers({
        garmentType: activeQuery || undefined,
        minBatch: activeMinBatch ? Number(activeMinBatch) : undefined,
        page: 0,
        size: 24,
      })
      .then((page: Page<MakerSummary>) => {
        if (id !== requestId.current) return;
        setMakers(page.content);
        setSearched(true);
      })
      .catch((e: unknown) => {
        if (id !== requestId.current) return;
        setError(e instanceof Error ? e.message : 'Could not load makers.');
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, [activeQuery, activeMinBatch]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    if (minBatch.trim()) next.set('minBatch', minBatch.trim());
    setSearchParams(next, { replace: true });
  };

  const heading = useMemo(() => {
    if (!searched) return 'Search makers';
    if (activeQuery && activeMinBatch) return `Makers for “${activeQuery}” taking ${activeMinBatch}+ pieces`;
    if (activeQuery) return `Makers for “${activeQuery}”`;
    if (activeMinBatch) return `Makers taking ${activeMinBatch}+ pieces`;
    return 'All verified makers';
  }, [searched, activeQuery, activeMinBatch]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Find a maker</h1>
        <p className={styles.subtitle}>
          Search by craft — agbada, kaftan, aso-oke, senator and so on — and by the smallest run
          you need. Only verified makers appear here.
        </p>
      </header>

      <form className={styles.searchBar} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Craft, e.g. agbada"
          aria-label="Search makers by craft"
        />
        <input
          className={`${styles.input} ${styles.batch}`}
          value={minBatch}
          onChange={(event) => setMinBatch(event.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Min pieces"
          inputMode="numeric"
          aria-label="Minimum batch size"
        />
        <button type="submit" className={styles.submit}>
          Search
        </button>
      </form>

      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>{heading}</h2>
        {!loading && !error && makers.length > 0 && (
          <span className={styles.count}>
            {makers.length} {makers.length === 1 ? 'maker' : 'makers'}
          </span>
        )}
      </div>

      {loading && (
        <div className={styles.skeletonList} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.skeletonRow} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorBox} role="alert">
          <p>{error}</p>
          <button type="button" className={styles.retry} onClick={() => setSearchParams(new URLSearchParams(searchParams), { replace: true })}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && makers.length === 0 && (
        <div className={styles.empty}>
          <p>No maker matches that yet.</p>
          <button type="button" className={styles.linkButton} onClick={() => navigate('/platform/discovery')}>
            Browse every maker
          </button>
        </div>
      )}

      {!loading && !error && makers.length > 0 && (
        <ul className={styles.list}>
          {makers.map((maker) => (
            <li key={maker.id}>
              <button
                type="button"
                className={styles.card}
                onClick={() => navigate(`/platform/profile/${maker.id}`)}
              >
                <span className={styles.cardTop}>
                  <span className={styles.brand}>{maker.brandName}</span>
                  <span className={styles.location}>{maker.location ?? 'Location not given'}</span>
                </span>
                {maker.bio && <span className={styles.bio}>{maker.bio}</span>}
                <span className={styles.meta}>
                  <span>{maker.minBatch ?? '—'}–{maker.maxBatch ?? '—'} pieces</span>
                  <span>{maker.leadTimeDays ? `${maker.leadTimeDays} days` : 'Lead time on request'}</span>
                  {maker.specializations.length > 0 && (
                    <span className={styles.specs}>{maker.specializations.join(' · ')}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MakerSearchView;
