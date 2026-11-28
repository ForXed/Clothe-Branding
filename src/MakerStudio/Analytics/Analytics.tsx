import React, { useEffect, useMemo, useState } from 'react';
import styles from './Analytics.module.css';
import dashboardService from '../../services/dashboardService';
import { MAKER_ORDER_STATUSES, countOf } from '../../types/dashboard';
import type { MakerDashboard } from '../../types/dashboard';

/**
 * What the API can actually answer about a maker's activity.
 *
 * v1 has no traffic, conversion, visitor or revenue-series endpoint, so this
 * screen shows the counts `/dashboard/maker` really returns and says plainly
 * that the rest is not measured yet. It used to render `Math.random()` series
 * behind labels like "Conversion Rate 3.8%" — numbers nobody could defend.
 */
const STATUS_LABEL: Record<string, string> = {
  AWAITING_PAYMENT: 'Awaiting payment',
  IN_ESCROW: 'In escrow',
  IN_PRODUCTION: 'In production',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  DISPUTED: 'Disputed',
  CANCELLED: 'Cancelled',
};

const Analytics: React.FC = () => {
  const [dashboard, setDashboard] = useState<MakerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const result = await dashboardService.getMakerDashboard();
        if (!cancelled) setDashboard(result);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Could not load your activity.';
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    const byStatus = dashboard?.ordersByStatus ?? {};
    const total = Object.values(byStatus).reduce((sum, value) => sum + value, 0);
    return MAKER_ORDER_STATUSES.map((status) => {
      const value = byStatus[status] ?? 0;
      return {
        status,
        label: STATUS_LABEL[status] ?? status,
        value,
        share: total > 0 ? Math.round((value / total) * 100) : 0,
      };
    }).filter((row) => row.value > 0);
  }, [dashboard]);

  const totalOrders = Object.values(dashboard?.ordersByStatus ?? {}).reduce((sum, value) => sum + value, 0);
  const activeOrders = countOf(dashboard?.ordersByStatus, 'IN_ESCROW', 'IN_PRODUCTION', 'DELIVERED');
  const completedOrders = countOf(dashboard?.ordersByStatus, 'COMPLETED');

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading your activity…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Activity</h1>
          <p>Counts the platform records for you today.</p>
        </div>
      </div>

      <div className={styles.alertBanner}>
        <span className={styles.alertIcon}>i</span>
        <div className={styles.alertContent}>
          <strong>Traffic, conversion and revenue trends are not measured yet.</strong> v1
          records briefs, quotes, orders and escrow — not page views or funnels. The numbers
          below are the real ones.
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiIcon}>📥</span>
          </div>
          <div className={styles.kpiValue}>{dashboard?.incomingBriefsCount ?? 0}</div>
          <div className={styles.kpiLabel}>Incoming briefs</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiIcon}>🧾</span>
          </div>
          <div className={styles.kpiValue}>{dashboard?.activeQuotesCount ?? 0}</div>
          <div className={styles.kpiLabel}>Quotes waiting</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiIcon}>🏗️</span>
          </div>
          <div className={styles.kpiValue}>{activeOrders}</div>
          <div className={styles.kpiLabel}>Active orders</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiIcon}>✅</span>
          </div>
          <div className={styles.kpiValue}>{completedOrders}</div>
          <div className={styles.kpiLabel}>Completed orders</div>
        </div>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.sectionHeader}>
          <h3>Orders by status ({totalOrders})</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Orders</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3}>No orders yet.</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.status}>
                    <td>{row.label}</td>
                    <td>{row.value}</td>
                    <td>
                      <span className={`${styles.growth} ${styles.positive}`}>{row.share}%</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
