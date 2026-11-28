import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OverView.module.css';
import { CHAT_ENABLED } from '../../config/features';
import { MAKER_ORDER_STATUSES, countOf } from '../../types/dashboard';
import type { MakerDashboard } from '../../types/dashboard';
import type { ApiOrder } from '../../types/order';
import type { MakerProfile } from '../../types/maker';

/**
 * The maker studio home.
 *
 * Everything on this screen comes from the API: `/dashboard/maker` for the
 * counts, `/orders` for the recent rows and `/makers/me` for the brand name.
 * The API exposes no revenue figure, no sales velocity and no traffic series,
 * so the screen shows orders by status instead of an invented revenue chart.
 */
export interface OverViewProps {
  dashboard: MakerDashboard | null;
  orders: ApiOrder[];
  maker: MakerProfile | null;
  loading: boolean;
  error: string | null;
  onReload: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  AWAITING_PAYMENT: 'Awaiting payment',
  IN_ESCROW: 'In escrow',
  IN_PRODUCTION: 'In production',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  DISPUTED: 'Disputed',
  CANCELLED: 'Cancelled',
  PENDING: 'Pending',
};

const shortId = (id?: string): string => (id ? id.slice(0, 8) : '—');

const formatDate = (iso?: string | null): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
};

const OverView: React.FC<OverViewProps> = ({ dashboard, orders, maker, loading, error, onReload }) => {
  const navigate = useNavigate();

  const activeOrders = countOf(dashboard?.ordersByStatus, 'IN_ESCROW', 'IN_PRODUCTION', 'DELIVERED');
  const completedOrders = countOf(dashboard?.ordersByStatus, 'COMPLETED');

  const stats = useMemo(
    () => [
      {
        label: 'Incoming briefs',
        value: dashboard?.incomingBriefsCount ?? 0,
        hint: 'waiting for your quote',
        onClick: () => navigate('/studio/briefs'),
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="13" y2="17" />
          </svg>
        ),
      },
      {
        label: 'Quotes waiting',
        value: dashboard?.activeQuotesCount ?? 0,
        hint: 'buyer has not answered',
        onClick: () => navigate('/studio/orders'),
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
      },
      {
        label: 'Active orders',
        value: activeOrders,
        hint: 'escrowed or in production',
        onClick: () => navigate('/studio/orders'),
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="22" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        ),
      },
      {
        label: 'Completed',
        value: completedOrders,
        hint: 'escrow released',
        onClick: () => navigate('/studio/orders'),
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      },
    ],
    [dashboard, activeOrders, completedOrders, navigate],
  );

  const chartData = useMemo(() => {
    const byStatus = dashboard?.ordersByStatus ?? {};
    return MAKER_ORDER_STATUSES.map((status) => ({
      label: STATUS_LABEL[status] ?? status,
      value: byStatus[status] ?? 0,
    })).filter((row) => row.value > 0);
  }, [dashboard]);

  const maxValue = useMemo(
    () => Math.max(1, ...chartData.map((row) => row.value)),
    [chartData],
  );

  const STATUS_TONE: Record<string, "pending" | "processing" | "shipped" | "completed"> = {
  AWAITING_PAYMENT: "pending",
  PENDING: "pending",
  IN_ESCROW: "processing",
  IN_PRODUCTION: "shipped",
  DELIVERED: "shipped",
  COMPLETED: "completed",
  CANCELLED: "pending",
  DISPUTED: "pending",
};
const toneOf = (status: string) => STATUS_TONE[status] ?? "pending";

const recentOrders = orders.slice(0, 5);
  const displayName = maker?.brandName || 'Your studio';
  const verified = maker?.verificationStatus === 'VERIFIED';

  if (loading && !dashboard) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading your studio…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2>Studio overview</h2>
            <p>{error}</p>
          </div>
        </div>
        <div className={styles.emptyState}>
          <p>We could not read your dashboard.</p>
          <button type="button" className={styles.quickBtn} onClick={onReload}>
            <span>Try again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Studio overview</h2>
          <p>
            {displayName}
            {maker ? (verified ? ' · verified maker' : ' · verification pending') : ''}
          </p>
        </div>
        <div
          className={styles.profileSection}
          onClick={() => navigate('/studio/settings')}
          role="button"
          tabIndex={0}
          aria-label="Go to settings"
        >
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{displayName}</span>
            <span className={styles.profileStatus}>
              {verified ? '● Verified' : '○ Pending review'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={styles.statCard}
            onClick={stat.onClick}
            role="button"
            tabIndex={0}
          >
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>{stat.icon}</span>
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statHint}>{stat.hint}</div>
          </div>
        ))}
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div>
            <h3>Orders by status</h3>
            <p>Every order you have with a buyer right now.</p>
          </div>
          <div className={styles.chartActions}>
            <button type="button" className={styles.fullReportBtn} onClick={() => navigate('/studio/orders')}>
              Open orders
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className={styles.emptyChart}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 5-5" />
            </svg>
            <p>No orders yet. Quote an incoming brief to start one.</p>
          </div>
        ) : (
          <div className={styles.chart}>
            <div className={styles.chartBars}>
              {chartData.map((row) => (
                <div key={row.label} className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{ height: `${(row.value / maxValue) * 100}%` }}
                    role="img"
                    aria-label={`${row.label}: ${row.value}`}
                  >
                    <span className={styles.barValue}>{row.value}</span>
                  </div>
                  <span className={styles.barLabel}>{row.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.twoColumn}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Recent orders</h3>
            <button type="button" className={styles.viewAll} onClick={() => navigate('/studio/orders')}>
              View all
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          <div className={styles.ordersList}>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className={styles.orderRow}
                  onClick={() => navigate(`/studio/orders/${order.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/studio/orders/${order.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>#{shortId(order.id)}</span>
                    <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`${styles.orderStatus} ${styles[toneOf(order.status)]}`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="22" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                </svg>
                <p>No orders yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Quick actions</h3>
          </div>
          <div className={styles.quickActions}>
            <button type="button" className={styles.quickBtn} onClick={() => navigate('/studio/briefs')}>
              <div className={styles.quickIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span>Incoming briefs</span>
            </button>
            <button type="button" className={styles.quickBtn} onClick={() => navigate('/studio/orders')}>
              <div className={styles.quickIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="22" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                </svg>
              </div>
              <span>Orders</span>
            </button>
            {CHAT_ENABLED && (
              <button type="button" className={styles.quickBtn} onClick={() => navigate('/studio/messages')}>
                <div className={styles.quickIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z" />
                  </svg>
                </div>
                <span>Messages</span>
              </button>
            )}
            <button type="button" className={styles.quickBtn} onClick={() => navigate('/studio/settings')}>
              <div className={styles.quickIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverView;
