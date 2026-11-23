// src/Admin/Makers/MakerList.tsx
// The maker review queue. The API only exposes the pending queue
// (GET /api/v1/admin/makers/pending), so approved/rejected makers are not
// browseable here — a decision is made from the row and the item leaves the list.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminMakers } from "../../hooks/useAdminMakers";
import type { PendingMaker } from "../../types/admin";
import styles from "./MakerList.module.css";

const shortId = (value?: string | null) => (value ? value.slice(0, 8) : "—");

const formatDate = (iso?: string | null): string =>
  iso
    ? new Date(iso).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

interface MakerRowProps {
  maker: PendingMaker;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
}

const MakerRow = ({ maker, onApprove, onReject, onView }: MakerRowProps) => {
  const shown = maker.specializations.slice(0, 3);
  const rest = maker.specializations.length - shown.length;

  return (
    <div className={styles.row}>
      <div className={styles.rowMain} onClick={() => onView(maker.id)}>
        <div className={styles.rowIdentity}>
          <span className={styles.rowName}>{maker.brandName}</span>
          <span className={styles.statusBadge} style={{ backgroundColor: "#f59e0b" }}>
            PENDING
          </span>
        </div>

        <div className={styles.rowMeta}>
          <span>{maker.userEmail}</span>
          <span>{maker.location ?? "no location"}</span>
          <span>
            {maker.minBatch ?? "?"}–{maker.maxBatch ?? "?"} units
          </span>
          <span>{maker.leadTimeDays ?? "?"} day lead time</span>
        </div>

        <div className={styles.specTags}>
          {shown.map((spec) => (
            <span key={spec} className={styles.specTag}>
              {spec}
            </span>
          ))}
          {rest > 0 && <span className={styles.specMore}>+{rest} more</span>}
          {maker.specializations.length === 0 && (
            <span className={styles.specMore}>no specializations listed</span>
          )}
        </div>
      </div>

      <div className={styles.rowActions}>
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

      <span
        className={styles.rowArrow}
        onClick={() => onView(maker.id)}
        role="button"
        tabIndex={0}
      >
        →
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const MakerList = () => {
  const navigate = useNavigate();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { makers, loading, error, pendingId, refetch, verifyMaker } =
    useAdminMakers();

  const rejectingMaker = makers.find((m) => m.id === rejectingId);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Approve this maker application?")) return;
    const result = await verifyMaker(id, { status: "VERIFIED" });
    if (!result.ok) window.alert(result.message);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingId) return;
    if (!rejectionNote.trim()) {
      window.alert("A rejection note is required — the maker will see it.");
      return;
    }

    setSubmitting(true);
    const result = await verifyMaker(rejectingId, {
      status: "REJECTED",
      rejectionNote: rejectionNote.trim(),
    });
    setSubmitting(false);

    if (!result.ok) {
      window.alert(result.message);
      return;
    }

    setRejectingId(null);
    setRejectionNote("");
  };

  const handleView = (id: string) => navigate(`/admin/makers/${id}`);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonList}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonBar} style={{ width: "30%" }} />
              <div className={styles.skeletonBar} style={{ width: "55%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => void refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Makers</h1>
        <p className={styles.subtitle}>
          {makers.length === 0
            ? "No applications waiting for a decision."
            : `${makers.length} application${makers.length === 1 ? "" : "s"} waiting for a decision.`}
        </p>
      </div>

      {makers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nothing in the review queue.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {makers.map((maker) => (
            <MakerRow
              key={maker.id}
              maker={maker}
              onApprove={handleApprove}
              onReject={(id) => {
                setRejectionNote("");
                setRejectingId(id);
              }}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {rejectingMaker && (
        <div className={styles.modalOverlay} onClick={() => setRejectingId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <strong>Reject {rejectingMaker.brandName}</strong>
                <p>They will see this note in their dashboard.</p>
              </div>
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                aria-label="Close"
              >
                X
              </button>
            </div>

            <label htmlFor="rejectionNote">Reason (shown to the maker)</label>
            <textarea
              id="rejectionNote"
              rows={4}
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="What needs to change before they can be approved?"
            />

            <div className={styles.modalActions}>
              <button type="button" onClick={() => setRejectingId(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.modalConfirmBtn}
                onClick={() => void handleRejectConfirm()}
                disabled={submitting}
              >
                {submitting ? "Rejecting..." : "Reject application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakerList;
