// src/Admin/Disputes/DisputeDetail.tsx
// Brutige Admin — single dispute resolution screen.
// Shows full evidence trail + escrow breakdown + resolution actions.
// Wired to adminService.getDisputeDetail + resolveDispute + updateDisputeStatus.

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type FormEvent,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { getErrorMessage, getErrorStatus } from "../../utils/apiError";
import type {
  DisputeRecord,
  DisputeStatus,
  ResolveDisputeInput,
} from "../../types/admin";
import type { EscrowStatus } from "../../types/escrow";
import styles from "./DisputeDetail.module.css";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const DISPUTE_STATUS_COLORS: Record<DisputeStatus, string> = {
  OPEN: "#f59e0b",
  UNDER_REVIEW: "#3b82f6",
  ESCALATED: "#ef4444",
  RESOLVED_RELEASED: "#10b981",
  RESOLVED_REFUNDED: "#f97316",
  RESOLVED_PARTIAL: "#8b5cf6",
};

const REASON_LABELS: Record<string, string> = {
  QUALITY_MISMATCH: "Quality doesn't match the brief",
  NOT_DELIVERED: "Order not delivered",
  LATE_DELIVERY: "Delivered late",
  OTHER: "Other",
};

const ESCROW_STATUS_COLORS: Record<EscrowStatus, string> = {
  AWAITING: "#6b7280",
  HELD: "#3b82f6",
  RELEASED: "#10b981",
  REFUNDED: "#f97316",
  DISPUTED: "#ef4444",
};

const formatCurrency = (n: number): string =>
  `₦${n.toLocaleString("en-NG")}`;

