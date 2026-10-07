import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./OrderView.module.css";
import { OrderStatus, ProductionOrder } from "../../types/order";
import { useOrder, ActionResult } from "../../hooks/useOrder";
import type { DeliverPayload, DisputeInput } from "../../services/orderService";
import { EscrowStatus } from "../../types/escrow";
import DeliveryProof from "./DeliveryProof";
import OrderViewSkeleton from "./OrderViewSkeleton";

/* ------------------------------------------------------------------ */

// const DISPUTE_CATEGORIES = [
//   { value: "QUALITY_MISMATCH", label: "Quality doesn't match the brief" },
//   { value: "NOT_DELIVERED", label: "Order not delivered" },
//   { value: "LATE_DELIVERY", label: "Delivered late" },
//   { value: "OTHER", label: "Other" },
// ];

/* ------------------------------------------------------------------ */
/* Dispute modal                                                       */
/* ------------------------------------------------------------------ */

// const DisputeModal = ({
//   onClose,
//   onSubmit,
// }: {
//   onClose: () => void;
//   onSubmit: (input: DisputeInput) => Promise<ActionResult>;
// }) => {
//   const [category, setCategory] = useState(DISPUTE_CATEGORIES[0].value);
//   const [explanation, setExplanation] = useState("");
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const close = () => {
//     if (!submitting) onClose();
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     if (!explanation.trim()) return setError("Please explain the problem.");

//     setSubmitting(true);
//     const result = await onSubmit({
//       reasonCategory: category,
//       explanation: explanation.trim(),
//     });
//     setSubmitting(false);

//     if (result.ok) onClose();
//     else setError(result.message);
//   };

//   return (
//     <div className={styles.modal} onClick={close}>
//       <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
//         <section className={styles.header}>
//           <p>Raise a Dispute</p>
//           <button type="button" onClick={close}>
//             X
//           </button>
//         </section>

//         <div>
//           <label htmlFor="reasonCategory">Reason</label>
//           <select
//             id="reasonCategory"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             {DISPUTE_CATEGORIES.map((c) => (
//               <option key={c.value} value={c.value}>
//                 {c.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="explanation">What went wrong?</label>
//           <textarea
//             id="explanation"
//             rows={4}
//             value={explanation}
//             onChange={(e) => setExplanation(e.target.value)}
//           />
//         </div>

//         {error && <p className={styles.error}>{error}</p>}

//         <section className={styles.actions}>
//           <button type="button" onClick={close} disabled={submitting}>
//             Cancel
//           </button>
//           <button type="submit" disabled={submitting}>
//             {submitting ? "Submitting..." : "Submit Dispute"}
//           </button>
//         </section>
//       </form>
//     </div>
//   );
// };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatCurrency = (amount: number): string =>
  `₦${amount.toLocaleString("en-NG")}`;

const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "AWAITING_PAYMENT":
      return "#f59e0b";
    case "IN_ESCROW":
      return "#3b82f6";
    case "IN_PRODUCTION":
      return "#8b5cf6";
    case "DELIVERED":
      return "#14b8a6";
    case "COMPLETED":
      return "#10b981";
    case "CANCELLED":
      return "#6b7280";
    case "DISPUTED":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

const getEscrowStatusColor = (status: EscrowStatus): string => {
  switch (status) {
    case "AWAITING":
      return "#6b7280";
    case "HELD":
      return "#3b82f6";
    case "RELEASED":
      return "#10b981";
    case "REFUNDED":
      return "#f97316";
    case "DISPUTED":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

const getStatusActionText = (order: ProductionOrder): string => {
  switch (order.status) {
    case "AWAITING_PAYMENT":
      return `Quote accepted. Buyer must pay ${formatCurrency(order.escrow.amountNgn)} into Brutige Escrow to lock specs.`;
    case "IN_ESCROW":
      return "Funds locked in Escrow. Mark production as started.";
    case "IN_PRODUCTION":
      return "Garments are being produced. Upload proof of delivery when complete.";
    case "DELIVERED":
      return "Batch delivered! Buyer has 7 days to inspect quality or dispute before auto-release.";
    case "COMPLETED":
      return `Order fully completed. ${formatCurrency(order.escrow.makerPayoutNgn)} net payout disbursed to ${order.makerName}.`;
    case "CANCELLED":
      return "Order cancelled. Escrow refunded or non-existent.";
    case "DISPUTED":
      return "Dispute active. Funds locked in escrow until Brutige Arbitrator resolves.";
    default:
      return "";
  }
};

const getEscrowNote = (order: ProductionOrder): string => {
  switch (order.escrow.status) {
    case "AWAITING":
      return "Waiting for the buyer's payment.";
    case "HELD":
      return `Funds locked in Escrow until delivery is confirmed.`;
    case "RELEASED":
      return `Funds released to ${order.makerName}.`;
    case "REFUNDED":
      return "Funds refunded to the buyer.";
    default:
      return "";
  }
};

const statuses = [
  "AWAITING_PAYMENT",
  "IN_ESCROW",
  "IN_PRODUCTION",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const OrderView = () => {
  const { orderId } = useParams();

  const { order, loading, loadError, pendingAction, reload, actions } =
    useOrder(orderId);

  const [selected, setSelected] = useState<"specs" | "finance">("specs");
  const [modal, setModal] = useState<null | "deliver" | "dispute">(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // a different source means different data, so clear stale UI state

  const track = async (
    fn: () => Promise<ActionResult>,
  ): Promise<ActionResult> => {
    setActionError(null);
    const result = await fn();
    if (!result.ok) setActionError(result.message);
    return result;
  };

  if (loading) {
    return (
      <OrderViewSkeleton />
      // <div className={styles.main}>
      //   <div className={styles.state}>
      //     <p>Loading order...</p>
      //   </div>
      // </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className={styles.main}>
        <div className={styles.state}>
          <p>{loadError ?? "Order not found."}</p>
          <button className={styles.retryButton} type="button" onClick={reload}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  const busy = pendingAction !== null;

  const getStatusActions = () => {
    switch (order.status) {
      case "AWAITING_PAYMENT":
        return (
          <>
            <button
              disabled={busy}
              style={{ background: "var(--brut-danger)" }}
              onClick={() => {
                if (window.confirm("Cancel this order?")) track(actions.cancel);
              }}
            >
              {pendingAction === "cancel" ? "Cancelling..." : "Cancel Order"}
            </button>
          </>
        );

      case "IN_ESCROW":
        return (
          <>
            <button
              disabled={busy}
              style={{ background: "var(--brut-bg)" }}
              onClick={() => track(actions.startProduction)}
            >
              {pendingAction === "startProduction"
                ? "Starting..."
                : "Start Production"}
            </button>
            <button
              disabled={busy}
              style={{ background: "var(--brut-danger)" }}
              // onClick={() => setModal("dispute")}
            >
              Raise Dispute
            </button>
          </>
        );

      case "IN_PRODUCTION":
        return (
          <button
            disabled={busy}
            style={{ background: "var(--brut-bg)" }}
            onClick={() => setModal("deliver")}
          >
            Mark as Delivered
          </button>
        );

      case "DELIVERED":
        return (
          <>
            <button
              disabled={busy}
              style={{ background: "var(--brut-bg)" }}
              onClick={() => track(actions.confirm)}
            >
              {pendingAction === "confirm"
                ? "Confirming..."
                : "Confirm Receipt"}
            </button>
            <button
              disabled={busy}
              style={{ background: "var(--brut-danger)" }}
              onClick={() => setModal("dispute")}
            >
              Raise Dispute
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.main}>
      {/* {devToggle} */}

      {modal === "deliver" && (
        <DeliveryProof
          onClose={() => setModal(null)}
          onSubmit={(payload) => track(() => actions.deliver(payload))}
        />
      )}
      {/* {modal === "dispute" && (
        <DisputeModal
          onClose={() => setModal(null)}
          onSubmit={(input) => track(() => actions.dispute(input))}
        />
      )} */}

      <div className={styles.container + " " + styles.prod}>
        <div className={styles.content}>
          <div>
            <div className={styles.header}>
              <p>ORDER ID: {order.id}</p>
              <div
                className={styles.orderStatus}
                style={{
                  background: getOrderStatusColor(order.status as OrderStatus),
                }}
              >
                <p>{order.status}</p>
              </div>
              <p>
                Brief: <span>{order.brief.id}</span>
              </p>
              <p>
                Quote: <span>{order.quote.id}</span>
              </p>
            </div>
            <h2 className={styles.prodName}>{order.garmentType}</h2>
            <p className={styles.ordDetails}>
              Ordered by <span>{order.buyer.displayName}</span> for production
              by <span>{order.makerName}</span>
            </p>
          </div>

          <div className={styles.orderDetail}>
            <div>
              <div className={styles.header}>
                <p>CONTRACT TOTAL</p>
              </div>
              <h3 className={styles.orderPrice}>
                {formatCurrency(order.escrow.amountNgn)}
              </h3>
            </div>

            <div>
              <div className={styles.header}>
                <p>TARGET DELIVERY</p>
              </div>
              <p className={styles.orderExpDelivery}>
                {order.expectedDelivery || "TBC"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <p>ORDER LIFECYCLE</p>
        <div className={styles.lifeCycle}>
          {statuses.map((status) => (
            <StatusCard key={status} order={order} status={status} />
          ))}
        </div>

        {actionError && (
          <div
            className={styles.banner + " " + styles.bannerError}
            role="alert"
            style={{ marginTop: 24 }}
          >
            <span>{actionError}</span>
            <button type="button" onClick={() => setActionError(null)}>
              Dismiss
            </button>
          </div>
        )}

        <div className={styles.statusAction}>
          <div className={styles.stack}>
            <p className={styles.head}>STATUS ACTION</p>
            <p>{getStatusActionText(order)}</p>
          </div>
          <div className={styles.actionButtons}>{getStatusActions()}</div>
        </div>
      </div>

      <div className={styles.container + " " + styles.escrow}>
        <div className={styles.header}>
          <div className={styles.stack}>
            <h3>Brutige Escrow Vault</h3>
            <p>{getEscrowNote(order)}</p>
          </div>

          <div className={styles.escrowStatus}>
            <p>ESCROW STATUS</p>
            <p
              style={{
                background: getEscrowStatusColor(
                  order.escrow.status as EscrowStatus,
                ),
              }}
              className={styles.status}
            >
              {order.escrow.status}
            </p>
          </div>
        </div>

        <div className={styles.escrowDetails}>
          <div>
            <p className={styles.head}>TOTAL HELD FROM BUYER</p>
            <h3>{formatCurrency(order.escrow.amountNgn)}</h3>
          </div>
          <div>
            <p className={styles.head}>BRUTIGE FEES (10%)</p>
            <h3>{formatCurrency(order.escrow.platformFeeNgn)}</h3>
          </div>
          <div>
            <p className={styles.head}>MAKER PAYOUT</p>
            <h3 style={{ color: "var(--brut-success)" }}>
              {formatCurrency(order.escrow.makerPayoutNgn)}
            </h3>
          </div>
        </div>
      </div>

      <div className={styles.container + " " + styles.garmentDesc}>
        <div className={styles.header}>
          <a
            onClick={() => setSelected("specs")}
            className={selected == "specs" ? styles.active : ""}
          >
            GARMENT SPECIFICATIONS
          </a>
          <a
            onClick={() => setSelected("finance")}
            className={selected == "finance" ? styles.active : ""}
          >
            FINANCIAL BREAKDOWN
          </a>
        </div>

        {selected == "specs" ? (
          <div className={styles.specs}>
            {order.brief.images.length > 0 && (
              <div className={styles.prodImage}>
                <img
                  src={order.brief.images[0].fileUrl}
                  alt={order.garmentType}
                />
              </div>
            )}

            <div className={styles.prodDetails}>
              <div>
                <p className={styles.head}>ITEM NAME</p>
                <p>{order.garmentType}</p>
              </div>
              <div>
                <p className={styles.head}>ORDER QUANTITY</p>
                <p>{order.quantity} Units</p>
              </div>
              <div>
                <p className={styles.head}>DESCRIPTION</p>
                <p className={styles.prodDesc}>
                  {order.brief.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.financeBreak}>
            <div className={styles.content}>
              <div>
                <p>Gross Contract Amount</p>
                <p style={{ color: "var(--brut-text)" }}>
                  {formatCurrency(order.escrow.amountNgn)}
                </p>
              </div>
              <div>
                <p>Brutige Commission (10%)</p>
                <p style={{ color: "var(--brut-warning)" }}>
                  -{formatCurrency(order.escrow.platformFeeNgn)}
                </p>
              </div>
              <div>
                <p style={{ color: "var(--brut-text)" }}>Net Maker Payment</p>
                <p style={{ color: "var(--brut-success)" }}>
                  {formatCurrency(order.escrow.makerPayoutNgn)}
                </p>
              </div>
            </div>

            <p style={{ color: "var(--brut-warning)" }}>
              * Funds are released automatically after 7 days from marked
              delivery, or immediately upon buyer manual confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusCard = ({
  status,
  order,
}: {
  status: string;
  order: ProductionOrder;
}) => {
  const isActive = status == order.status;
  return (
    <div className={styles.statusCard + (isActive ? " " + styles.active : "")}>
      <p className={styles.head}>{status}</p>
      <p>Buyer Payment</p>
    </div>
  );
};

export default OrderView;
