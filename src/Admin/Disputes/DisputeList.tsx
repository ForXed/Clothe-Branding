// src/Admin/Disputes/DisputeList.tsx
// Brutige Admin — dispute queue.
// Lists disputes filtered by status. Clicking a row opens the resolution detail.
// Wired to useAdminDisputes (already written).

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminDisputes } from "../../hooks/useAdminDisputes";
import type { DisputeRecord, DisputeStatus } from "../../types/admin";
import styles from "./DisputeList.module.css";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STATUS_FILTERS: { value: DisputeStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "ESCALATED", label: "Escalated" },
  { value: "RESOLVED_RELEASED", label: "Released" },
  { value: "RESOLVED_REFUNDED", label: "Refunded" },
  { value: "RESOLVED_PARTIAL", label: "Partial" },
];

const DISPUTE_STATUS_COLORS: Record<DisputeStatus, string> = {
  OPEN: "#f59e0b",
  UNDER_REVIEW: "#3b82f6",
  ESCALATED: "#ef4444",
  RESOLVED_RELEASED: "#10b981",
  RESOLVED_REFUNDED: "#f97316",
  RESOLVED_PARTIAL: "#8b5cf6",
};

const REASON_LABELS: Record<string, string> = {
  QUALITY_MISMATCH: "Quality mismatch",
  NOT_DELIVERED: "Not delivered",
  LATE_DELIVERY: "Late delivery",
  OTHER: "Other",
};

const formatCurrency = (n: number): string =>
  `₦${n.toLocaleString("en-NG")}`;

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const shortId = (id: string) => id.slice(0, 8);

const truncate = (text: string, max = 140): string => {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
};

/* ------------------------------------------------------------------ */
/* Dispute row card                                                    */
/* ------------------------------------------------------------------ */

const DisputeRow = ({
  dispute,
  onView,
}: {
  dispute: DisputeRecord;
  onView: (orderId: string) => void;
}) => {
  const { order } = dispute;
  const isResolved = dispute.status.startsWith("RESOLVED_");

  return (
    <div className={styles.row} onClick={() => onView(dispute.orderId)}>
      <div className={styles.rowMain}>
        {/* Top line: order id + garment + dispute status */}
        <div className={styles.rowIdentity}>
          <span className={styles.orderId}>#{shortId(dispute.orderId)}</span>
          <span className={styles.garmentName}>
            {order.brief.garmentType}
          </span>
          <span
            className={styles.statusBadge}
            style={{
              backgroundColor: DISPUTE_STATUS_COLORS[dispute.status],
            }}
          >
            {dispute.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* Parties line */}
        <p className={styles.parties}>
          <span className={styles.partyLabel}>Buyer</span>{" "}
          <span className={styles.partyName}>
            {order.buyer.displayName}
          </span>
          <span className={styles.partySep}>↔</span>
          <span className={styles.partyLabel}>Maker</span>{" "}
          <span className={styles.partyName}>
            {order.maker.displayName}
          </span>
        </p>

        {/* Reason + amount + raised date */}
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <strong>Reason:</strong>{" "}
            {REASON_LABELS[dispute.reasonCategory] ?? dispute.reasonCategory}
          </span>
          <span className={styles.metaItem}>
            <strong>Escrow:</strong> {formatCurrency(order.escrow.amountNgn)}
          </span>
          <span className={styles.metaItem}>
            <strong>Raised:</strong> {formatDate(dispute.raisedAt)}
          </span>
          <span className={styles.metaItem}>
            <strong>By:</strong>{" "}
            {dispute.raisedBy === "BUYER" ? "Brand" : "Maker"}
          </span>
        </div>

        {/* Explanation preview */}
        <p className={styles.excerpt}>{truncate(dispute.explanation)}</p>

        {/* Resolution note if already resolved */}
        {isResolved && dispute.resolutionNote && (
          <p className={styles.resolutionNote}>
            <strong>Resolution:</strong> {truncate(dispute.resolutionNote, 100)}
          </p>
        )}
      </div>

      <span className={styles.rowArrow}>→</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const DisputeList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<DisputeStatus | "ALL">("ALL");

  const { disputes, loading, error, refetch } = useAdminDisputes();

  const filtered =
    filter === "ALL"
      ? disputes
      : disputes.filter((d) => d.status === filter);

  const handleView = (orderId: string) => {
    navigate(`/admin/disputes/${orderId}`);
  };

  /* ---------------------------------------------------------------- */
  /* Loading state                                                     */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Disputes</h2>
        </div>
        <div className={styles.skeletonList}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonBar} style={{ width: "55%" }} />
              <div className={styles.skeletonBar} style={{ width: "80%" }} />
              <div className={styles.skeletonBar} style={{ width: "40%" }} />
              <div className={styles.skeletonBar} style={{ width: "95%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Error state                                                       */
  /* ---------------------------------------------------------------- */

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Disputes</h2>
        </div>
        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          <button type="button" onClick={refetch}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Counts for filter badges                                          */
  /* ---------------------------------------------------------------- */

  const counts = disputes.reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1;
    return acc;
  }, {});

  /* ---------------------------------------------------------------- */
  /* Main render                                                       */
  /* ---------------------------------------------------------------- */

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Disputes</h2>
        <p className={styles.subtitle}>
          Review disputed orders, examine evidence, and determine escrow
          release or refund.
        </p>
      </div>

      {/* Filter tabs */}
      <div className={styles.filterBar}>
        {STATUS_FILTERS.map((f) => {
          const count =
            f.value === "ALL" ? disputes.length : counts[f.value] ?? 0;
          return (
            <button
              key={f.value}
              type="button"
              className={`${styles.filterBtn} ${
                filter === f.value ? styles.filterBtnActive : ""
              }`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {count > 0 && (
                <span className={styles.filterCount}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            {filter === "ALL"
              ? "No disputes have been raised yet."
              : `No ${filter.replace(/_/g, " ").toLowerCase()} disputes.`}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((dispute) => (
            <DisputeRow
              key={dispute.orderId}
              dispute={dispute}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DisputeList;