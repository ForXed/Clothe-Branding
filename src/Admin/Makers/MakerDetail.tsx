// src/Admin/Makers/MakerDetail.tsx
// Brutige Admin — single maker application detail.
// Shows all fields from the Maker type.
// PENDING makers get Approve / Reject actions.
// VERIFIED / REJECTED makers show their resolution metadata.

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { getErrorMessage, getErrorStatus } from "../../utils/apiError";
import type { Maker, VerificationStatus } from "../../types/maker";
import type { VerifyMakerInput } from "../../types/admin";
import styles from "./MakerDetail.module.css";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STATUS_COLORS: Record<VerificationStatus, string> = {
  PENDING: "#f59e0b",
  VERIFIED: "#10b981",
  REJECTED: "#ef4444",
};

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const shortId = (id: string) => id.slice(0, 12);

/* ------------------------------------------------------------------ */
/* Reject prompt (full-page inline form, not a modal)                  */
/* ------------------------------------------------------------------ */

const RejectForm = ({
  onCancel,
  onConfirm,
  submitting,
}: {
  onCancel: () => void;
  onConfirm: (note: string) => void;
  submitting: boolean;
}) => {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setError("A rejection reason is required. The maker will see this.");
      return;
    }
    if (note.trim().length < 10) {
      setError("Please provide at least 10 characters of explanation.");
      return;
    }
    onConfirm(note.trim());
  };

  return (
    <form className={styles.rejectForm} onSubmit={handleSubmit}>
      <p className={styles.rejectFormTitle}>Rejection Reason</p>
      <p className={styles.rejectFormHint}>
        This note will be visible to the maker when they check their
        application status. Be specific and constructive.
      </p>

      <textarea
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          if (error) setError("");
        }}
        rows={4}
        placeholder="e.g. Portfolio does not demonstrate capability for the requested specializations. Please resubmit with relevant samples."
        disabled={submitting}
      />

      {error && <p className={styles.formError}>{error}</p>}

      <div className={styles.rejectFormActions}>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.confirmRejectBtn}
          disabled={submitting}
        >
          {submitting ? "Rejecting…" : "Confirm Rejection"}
        </button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Status timeline                                                     */
/* ------------------------------------------------------------------ */