const formatDate = (iso: string | null | undefined): string => {
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

const isResolved = (status: DisputeStatus): boolean =>
  status.startsWith("RESOLVED_");

/* ------------------------------------------------------------------ */
/* Resolution form                                                     */
/* ------------------------------------------------------------------ */

const ResolutionForm = ({
  escrowAmount,
  onCancel,
  onSubmit,
  submitting,
}: {
  escrowAmount: number;
  onCancel: () => void;
  onSubmit: (input: ResolveDisputeInput) => void;
  submitting: boolean;
}) => {
  const [action, setAction] = useState<ResolveDisputeInput["action"]>(
    "RELEASE_TO_MAKER",
  );
  const [releaseAmount, setReleaseAmount] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleReleaseChange = (val: string) => {
    setReleaseAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= escrowAmount) {
      setRefundAmount(String(escrowAmount - num));
    }
  };

  const handleRefundChange = (val: string) => {
    setRefundAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= escrowAmount) {
      setReleaseAmount(String(escrowAmount - num));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!note.trim()) {
      setError("A resolution note is required. Both parties will see this.");
      return;
    }

    if (action === "PARTIAL") {
      const r = parseFloat(releaseAmount);
      const f = parseFloat(refundAmount);

      if (isNaN(r) || isNaN(f) || r < 0 || f < 0) {
        setError("Both amounts must be valid positive numbers.");
        return;
      }

      if (Math.abs(r + f - escrowAmount) > 0.01) {
        setError(
          `Release (${formatCurrency(r)}) + Refund (${formatCurrency(
            f,
          )}) must equal the escrow total (${formatCurrency(escrowAmount)}).`,
        );
        return;
      }
    }

    const input: ResolveDisputeInput = {
      action,
      resolutionNote: note.trim(),
      ...(action === "PARTIAL" && {
        releaseAmountNgn: parseFloat(releaseAmount),
        refundAmountNgn: parseFloat(refundAmount),
      }),
    };

    onSubmit(input);
  };

  return (
    <form className={styles.resolutionForm} onSubmit={handleSubmit}>
      <p className={styles.formTitle}>Determine Resolution</p>
      <p className={styles.formHint}>
        Escrow total: <strong>{formatCurrency(escrowAmount)}</strong>. This
        action is irreversible once submitted.
      </p>

      {/* Action selector */}
      <div className={styles.actionGroup}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="action"
            value="RELEASE_TO_MAKER"
            checked={action === "RELEASE_TO_MAKER"}
            onChange={() => setAction("RELEASE_TO_MAKER")}
            disabled={submitting}
          />
          <span className={styles.radioText}>
            <strong>Release to Maker</strong>
            <span className={styles.radioSub}>
              Full escrow ({formatCurrency(escrowAmount)}) released. Order
              moves to COMPLETED.
            </span>
          </span>
        </label>

        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="action"
            value="REFUND_TO_BRAND"
            checked={action === "REFUND_TO_BRAND"}
            onChange={() => setAction("REFUND_TO_BRAND")}
            disabled={submitting}
          />
          <span className={styles.radioText}>
            <strong>Refund to Brand</strong>
            <span className={styles.radioSub}>
              Full escrow ({formatCurrency(escrowAmount)}) refunded. Order
              moves to CANCELLED.
            </span>
          </span>
        </label>

        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="action"
            value="PARTIAL"
            checked={action === "PARTIAL"}
            onChange={() => setAction("PARTIAL")}
            disabled={submitting}
          />
          <span className={styles.radioText}>
            <strong>Partial Split</strong>
            <span className={styles.radioSub}>
              Divide escrow between maker payout and brand refund. Amounts must
              sum to {formatCurrency(escrowAmount)}.
            </span>
          </span>
        </label>
      </div>

      {/* Partial amount inputs */}
      {action === "PARTIAL" && (
        <div className={styles.partialInputs}>
          <div className={styles.inputGroup}>
            <label htmlFor="releaseAmt">Release to Maker (₦)</label>
            <input
              id="releaseAmt"
              type="number"
              min={0}
              max={escrowAmount}
              step={100}
              value={releaseAmount}
              onChange={(e) => handleReleaseChange(e.target.value)}
              disabled={submitting}
              placeholder={String(escrowAmount)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="refundAmt">Refund to Brand (₦)</label>
            <input
              id="refundAmt"
              type="number"
              min={0}
              max={escrowAmount}
              step={100}
              value={refundAmount}
              onChange={(e) => handleRefundChange(e.target.value)}
              disabled={submitting}
              placeholder={String(escrowAmount)}
            />
          </div>

          <p className={styles.partialSum}>
            Sum:{" "}
            <strong>
              {formatCurrency(
                (parseFloat(releaseAmount) || 0) +
                  (parseFloat(refundAmount) || 0),
              )}
            </strong>{" "}
            / {formatCurrency(escrowAmount)}
          </p>
        </div>
      )}

      {/* Resolution note */}
      <div className={styles.inputGroup}>
        <label htmlFor="resNote">
          Resolution Note (visible to both parties)
        </label>
        <textarea
          id="resNote"
          rows={4}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            if (error) setError("");
          }}
          disabled={submitting}
          placeholder="Explain the determination and reasoning. Both the brand and maker will see this note."
        />
      </div>

      {error && <p className={styles.formError}>{error}</p>}

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Confirm Resolution"}
        </button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Evidence section                                                    */
/* ------------------------------------------------------------------ */

