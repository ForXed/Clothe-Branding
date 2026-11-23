// src/Admin/AdminDashboard.tsx
// Brutige Admin — overview dashboard.
// Shows current operational stats and quick links into maker/dispute queues.
// Uses GET /admin/stats via useAdminDashboard.
// ⚠️ CONFIRM backend exposes /admin/stats. If not, this screen will show an error
// until the endpoint is added or the hook is switched to computed fallback data.

import { useNavigate } from "react-router-dom";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import type { AdminDashboardStats } from "../types/admin";
import styles from "./AdminDashboard.module.css";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatNumber = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-NG");
};

const formatCurrency = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "—";
  return `₦${n.toLocaleString("en-NG")}`;
};

type StatTone = "neutral" | "amber" | "red" | "blue" | "green";

const getToneClass = (tone: StatTone): string => {
  switch (tone) {
    case "amber":
      return styles.toneAmber;
    case "red":
      return styles.toneRed;
    case "blue":
      return styles.toneBlue;
    case "green":
      return styles.toneGreen;
    default:
      return styles.toneNeutral;
  }
};

/* ------------------------------------------------------------------ */
/* Stat card                                                           */
/* ------------------------------------------------------------------ */

const StatCard = ({
  label,
  value,
  hint,
  tone = "neutral",
  onClick,
  actionLabel,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: StatTone;
  onClick?: () => void;
  actionLabel?: string;
}) => {
  const isClickable = typeof onClick === "function";

  return (
    <div
      className={`${styles.statCard} ${getToneClass(tone)} ${
        isClickable ? styles.clickable : ""
      }`}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!isClickable) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>

      {hint && <p className={styles.statHint}>{hint}</p>}

      {isClickable && actionLabel && (
        <p className={styles.statAction}>{actionLabel} →</p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Quick action button                                                 */
/* ------------------------------------------------------------------ */

const QuickAction = ({
  label,
  description,
  onClick,
}: {
  label: string;
  description: string;
  onClick: () => void;
}) => (
  <button type="button" className={styles.actionBtn} onClick={onClick}>
    <span className={styles.actionLabel}>{label}</span>
    <span className={styles.actionDesc}>{description}</span>
  </button>
);

/* ------------------------------------------------------------------ */
/* Dashboard content                                                   */
/* ------------------------------------------------------------------ */

const DashboardContent = ({ stats }: { stats: AdminDashboardStats }) => {
  const navigate = useNavigate();

  // The API exposes counts, not money: totals below are order counts per state.
  const count = (status: string) => stats.byStatus[status] ?? 0;
  const pendingMakers = stats.pendingMakers ?? 0;
  const openDisputes = count("DISPUTED");
  const activeOrders =
    count("IN_ESCROW") + count("IN_PRODUCTION") + count("DELIVERED");
  const completedOrders = count("COMPLETED");
  const cancelledOrders = count("CANCELLED");
  const awaitingPayment = count("AWAITING_PAYMENT");
  const totalOrders = stats.totalOrders ?? 0;

  return (
    <>
      {/* ─── Primary operational stats ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>OPERATIONAL STATUS</h2>
          <p className={styles.sectionSub}>
            Current state of the Brutige v1 marketplace.
          </p>
        </div>

        <div className={styles.grid}>
          <StatCard
            label="Pending Makers"
            value={formatNumber(pendingMakers)}
            hint={
              pendingMakers > 0
                ? "Applications waiting for review."
                : "No maker applications waiting."
            }
            tone={pendingMakers > 0 ? "amber" : "neutral"}
            onClick={() => navigate("/admin/makers")}
            actionLabel="Review queue"
          />

          <StatCard
            label="Open Disputes"
            value={formatNumber(openDisputes)}
            hint={
              openDisputes > 0
                ? "Escrow funds are locked pending resolution."
                : "No active disputes."
            }
            tone={openDisputes > 0 ? "red" : "neutral"}
            onClick={() => navigate("/admin/disputes")}
            actionLabel="Resolve disputes"
          />

          <StatCard
            label="Active Orders"
            value={formatNumber(activeOrders)}
            hint={
              awaitingPayment > 0
                ? `${formatNumber(awaitingPayment)} more awaiting payment.`
                : "Orders in escrow, production, or delivered."
            }
            tone="blue"
          />

          <StatCard
            label="Total Orders"
            value={formatNumber(totalOrders)}
            hint="Total buyer funds currently protected by escrow."
            tone="blue"
          />
        </div>
      </section>

      {/* ─── Secondary stats ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>PLATFORM SUMMARY</h2>
        </div>

        <div className={styles.gridSecondary}>
          <StatCard
            label="In Production"
            value={formatNumber(count("IN_PRODUCTION"))}
            hint="Orders the makers are working on right now."
            tone="green"
          />

          <StatCard
            label="Awaiting Payment"
            value={formatNumber(awaitingPayment)}
            hint="Orders created but not yet paid into escrow."
            tone="neutral"
          />

          <StatCard
            label="Completed Orders"
            value={formatNumber(completedOrders)}
            hint="Orders finalized and funds released."
            tone="green"
          />

          <StatCard
            label="Cancelled Orders"
            value={formatNumber(cancelledOrders)}
            hint="Orders terminated before completion."
            tone="neutral"
          />

          <StatCard
            label="Escrow Totals"
            value="—"
            hint="Fee and escrow sums are not exposed by the API yet."
            tone="neutral"
          />
        </div>
      </section>

      {/* ─── Quick actions ─── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>QUICK ACTIONS</h2>
          <p className={styles.sectionSub}>
            Jump directly into the most common admin workflows.
          </p>
        </div>

        <div className={styles.actions}>
          <QuickAction
            label="Review Pending Makers"
            description="Approve or reject maker applications."
            onClick={() => navigate("/admin/makers")}
          />

          <QuickAction
            label="Open Dispute Queue"
            description="Inspect evidence and resolve escrow disputes."
            onClick={() => navigate("/admin/disputes")}
          />

          <QuickAction
            label="View Active Orders"
            description="Monitor orders in production or delivery."
            onClick={() => navigate("/admin/orders")}
          />

          <QuickAction
            label="Manage Users"
            description="Suspend, reinstate, or inspect accounts."
            onClick={() => navigate("/admin/users")}
          />
        </div>
      </section>

      {/* ─── Data source note ─── */}
      <section className={styles.noteCard}>
        <p className={styles.noteTitle}>DATA SOURCE</p>
        <p className={styles.noteText}>
          This dashboard reads from <code>GET /admin/stats</code>. If the
          backend does not yet expose this endpoint, the screen will show a
          load error until the endpoint is confirmed or the hook is switched to
          computed fallback data from the maker/dispute/order list endpoints.
        </p>
      </section>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const AdminDashboard = () => {
  const { stats, loading, error, refetch } = useAdminDashboard();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Overview</h1>
          <p className={styles.subtitle}>
            Loading current Brutige operational data…
          </p>
        </div>

        <div className={styles.skeletonGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonBar} style={{ width: "45%" }} />
              <div className={styles.skeletonBar} style={{ width: "70%", height: 32 }} />
              <div className={styles.skeletonBar} style={{ width: "90%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Overview</h1>
        </div>

        <div className={styles.errorBox} role="alert">
          <span>
            {error ?? "Dashboard stats are unavailable."}
          </span>
          <button type="button" onClick={refetch}>
            Retry
          </button>
        </div>

        <section className={styles.noteCard}>
          <p className={styles.noteTitle}>LIKELY CAUSE</p>
          <p className={styles.noteText}>
            The admin dashboard expects <code>GET /admin/stats</code> to return
            an <code>AdminDashboardStats</code> object. Confirm with backend
            whether this endpoint exists, or temporarily compute these values
            from the maker, dispute, and order list endpoints.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Overview</h1>
        <p className={styles.subtitle}>
          Monitor maker verification, disputes, escrow, and order activity.
        </p>
      </div>

      <DashboardContent stats={stats} />
    </div>
  );
};

export default AdminDashboard;