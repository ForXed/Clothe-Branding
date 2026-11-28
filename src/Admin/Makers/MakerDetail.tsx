// src/Admin/Makers/MakerDetail.tsx
// One maker application, as far as the v1 API can tell us about a maker an
// admin has not approved yet: the pending queue carries brand, contact, location,
// batch range, lead time and specializations, and nothing else. So this screen
// reads the pending queue and finds its row, then offers approve/reject.
//
// There is no admin-facing maker detail endpoint in v1 — once a decision is made
// the maker leaves this queue, so a deep link to an already-reviewed maker shows
// the "not in the queue" state below.

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { getErrorMessage } from "../../utils/apiError";
import type { PendingMaker, VerifyMakerInput } from "../../types/admin";
import styles from "./MakerDetail.module.css";

const shortId = (value?: string | null) => (value ? value.slice(0, 12) : "—");

const MakerDetail = () => {
  const { makerId } = useParams<{ makerId: string }>();
  const navigate = useNavigate();

  const [maker, setMaker] = useState<PendingMaker | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [rejecting, setRejecting] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resolved, setResolved] = useState<VerifyMakerInput["status"] | null>(
    null,
  );

  const requestId = useRef(0);

  const load = useCallback(async () => {
    if (!makerId) return;
    const current = ++requestId.current;
    setLoading(true);
    setLoadError(null);

    try {
      const page = await adminService.listPendingMakers({ page: 0, size: 100 });
      if (current !== requestId.current) return;
      setMaker(page.content.find((m) => m.id === makerId) ?? null);
    } catch (err) {
      if (current !== requestId.current) return;
      setLoadError(getErrorMessage(err, "Failed to load this application."));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [makerId]);

  useEffect(() => {
    void load();
    return () => {
      requestId.current += 1;
    };
  }, [load]);

  const decide = async (input: VerifyMakerInput) => {
    if (!makerId) return;
    setSubmitting(true);
    setFormError(null);

    try {
      await adminService.decideMaker(makerId, input);
      setResolved(input.status);
      setRejecting(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to record the decision."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = () => {
    if (!rejectionNote.trim()) {
      setFormError("A rejection note is required — the maker will see it.");
      return;
    }
    void decide({ status: "REJECTED", rejectionNote: rejectionNote.trim() });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonBlock}>
          <div className={styles.skeletonBar} style={{ width: "40%" }} />
          <div className={styles.skeletonBar} style={{ width: "65%" }} />
          <div className={styles.skeletonBar} style={{ width: "50%" }} />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.container}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/admin/makers")}
        >
          ← Back to makers
        </button>
        <div className={styles.errorBox} role="alert">
          <span>{loadError}</span>
          <button type="button" onClick={() => void load()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!maker) {
    return (
      <div className={styles.container}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/admin/makers")}
        >
          ← Back to makers
        </button>
        <div className={styles.emptyState}>
          <p>
            {resolved
              ? `Decision recorded: ${resolved}. This maker has left the review queue.`
              : "This maker is not in the pending queue. v1 has no admin endpoint for a maker who has already been reviewed."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate("/admin/makers")}
      >
        ← Back to makers
      </button>

      <div className={`${styles.card} ${styles.identityCard}`}>
        <div className={styles.identityTop}>
          <div>
            <h1 className={styles.makerName}>{maker.brandName}</h1>
            <p className={styles.makerId}>{shortId(maker.id)}</p>
          </div>
          <span className={styles.statusBadge} style={{ backgroundColor: "#f59e0b" }}>
            PENDING
          </span>
        </div>

        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <span>Contact</span>
            <strong>{maker.userEmail}</strong>
          </div>
          <div className={styles.metaItem}>
            <span>Location</span>
            <strong>{maker.location ?? "—"}</strong>
          </div>
          <div className={styles.metaItem}>
            <span>Batch range</span>
            <strong>
              {maker.minBatch ?? "?"}–{maker.maxBatch ?? "?"} units
            </strong>
          </div>
          <div className={styles.metaItem}>
            <span>Lead time</span>
            <strong>{maker.leadTimeDays ?? "?"} days</strong>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <span className={styles.sectionLabel}>SPECIALIZATIONS</span>
        {maker.specializations.length === 0 ? (
          <p className={styles.emptyNote}>None listed.</p>
        ) : (
          <div className={styles.specGrid}>
            {maker.specializations.map((spec) => (
              <span key={spec} className={styles.specTag}>
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>

      {resolved ? (
        <div className={styles.resolvedCard}>
          <p className={styles.resolvedText}>
            Decision recorded: <strong>{resolved}</strong>. The maker has been
            notified by email and left the review queue.
          </p>
        </div>
      ) : (
        <div className={`${styles.card} ${styles.actionCard}`}>
          {!rejecting ? (
            <>
              <h3 className={styles.sectionLabel}>DECISION</h3>
              <p className={styles.verifiedNote}>
                Approving makes this maker discoverable and able to receive
                briefs. Rejecting keeps them hidden and shows your note in their
                dashboard.
              </p>
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.approveBtn}
                  disabled={submitting}
                  onClick={() => void decide({ status: "VERIFIED" })}
                >
                  {submitting ? "Saving..." : "Approve maker"}
                </button>
                <button
                  type="button"
                  className={styles.rejectBtn}
                  disabled={submitting}
                  onClick={() => {
                    setFormError(null);
                    setRejecting(true);
                  }}
                >
                  Reject
                </button>
              </div>
            </>
          ) : (
            <div className={styles.rejectForm}>
              <h3 className={styles.rejectFormTitle}>Reject {maker.brandName}</h3>
              <p className={styles.rejectFormHint}>
                The note is stored on their profile and shown to them.
              </p>
              <textarea
                rows={4}
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="What needs to change before they can be approved?"
              />
              {formError && (
                <p className={styles.formError} role="alert">
                  {formError}
                </p>
              )}
              <div className={styles.rejectFormActions}>
                <button type="button" onClick={() => setRejecting(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.confirmRejectBtn}
                  disabled={submitting}
                  onClick={handleReject}
                >
                  {submitting ? "Rejecting..." : "Confirm rejection"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MakerDetail;
