// src/Admin/Makers/MakerList.tsx
// Brutige Admin — Maker verification queue.
// Lists makers filtered by verification status.
// PENDING makers get inline Approve / Reject actions.
// Clicking a row navigates to /admin/makers/:makerId for full detail.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminMakers } from "../../hooks/useAdminMakers";
import type { Maker, VerificationStatus } from "../../types/maker";
import styles from "./MakerList.module.css";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STATUS_FILTERS: { value: VerificationStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "VERIFIED", label: "Verified" },
  { value: "REJECTED", label: "Rejected" },
];

const STATUS_COLORS: Record<VerificationStatus, string> = {
  PENDING: "#f59e0b",
  VERIFIED: "#10b981",
  REJECTED: "#ef4444",
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const shortId = (id: string) => id.slice(0, 8);

/* ------------------------------------------------------------------ */
/* Rejection prompt (simple inline modal)                              */
/* ------------------------------------------------------------------ */

const RejectPrompt = ({
  makerName,
  onCancel,
  onConfirm,
}: {
  makerName: string;
  onCancel: () => void;
  onConfirm: (note: string) => void;
}) => {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setError("A rejection reason is required.");
      return;
    }
    onConfirm(note.trim());
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className={styles.modalHeader}>
          <p>Reject "{makerName}"</p>
          <button type="button" onClick={onCancel}>
            X
          </button>
        </div>

        <label htmlFor="rejectionNote">Reason (shown to the maker)</label>
        <textarea
          id="rejectionNote"
          rows={3}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            if (error) setError("");
          }}
          placeholder="e.g. Portfolio does not demonstrate capability for the requested specializations."
        />

        {error && <p className={styles.modalError}>{error}</p>}

        <div className={styles.modalActions}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.modalConfirmBtn}>
            Confirm Rejection
          </button>
        </div>
      </form>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Maker row card                                                      */
/* ------------------------------------------------------------------ */

const MakerRow = ({
  maker,
  isPending,
  onApprove,
  onReject,
  onView,
}: {
  maker: Maker;
  isPending: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
}) => {
  return (
    <div className={styles.row} onClick={() => onView(maker.id)}>
      <div className={styles.rowMain}>
        <div className={styles.rowIdentity}>
          <span className={styles.rowName}>{maker.brandName}</span>
          <span
            className={styles.statusBadge}
            style={{ backgroundColor: STATUS_COLORS[maker.verificationStatus] }}
          >
            {maker.verificationStatus}
          </span>
        </div>

        <p className={styles.rowMeta}>
          {maker.location} • Lead {maker.leadTimeDays}d • Batch{" "}
          {maker.minBatch}–{maker.maxBatch} • Applied{" "}
          {formatDate(maker.createdAt)}
        </p>

        {maker.specializations.length > 0 && (
          <div className={styles.specTags}>
            {maker.specializations.slice(0, 5).map((s) => (
              <span key={s} className={styles.specTag}>
                {s}
              </span>
            ))}
            {maker.specializations.length > 5 && (
              <span className={styles.specMore}>
                +{maker.specializations.length - 5}
              </span>
            )}
          </div>
        )}

        {maker.verificationStatus === "REJECTED" && maker.rejectionNote && (
          <p className={styles.rejectionNote}>
            <strong>Rejected:</strong> {maker.rejectionNote}
          </p>
        )}

        {maker.verificationStatus === "VERIFIED" && maker.verifiedAt && (
          <p className={styles.verifiedNote}>
            ✓ Verified {formatDate(maker.verifiedAt)}
          </p>
        )}
      </div>

      {isPending && (
        <div
          className={styles.rowActions}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={styles.approveBtn}
            onClick={() => onApprove(maker.id)}
          >
            Approve
          </button>
          <button
            type="button"
            className={styles.rejectBtn}
            onClick={() => onReject(maker.id)}
          >
            Reject
          </button>
        </div>
      )}

      <span className={styles.rowArrow}>→</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const MakerList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<VerificationStatus | "ALL">("ALL");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const { makers, loading, error, pendingId, refetch, verifyMaker } =
    useAdminMakers(filter === "ALL" ? undefined : filter);

  const rejectingMaker = makers.find((m) => m.id === rejectingId);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Approve this maker application?")) return;
    const result = await verifyMaker(id, { status: "VERIFIED" });
    if (!result.ok) {
      window.alert(result.message);
    }
  };

  const handleRejectConfirm = async (note: string) => {
    if (!rejectingId) return;
    const result = await verifyMaker(rejectingId, {
      status: "REJECTED",
      rejectionNote: note,
    });
    setRejectingId(null);
    if (!result.ok) {
      window.alert(result.message);
    }
  };

  const handleView = (id: string) => {
    navigate(`/admin/makers/${id}`);
  };

  /* ---------------------------------------------------------------- */
  /* Loading state                                                     */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Makers</h2>
        </div>
        <div className={styles.skeletonList}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonBar} style={{ width: "40%" }} />
              <div className={styles.skeletonBar} style={{ width: "70%" }} />
              <div className={styles.skeletonBar} style={{ width: "25%" }} />
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
          <h2 className={styles.title}>Makers</h2>
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
  /* Main render                                                       */
  /* ---------------------------------------------------------------- */

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Makers</h2>
        <p className={styles.subtitle}>
          Review and manage maker verification applications.
        </p>
      </div>

      {/* Filter tabs */}
      <div className={styles.filterBar}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`${styles.filterBtn} ${
              filter === f.value ? styles.filterBtnActive : ""
            }`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {makers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            {filter === "ALL"
              ? "No maker applications yet."
              : `No ${filter.toLowerCase()} makers.`}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {makers.map((maker) => (
            <MakerRow
              key={maker.id}
              maker={maker}
              isPending={maker.verificationStatus === "PENDING"}
              onApprove={handleApprove}
              onReject={(id) => setRejectingId(id)}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Reject modal */}
      {rejectingMaker && (
        <RejectPrompt
          makerName={rejectingMaker.brandName}
          onCancel={() => setRejectingId(null)}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  );
};

export default MakerList;