const EvidenceSection = ({ dispute }: { dispute: DisputeRecord }) => {
  const { order } = dispute;

  return (
    <section className={styles.card}>
      <p className={styles.sectionLabel}>DISPUTE EVIDENCE</p>

      <div className={styles.evidenceGrid}>
        <div className={styles.evidenceItem}>
          <p className={styles.evidenceLabel}>Reason Category</p>
          <p className={styles.evidenceValue}>
            {REASON_LABELS[dispute.reasonCategory] ?? dispute.reasonCategory}
          </p>
        </div>

        <div className={styles.evidenceItem}>
          <p className={styles.evidenceLabel}>Raised By</p>
          <p className={styles.evidenceValue}>
            {dispute.raisedBy === "BUYER"
              ? `Brand — ${order.buyer.displayName}`
              : `Maker — ${order.maker.displayName}`}
          </p>
        </div>

        <div className={styles.evidenceItem}>
          <p className={styles.evidenceLabel}>Raised At</p>
          <p className={styles.evidenceValue}>{formatDate(dispute.raisedAt)}</p>
        </div>

        <div className={styles.evidenceItem}>
          <p className={styles.evidenceLabel}>Order Status</p>
          <p className={styles.evidenceValue}>{order.status}</p>
        </div>
      </div>

      <div className={styles.explanationBlock}>
        <p className={styles.evidenceLabel}>Explanation</p>
        <p className={styles.explanationText}>{dispute.explanation}</p>
      </div>

      {/* Brief reference images if available */}
      {order.brief?.images && order.brief.images.length > 0 && (
        <div className={styles.proofSection}>
          <p className={styles.evidenceLabel}>Brief Reference Images</p>
          <div className={styles.proofGrid}>
            {order.brief.images.slice(0, 6).map((img, i) => (
              <div key={i} className={styles.proofThumb}>
                <img src={img.fileUrl} alt={`Reference ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Order summary section                                               */
/* ------------------------------------------------------------------ */

const OrderSummary = ({ dispute }: { dispute: DisputeRecord }) => {
  const { order } = dispute;

  return (
    <section className={styles.card}>
      <p className={styles.sectionLabel}>ORDER RECORD</p>

      <div className={styles.orderHeader}>
        <div>
          <h3 className={styles.orderTitle}>{order.brief.garmentType}</h3>
          <p className={styles.orderId}>
            Order #{shortId(order.id)} • Brief #{shortId(order.brief.id)} •
            Quote #{shortId(order.quote.id)}
          </p>
        </div>

        <span
          className={styles.orderStatusBadge}
          style={{
            backgroundColor:
              order.status === "DISPUTED" ? "#ef4444" : "#6b7280",
          }}
        >
          {order.status}
        </span>
      </div>

      <div className={styles.partiesRow}>
        <div className={styles.partyBlock}>
          <p className={styles.partyLabel}>BRAND / BUYER</p>
          <p className={styles.partyName}>{order.buyer.displayName}</p>
          <p className={styles.partyId}>ID: {shortId(order.buyer.id)}</p>
        </div>

        <span className={styles.partySep}>↔</span>

        <div className={styles.partyBlock}>
          <p className={styles.partyLabel}>MAKER</p>
          <p className={styles.partyName}>{order.maker.displayName}</p>
          <p className={styles.partyId}>ID: {shortId(order.maker.id)}</p>
        </div>
      </div>

      <div className={styles.briefDetails}>
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Quantity</p>
          <p className={styles.detailValue}>{order.brief.quantity} units</p>
        </div>

        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Deadline</p>
          <p className={styles.detailValue}>
            {order.brief.deadline || "TBC"}
          </p>
        </div>

        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Created</p>
          <p className={styles.detailValue}>{formatDate(order.createdAt)}</p>
        </div>

        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Delivered</p>
          <p className={styles.detailValue}>{formatDate(order.deliveredAt)}</p>
        </div>
      </div>

      {order.brief.description && (
        <div className={styles.descBlock}>
          <p className={styles.detailLabel}>Description</p>
          <p className={styles.descText}>{order.brief.description}</p>
        </div>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Escrow breakdown section                                            */
/* ------------------------------------------------------------------ */

const EscrowSection = ({ dispute }: { dispute: DisputeRecord }) => {
  const { order } = dispute;
  const escrow = order.escrow;

  return (
    <section className={`${styles.card} ${styles.escrowCard}`}>
      <p className={styles.sectionLabel}>ESCROW BREAKDOWN</p>

      <div className={styles.escrowHeader}>
        <div>
          <p className={styles.escrowTitle}>Brutige Escrow Vault</p>
          <p className={styles.escrowNote}>
            Funds are locked pending dispute resolution.
          </p>
        </div>

        <div className={styles.escrowStatusBlock}>
          <p className={styles.escrowStatusLabel}>ESCROW STATUS</p>
          <span
            className={styles.escrowBadge}
            style={{
              backgroundColor:
                ESCROW_STATUS_COLORS[escrow.status as EscrowStatus] ??
                "#6b7280",
            }}
          >
            {escrow.status}
          </span>
        </div>
      </div>

      <div className={styles.escrowGrid}>
        <div className={styles.escrowItem}>
          <p className={styles.escrowItemLabel}>TOTAL HELD</p>
          <p className={styles.escrowItemValue}>
            {formatCurrency(escrow.amountNgn)}
          </p>
        </div>

        <div className={styles.escrowItem}>
          <p className={styles.escrowItemLabel}>
            BRUTIGE FEES ({escrow.platformFeePercent}%)
          </p>
          <p className={styles.escrowItemValue}>
            {formatCurrency(escrow.feeAmountNgn)}
          </p>
        </div>

        <div className={styles.escrowItem}>
          <p className={styles.escrowItemLabel}>MAKER PAYOUT</p>
          <p
            className={styles.escrowItemValue}
            style={{ color: "var(--brut-success, #10b981)" }}
          >
            {formatCurrency(escrow.makerPayoutNgn)}
          </p>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Resolution history (if already resolved)                            */
/* ------------------------------------------------------------------ */

const ResolutionHistory = ({ dispute }: { dispute: DisputeRecord }) => {
  if (!dispute.resolutionNote && !dispute.resolvedAt) return null;

  return (
    <section className={`${styles.card} ${styles.historyCard}`}>
      <p className={styles.sectionLabel}>RESOLUTION RECORD</p>

      <div className={styles.historyGrid}>
        <div className={styles.historyItem}>
          <p className={styles.historyLabel}>Status</p>
          <span
            className={styles.historyBadge}
            style={{
              backgroundColor: DISPUTE_STATUS_COLORS[dispute.status],
            }}
          >
            {dispute.status.replace(/_/g, " ")}
          </span>
        </div>

        <div className={styles.historyItem}>
          <p className={styles.historyLabel}>Resolved At</p>
          <p className={styles.historyValue}>{formatDate(dispute.resolvedAt)}</p>
        </div>

        <div className={styles.historyItem}>
          <p className={styles.historyLabel}>Resolved By</p>
          <p className={styles.historyValue}>
            {dispute.resolvedBy ? shortId(dispute.resolvedBy) : "—"}
          </p>
        </div>
      </div>

      {dispute.resolutionNote && (
        <div className={styles.resolutionNoteBlock}>
          <p className={styles.historyLabel}>Resolution Note</p>
          <p className={styles.resolutionNoteText}>
            {dispute.resolutionNote}
          </p>
        </div>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const DisputeDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [dispute, setDispute] = useState<DisputeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const requestId = useRef(0);

  const fetchDispute = useCallback(async () => {
    if (!orderId) return;

    const current = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.getDisputeDetail(orderId);
      if (current !== requestId.current) return;
      setDispute(data);
    } catch (err) {
      if (current !== requestId.current) return;
      setError(getErrorMessage(err, "Failed to load dispute."));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void fetchDispute();

    return () => {
      requestId.current += 1;
    };
  }, [fetchDispute]);

  /* ---------------------------------------------------------------- */
  /* Status transitions                                                */
  /* ---------------------------------------------------------------- */

  const handleMarkUnderReview = async () => {
    if (!orderId || !dispute) return;

    setSubmitting(true);
    setActionError(null);

    try {
      await adminService.updateDisputeStatus(orderId, "UNDER_REVIEW");
      await fetchDispute();
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to update status."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEscalate = async () => {
    if (!orderId || !dispute) return;

    if (
      !window.confirm(
        "Escalate this dispute? This flags it for senior review.",
      )
    ) {
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      await adminService.updateDisputeStatus(orderId, "ESCALATED");
      await fetchDispute();
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to escalate."));
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Resolution submission                                             */
  /* ---------------------------------------------------------------- */

  const handleResolve = async (input: ResolveDisputeInput) => {
    if (!dispute) return;

    setSubmitting(true);
    setActionError(null);

    try {
      await adminService.resolveDispute(dispute.orderId, input);
      setShowResolutionForm(false);
      await fetchDispute();
    } catch (err) {
      const status = getErrorStatus(err);

      if (status === 409) {
        // Already resolved or state changed.
        await fetchDispute();
      }

      setActionError(
        getErrorMessage(err, "Failed to submit resolution."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Loading state                                                     */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className={styles.container}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/admin/disputes")}
        >
          ← Back to Disputes
        </button>

        <div className={styles.skeletonBlock}>
          <div
            className={styles.skeletonBar}
            style={{ width: "40%", height: 28 }}
          />
          <div
            className={styles.skeletonBar}
            style={{ width: "60%", height: 16 }}
          />
          <div
            className={styles.skeletonBar}
            style={{ width: "100%", height: 140 }}
          />
          <div
            className={styles.skeletonBar}
            style={{ width: "100%", height: 100 }}
          />
          <div
            className={styles.skeletonBar}
            style={{ width: "80%", height: 16 }}
          />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Error / not found                                                 */
  /* ---------------------------------------------------------------- */

  if (error && !dispute) {
    return (
      <div className={styles.container}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/admin/disputes")}
        >
          ← Back to Disputes
        </button>

        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => void fetchDispute()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className={styles.container}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/admin/disputes")}
        >
          ← Back to Disputes
        </button>

        <div className={styles.emptyState}>
          <p>Dispute record not found.</p>
        </div>
      </div>
    );
  }

  const resolved = isResolved(dispute.status);
  const canAct = !resolved;
  const showResolveButton = canAct && !showResolutionForm;

  /* ---------------------------------------------------------------- */
  /* Main render                                                       */
  /* ---------------------------------------------------------------- */

  return (
    <div className={styles.container}>
      {/* Back nav */}
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate("/admin/disputes")}
      >
        ← Back to Disputes
      </button>

      {/* Action error banner */}
      {actionError && (
        <div className={styles.errorBox} role="alert">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError(null)}>
            Dismiss
          </button>
        </div>
      )}

      {/* ─── Dispute header ─── */}
      <section className={`${styles.card} ${styles.disputeHeaderCard}`}>
        <div className={styles.disputeHeaderTop}>
          <div>
            <h2 className={styles.disputeTitle}>
              Dispute — Order #{shortId(dispute.orderId)}
            </h2>
            <p className={styles.disputeSubtitle}>
              {dispute.order.brief.garmentType} •{" "}
              {formatCurrency(dispute.order.escrow.amountNgn)} in escrow
            </p>
          </div>

          <span
            className={styles.disputeStatusBadge}
            style={{
              backgroundColor: DISPUTE_STATUS_COLORS[dispute.status],
            }}
          >
            {dispute.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* Status transition buttons */}
        {canAct && (
          <div className={styles.transitionRow}>
            {dispute.status === "OPEN" && (
              <>
                <button
                  type="button"
                  className={styles.transitionBtn}
                  onClick={handleMarkUnderReview}
                  disabled={submitting}
                >
                  Mark as Under Review
                </button>

                {showResolveButton && (
                  <button
                    type="button"
                    className={styles.resolveTriggerBtn}
                    onClick={() => setShowResolutionForm(true)}
                    disabled={submitting}
                  >
                    Determine Resolution
                  </button>
                )}
              </>
            )}

            {dispute.status === "UNDER_REVIEW" && (
              <>
                <button
                  type="button"
                  className={styles.transitionBtn}
                  onClick={handleEscalate}
                  disabled={submitting}
                >
                  Escalate
                </button>

                {showResolveButton && (
                  <button
                    type="button"
                    className={styles.resolveTriggerBtn}
                    onClick={() => setShowResolutionForm(true)}
                    disabled={submitting}
                  >
                    Determine Resolution
                  </button>
                )}
              </>
            )}

            {dispute.status === "ESCALATED" && showResolveButton && (
              <button
                type="button"
                className={styles.resolveTriggerBtn}
                onClick={() => setShowResolutionForm(true)}
                disabled={submitting}
              >
                Determine Resolution
              </button>
            )}
          </div>
        )}

        {/* Already resolved notice */}
        {resolved && (
          <div className={styles.resolvedNotice}>
            <p>
              ✓ This dispute has been resolved. No further action required.
            </p>
          </div>
        )}
      </section>

      {/* ─── Resolution form (inline, shown on demand) ─── */}
      {canAct && showResolutionForm && (
        <section className={`${styles.card} ${styles.formCard}`}>
          <ResolutionForm
            escrowAmount={dispute.order.escrow.amountNgn}
            onCancel={() => setShowResolutionForm(false)}
            onSubmit={handleResolve}
            submitting={submitting}
          />
        </section>
      )}

      {/* ─── Evidence ─── */}
      <EvidenceSection dispute={dispute} />

      {/* ─── Order record ─── */}
      <OrderSummary dispute={dispute} />

      {/* ─── Escrow breakdown ─── */}
      <EscrowSection dispute={dispute} />

      {/* ─── Resolution history (if resolved) ─── */}
      {resolved && <ResolutionHistory dispute={dispute} />}
    </div>
  );
};

export default DisputeDetail;