const StatusTimeline = ({ maker }: { maker: Maker }) => {
  const events: { label: string; date: string; type: "created" | "verified" | "rejected" }[] = [];

  events.push({ label: "Application submitted", date: maker.createdAt, type: "created" });

  if (maker.verifiedAt) {
    events.push({ label: "Verified by admin", date: maker.verifiedAt, type: "verified" });
  }

  if (maker.verificationStatus === "REJECTED" && maker.rejectionNote) {
    // We don't have a rejectedAt timestamp on the Maker type.
    // Show the rejection note without a date, or use updatedAt if available.
    events.push({ label: "Rejected", date: maker.createdAt, type: "rejected" });
  }

  return (
    <div className={styles.timeline}>
      <p className={styles.sectionLabel}>STATUS TIMELINE</p>
      <div className={styles.timelineList}>
        {events.map((evt, i) => (
          <div key={i} className={styles.timelineItem}>
            <span
              className={`${styles.timelineDot} ${
                evt.type === "verified"
                  ? styles.dotGreen
                  : evt.type === "rejected"
                  ? styles.dotRed
                  : styles.dotAmber
              }`}
            />
            <div className={styles.timelineContent}>
              <p className={styles.timelineLabel}>{evt.label}</p>
              <p className={styles.timelineDate}>{formatDate(evt.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const MakerDetail = () => {
  const { makerId } = useParams<{ makerId: string }>();
  const navigate = useNavigate();

  const [maker, setMaker] = useState<Maker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  const requestId = useRef(0);

  const fetchMaker = useCallback(async () => {
    if (!makerId) return;
    const current = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.getMakerById(makerId);
      if (current !== requestId.current) return;
      setMaker(data);
    } catch (err) {
      if (current !== requestId.current) return;
      setError(getErrorMessage(err, "Failed to load maker application."));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [makerId]);

  useEffect(() => {
    void fetchMaker();
    return () => {
      requestId.current += 1;
    };
  }, [fetchMaker]);

  /* ---------------------------------------------------------------- */
  /* Actions                                                           */
  /* ---------------------------------------------------------------- */

  const handleApprove = async () => {
    if (!maker) return;
    if (!window.confirm(`Approve "${maker.brandName}" as a verified maker?`)) return;

    setActionLoading(true);
    setError(null);

    try {
      await adminService.verifyMaker(maker.id, { status: "VERIFIED" });
      await fetchMaker(); // refresh to show new status
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 409) {
        // Already processed
        await fetchMaker();
      }
      setError(getErrorMessage(err, "Failed to approve maker."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (note: string) => {
    if (!maker) return;

    setActionLoading(true);
    setError(null);

    try {
      await adminService.verifyMaker(maker.id, {
        status: "REJECTED",
        rejectionNote: note,
      });
      setShowRejectForm(false);
      await fetchMaker();
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 409) {
        await fetchMaker();
      }
      setError(getErrorMessage(err, "Failed to reject maker."));
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Loading state                                                     */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className={styles.container}>
        <button type="button" className={styles.backBtn} onClick={() => navigate("/admin/makers")}>
          ← Back to Makers
        </button>
        <div className={styles.skeletonBlock}>
          <div className={styles.skeletonBar} style={{ width: "50%", height: 28 }} />
          <div className={styles.skeletonBar} style={{ width: "30%", height: 16 }} />
          <div className={styles.skeletonBar} style={{ width: "80%", height: 14 }} />
          <div className={styles.skeletonBar} style={{ width: "60%", height: 14 }} />
          <div className={styles.skeletonBar} style={{ width: "100%", height: 120 }} />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Error / not found                                                 */
  /* ---------------------------------------------------------------- */

  if (error && !maker) {
    return (
      <div className={styles.container}>
        <button type="button" className={styles.backBtn} onClick={() => navigate("/admin/makers")}>
          ← Back to Makers
        </button>
        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          <button type="button" onClick={fetchMaker}>Retry</button>
        </div>
      </div>
    );
  }

  if (!maker) {
    return (
      <div className={styles.container}>
        <button type="button" className={styles.backBtn} onClick={() => navigate("/admin/makers")}>
          ← Back to Makers
        </button>
        <div className={styles.emptyState}>
          <p>Maker application not found.</p>
        </div>
      </div>
    );
  }

  const isPending = maker.verificationStatus === "PENDING";

  /* ---------------------------------------------------------------- */
  /* Main render                                                       */
  /* ---------------------------------------------------------------- */

  return (
    <div className={styles.container}>
      {/* Back nav */}
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate("/admin/makers")}
      >
        ← Back to Makers
      </button>

      {/* Error banner (action errors, not load errors) */}
      {error && (
        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* ─── Identity header ─── */}
      <section className={`${styles.card} ${styles.identityCard}`}>
        <div className={styles.identityTop}>
          <div>
            <h2 className={styles.makerName}>{maker.brandName}</h2>
            <p className={styles.makerId}>ID: {shortId(maker.id)}</p>
          </div>
          <span
            className={styles.statusBadge}
            style={{ backgroundColor: STATUS_COLORS[maker.verificationStatus] }}
          >
            {maker.verificationStatus}
          </span>
        </div>

        <p className={styles.makerBio}>{maker.bio}</p>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>📍 {maker.location}</span>
          <span className={styles.metaItem}>⏱ {maker.leadTimeDays} days lead</span>
          <span className={styles.metaItem}>
            📦 {maker.minBatch}–{maker.maxBatch} batch
          </span>
          <span className={styles.metaItem}>
            📅 Applied {formatDate(maker.createdAt)}
          </span>
        </div>

        {maker.verificationStatus === "VERIFIED" && maker.verifiedAt && (
          <p className={styles.verifiedNote}>
            ✓ Verified on {formatDate(maker.verifiedAt)}
          </p>
        )}

        {maker.verificationStatus === "REJECTED" && maker.rejectionNote && (
          <div className={styles.rejectionBox}>
            <p className={styles.rejectionLabel}>REJECTION REASON</p>
            <p className={styles.rejectionText}>{maker.rejectionNote}</p>
          </div>
        )}
      </section>

      {/* ─── Specializations ─── */}
      <section className={styles.card}>
        <p className={styles.sectionLabel}>SPECIALIZATIONS</p>
        {maker.specializations.length > 0 ? (
          <div className={styles.specGrid}>
            {maker.specializations.map((s) => (
              <span key={s} className={styles.specTag}>
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className={styles.emptyNote}>No specializations listed.</p>
        )}
      </section>

      {/* ─── Capability details ─── */}
      <section className={styles.card}>
        <p className={styles.sectionLabel}>CAPABILITY</p>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <p className={styles.detailLabel}>Lead Time</p>
            <p className={styles.detailValue}>{maker.leadTimeDays} days</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.detailLabel}>Minimum Batch</p>
            <p className={styles.detailValue}>{maker.minBatch} units</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.detailLabel}>Maximum Batch</p>
            <p className={styles.detailValue}>{maker.maxBatch} units</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.detailLabel}>Location</p>
            <p className={styles.detailValue}>{maker.location}</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.detailLabel}>User ID</p>
            <p className={styles.detailValue}>{shortId(maker.userId)}</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.detailLabel}>Created</p>
            <p className={styles.detailValue}>{formatDate(maker.createdAt)}</p>
          </div>
        </div>
      </section>

      {/* ─── Status timeline ─── */}
      <section className={styles.card}>
        <StatusTimeline maker={maker} />
      </section>

      {/* ─── Actions (only for PENDING) ─── */}
      {isPending && (
        <section className={`${styles.card} ${styles.actionCard}`}>
          <p className={styles.sectionLabel}>ADMIN ACTION</p>

          {!showRejectForm ? (
            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.approveBtn}
                onClick={handleApprove}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing…" : "Approve & Verify"}
              </button>
              <button
                type="button"
                className={styles.rejectBtn}
                onClick={() => setShowRejectForm(true)}
                disabled={actionLoading}
              >
                Reject
              </button>
            </div>
          ) : (
            <RejectForm
              onCancel={() => setShowRejectForm(false)}
              onConfirm={handleReject}
              submitting={actionLoading}
            />
          )}
        </section>
      )}

      {/* ─── Already resolved notice ─── */}
      {!isPending && (
        <section className={`${styles.card} ${styles.resolvedCard}`}>
          <p className={styles.resolvedText}>
            {maker.verificationStatus === "VERIFIED"
              ? "✓ This maker has been verified. No further action required."
              : "✗ This application was rejected. The maker may resubmit if the platform permits."}
          </p>
        </section>
      )}
    </div>
  );
};

export default MakerDetail;