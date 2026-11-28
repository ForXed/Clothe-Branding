// src/Admin/Disputes/DisputeDetail.tsx
// One disputed order: what was ordered, who is involved, what the escrow holds,
// why the dispute was opened (the DISPUTE_OPENED event), and the two things an
// admin can do about it — release to the maker or refund the buyer.

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { getErrorMessage } from "../../utils/apiError";
import type { DisputeRecord, ResolutionAction } from "../../types/admin";
import styles from "./DisputeDetail.module.css";

const shortId = (id?: string | null) =>
  id ? id.slice(0, 8) : "—";

const formatDate = (iso?: string | null): string =>
  iso
    ? new Date(iso).toLocaleString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const formatCurrency = (amount?: number | null): string =>
  typeof amount === "number"
    ? `₦${amount.toLocaleString("en-NG")}`
    : "—";

const DisputeDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<DisputeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [action, setAction] = useState<ResolutionAction>("RELEASE");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const requestId = useRef(0);

  const load = useCallback(async () => {
    if (!orderId) return;
    const current = ++requestId.current;
    setLoading(true);
    setLoadError(null);

    try {
      const data = await adminService.getDispute(orderId);
      if (current !== requestId.current) return;
      setRecord(data);
      setDone(data.order.status !== "DISPUTED");
    } catch (err) {
      if (current !== requestId.current) return;
      setLoadError(getErrorMessage(err, "Failed to load this dispute."));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
    return () => {
      requestId.current += 1;
    };
  }, [load]);

  const submit = async () => {
    if (!orderId || !record) return;

    if (!note.trim()) {
      setFormError("A note is required: both parties will see it.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      await adminService.resolveOrder(orderId, {
        resolution: action,
        note: note.trim(),
      });
      setDone(true);
      setNote("");
      await load();
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to resolve this dispute."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonBlock}>
          <div className={styles.skeletonBar} style={{ width: "35%" }} />
          <div className={styles.skeletonBar} style={{ width: "70%" }} />
          <div className={styles.skeletonBar} style={{ width: "55%" }} />
        </div>
      </div>
    );
  }

  if (loadError || !record) {
    return (
      <div className={styles.container}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/admin/disputes")}
        >
          ← Back to disputes
        </button>
        <div className={styles.errorBox} role="alert">
          <span>{loadError ?? "This dispute could not be loaded."}</span>
          <button type="button" onClick={() => void load()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { order, reason, raisedAt } = record;
  const escrow = order.escrow;

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate("/admin/disputes")}
      >
        ← Back to disputes
      </button>

      <div className={`${styles.card} ${styles.disputeHeaderCard}`}>
        <div className={styles.disputeHeaderTop}>
          <div>
            <h2 className={styles.disputeTitle}>Order #{shortId(order.id)}</h2>
            <p className={styles.disputeSubtitle}>
              {order.brief?.garmentType ?? "Order"}{" "}
              {order.brief?.quantity ? `× ${order.brief.quantity}` : ""} · opened{" "}
              {formatDate(raisedAt)}
            </p>
          </div>
          <span
            className={styles.disputeStatusBadge}
            style={{ backgroundColor: "#ef4444" }}
          >
            {order.status}
          </span>
        </div>

        <div className={styles.evidenceGrid}>
          <div className={styles.evidenceItem}>
            <span className={styles.evidenceLabel}>Buyer</span>
            <span className={styles.evidenceValue}>
              {order.buyer?.displayName ?? shortId(order.buyer?.id)}
            </span>
          </div>
          <div className={styles.evidenceItem}>
            <span className={styles.evidenceLabel}>Maker</span>
            <span className={styles.evidenceValue}>
              {order.maker?.displayName ?? shortId(order.maker?.id)}
            </span>
          </div>
          <div className={styles.evidenceItem}>
            <span className={styles.evidenceLabel}>Quote</span>
            <span className={styles.evidenceValue}>
              {formatCurrency(order.quote?.priceNgn)} ·{" "}
              {order.quote?.timelineDays ?? "—"} days
            </span>
          </div>
          <div className={styles.evidenceItem}>
            <span className={styles.evidenceLabel}>Delivered</span>
            <span className={styles.evidenceValue}>
              {formatDate(order.deliveredAt)}
            </span>
          </div>
        </div>

        <div className={styles.explanationBlock}>
          <span className={styles.sectionLabel}>WHY IT WAS OPENED</span>
          <p className={styles.explanationText}>{reason}</p>
        </div>
      </div>

      <div className={`${styles.card} ${styles.escrowCard}`}>
        <div className={styles.escrowHeader}>
          <h3 className={styles.escrowTitle}>Escrow</h3>
          <span className={styles.escrowBadge}>
            {escrow?.status ?? "no escrow"}
          </span>
        </div>
        <div className={styles.escrowGrid}>
          <div className={styles.escrowItem}>
            <span className={styles.escrowItemLabel}>Held</span>
            <span className={styles.escrowItemValue}>
              {formatCurrency(escrow?.amountNgn)}
            </span>
          </div>
          <div className={styles.escrowItem}>
            <span className={styles.escrowItemLabel}>Platform fee</span>
            <span className={styles.escrowItemValue}>
              {formatCurrency(escrow?.feeAmountNgn)}
            </span>
          </div>
          <div className={styles.escrowItem}>
            <span className={styles.escrowItemLabel}>Maker payout</span>
            <span className={styles.escrowItemValue}>
              {formatCurrency(escrow?.makerPayoutNgn)}
            </span>
          </div>
          <div className={styles.escrowItem}>
            <span className={styles.escrowItemLabel}>Paid</span>
            <span className={styles.escrowItemValue}>
              {formatDate(escrow?.paidAt)}
            </span>
          </div>
        </div>
      </div>

      {done ? (
        <div className={styles.resolvedNotice}>
          <p>
            This order is <strong>{order.status}</strong>, so there is nothing
            left to resolve.
          </p>
        </div>
      ) : (
        <div className={`${styles.card} ${styles.formCard}`}>
          <div className={styles.resolutionForm}>
            <h3 className={styles.formTitle}>Resolve</h3>
            <p className={styles.formHint}>
              Releasing pays the maker and completes the order. Refunding returns
              the money to the buyer and cancels it. Either way the note is
              written into the order's event trail.
            </p>

            <div className={styles.actionGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="resolution"
                  checked={action === "RELEASE"}
                  onChange={() => setAction("RELEASE")}
                />
                <span className={styles.radioText}>
                  <strong>Release to maker</strong>
                  <span className={styles.radioSub}>
                    {formatCurrency(escrow?.makerPayoutNgn)} payout, order
                    COMPLETED
                  </span>
                </span>
              </label>

              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="resolution"
                  checked={action === "REFUND"}
                  onChange={() => setAction("REFUND")}
                />
                <span className={styles.radioText}>
                  <strong>Refund the buyer</strong>
                  <span className={styles.radioSub}>
                    {formatCurrency(escrow?.amountNgn)} returned, order CANCELLED
                  </span>
                </span>
              </label>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="resolution-note">Note for both parties</label>
              <textarea
                id="resolution-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What did you decide, and why?"
              />
            </div>

            {formError && (
              <p className={styles.formError} role="alert">
                {formError}
              </p>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.submitBtn}
                onClick={() => void submit()}
                disabled={submitting}
              >
                {submitting ? "Resolving..." : "Resolve dispute"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeDetail;
