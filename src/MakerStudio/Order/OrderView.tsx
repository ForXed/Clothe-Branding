import { useParams } from "react-router-dom";
import { useState } from "react";
import styles from "./OrderView.module.css";
import { OrderStatus, ProductionOrder } from "../../types/order";
import { useOrder, ActionResult } from "../../hooks/useOrder";
import type { DeliverPayload } from "../../services/orderService"; // dispute removed
import { EscrowStatus } from "../../types/escrow";
import DeliveryProof from "./DeliveryProof";
import OrderViewSkeleton from "./OrderViewSkeleton";

/* ----------------------------- helpers ----------------------------- */

const formatCurrency = (amount: number): string =>
  `₦${amount.toLocaleString("en-NG")}`;

const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "AWAITING_PAYMENT": return "#f59e0b";
    case "IN_ESCROW":        return "#3b82f6";
    case "IN_PRODUCTION":    return "#8b5cf6";
    case "DELIVERED":        return "#14b8a6";
    case "COMPLETED":        return "#10b981";
    case "CANCELLED":        return "#6b7280";
    case "DISPUTED":         return "#ef4444";
    default:                 return "#6b7280";
  }
};

const getEscrowStatusColor = (status: EscrowStatus): string => {
  switch (status) {
    case "AWAITING":  return "#6b7280";
    case "HELD":      return "#3b82f6";
    case "RELEASED":  return "#10b981";
    case "REFUNDED":  return "#f97316";
    case "DISPUTED":  return "#ef4444";
    default:          return "#6b7280";
  }
};

// Informational copy from the MAKER's perspective (what they / the buyer must do).
const getStatusActionText = (order: ProductionOrder): string => {
  switch (order.status) {
    case "AWAITING_PAYMENT":
      return `Waiting on the buyer to fund escrow (${formatCurrency(order.escrow.amountNgn)}). Production can start once funds are held.`;
    case "IN_ESCROW":
      return "Funds are locked in escrow. Start production when you're ready.";
    case "IN_PRODUCTION":
      return "Garments are being produced. Upload delivery proof when the batch is handed over.";
    case "DELIVERED":
      return "Batch delivered. The buyer has 7 days to confirm receipt or raise a dispute before auto-release.";
    case "COMPLETED":
      return `Order complete. ${formatCurrency(order.escrow.makerPayoutNgn)} net payout released to you.`;
    case "CANCELLED":
      return "Order cancelled. No funds were released.";
    case "DISPUTED":
      return "Dispute active. Funds stay locked in escrow until Brutige arbitration resolves it.";
    default:
      return "";
  }
};

const getEscrowNote = (order: ProductionOrder): string => {
  switch (order.escrow.status) {
    case "AWAITING":  return "Waiting for the buyer's payment.";
    case "HELD":      return "Funds locked in escrow until the buyer confirms delivery.";
    case "RELEASED":  return "Funds released to you.";
    case "REFUNDED":  return "Funds refunded to the buyer.";
    default:          return "";
  }
};

const statuses = [
  "AWAITING_PAYMENT", "IN_ESCROW", "IN_PRODUCTION",
  "DELIVERED", "COMPLETED", "CANCELLED", "DISPUTED",
];

/* ------------------------------- page ------------------------------ */

const OrderView = () => {
  const { orderId } = useParams();

  const { order, loading, loadError, pendingAction, reload, actions } =
    useOrder(orderId);

  const [selected, setSelected] = useState<"specs" | "finance">("specs");
  const [modal, setModal] = useState<null | "deliver">(null); // maker has no dispute modal
  const [actionError, setActionError] = useState<string | null>(null);

  const track = async (fn: () => Promise<ActionResult>): Promise<ActionResult> => {
    setActionError(null);
    const result = await fn();
    if (!result.ok) setActionError(result.message);
    return result;
  };

  if (loading) return <OrderViewSkeleton />;

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

  // MAKER actions only. No cancel / confirm / dispute here — those are buyer-side.
  const getStatusActions = () => {
    switch (order.status) {
      case "IN_ESCROW":
        return (
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={busy}
            onClick={() => track(actions.startProduction)}
          >
            {pendingAction === "startProduction" ? "Starting..." : "Start Production"}
          </button>
        );

      case "IN_PRODUCTION":
        return (
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={busy}
            onClick={() => setModal("deliver")}
          >
            Mark as Delivered
          </button>
        );

      default:
        return null; // AWAITING_PAYMENT / DELIVERED / COMPLETED / CANCELLED / DISPUTED → maker waits
    }
  };

  return (
    <div className={styles.main}>
      {modal === "deliver" && (
        <DeliveryProof
          onClose={() => setModal(null)}
          onSubmit={(payload: DeliverPayload) => track(() => actions.deliver(payload))}
        />
      )}

      <div className={`${styles.container} ${styles.prod}`}>
        <div className={styles.content}>
          <div>
            <div className={styles.header}>
              <p>ORDER ID: {order.id}</p>
              <div
                className={styles.orderStatus}
                style={{ background: getOrderStatusColor(order.status as OrderStatus) }}
              >
                <p>{order.status}</p>
              </div>
              <p>Brief: <span>{order.brief.id}</span></p>
              <p>Quote: <span>{order.quote.id}</span></p>
            </div>
            <h2 className={styles.prodName}>{order.brief.garmentType}</h2>
            <p className={styles.ordDetails}>
              Ordered by <span>{order.buyer.displayName}</span> for production by{" "}
              <span>{order.maker.displayName}</span>
            </p>
          </div>

          <div className={styles.orderDetail}>
            <div>
              <div className={styles.header}><p>CONTRACT TOTAL</p></div>
              <h3 className={styles.orderPrice}>{formatCurrency(order.escrow.amountNgn)}</h3>
            </div>
            <div>
              <div className={styles.header}><p>TARGET DELIVERY</p></div>
              <p className={styles.orderExpDelivery}>{order.brief.deadline || "TBC"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <p className={styles.head}>ORDER LIFECYCLE</p>
        <div className={styles.lifeCycle}>
          {statuses.map((status) => (
            <StatusCard key={status} order={order} status={status} />
          ))}
        </div>

        {actionError && (
          <div className={`${styles.banner} ${styles.bannerError}`} role="alert" style={{ marginTop: 24 }}>
            <span>{actionError}</span>
            <button type="button" onClick={() => setActionError(null)}>Dismiss</button>
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

      <div className={`${styles.container} ${styles.escrow}`}>
        <div className={styles.header}>
          <div className={styles.stack}>
            <h3>Brutige Escrow Vault</h3>
            <p>{getEscrowNote(order)}</p>
          </div>
          <div className={styles.escrowStatus}>
            <p className={styles.head}>ESCROW STATUS</p>
            <p
              className={styles.status}
              style={{ background: getEscrowStatusColor(order.escrow.status as EscrowStatus) }}
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
            <p className={styles.head}>BRUTIGE FEES ({order.escrow.platformFeePercent}%)</p>
            <h3>{formatCurrency(order.escrow.feeAmountNgn)}</h3>
          </div>
          <div>
            <p className={styles.head}>MAKER PAYOUT</p>
            <h3 style={{ color: "var(--brut-success)" }}>{formatCurrency(order.escrow.makerPayoutNgn)}</h3>
          </div>
        </div>
      </div>

      <div className={`${styles.container} ${styles.garmentDesc}`}>
        <div className={styles.header}>
          <a onClick={() => setSelected("specs")} className={selected === "specs" ? styles.active : ""}>
            GARMENT SPECIFICATIONS
          </a>
          <a onClick={() => setSelected("finance")} className={selected === "finance" ? styles.active : ""}>
            FINANCIAL BREAKDOWN
          </a>
        </div>

        {selected === "specs" ? (
          <div className={styles.specs}>
            {order.brief.images.length > 0 && (
              <div className={styles.prodImage}>
                <img src={order.brief.images[0].fileUrl} alt={order.brief.garmentType} />
              </div>
            )}
            <div className={styles.prodDetails}>
              <div>
                <p className={styles.head}>ITEM NAME</p>
                <p>{order.brief.garmentType}</p>
              </div>
              <div>
                <p className={styles.head}>ORDER QUANTITY</p>
                <p>{order.brief.quantity} Units</p>
              </div>
              <div>
                <p className={styles.head}>DESCRIPTION</p>
                <p className={styles.prodDesc}>{order.brief.description || "No description provided."}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.financeBreak}>
            <div className={styles.content}>
              <div>
                <p>Gross Contract Amount</p>
                <p style={{ color: "var(--brut-text)" }}>{formatCurrency(order.escrow.amountNgn)}</p>
              </div>
              <div>
                <p>Brutige Commission ({order.escrow.platformFeePercent}%)</p>
                <p style={{ color: "var(--brut-warning)" }}>-{formatCurrency(order.escrow.feeAmountNgn)}</p>
              </div>
              <div>
                <p style={{ color: "var(--brut-text)" }}>Net Maker Payment</p>
                <p style={{ color: "var(--brut-success)" }}>{formatCurrency(order.escrow.makerPayoutNgn)}</p>
              </div>
            </div>
            <p style={{ color: "var(--brut-warning)" }}>
              * Funds release automatically 7 days after you mark delivery, or immediately when the buyer confirms receipt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusCard = ({ status, order }: { status: string; order: ProductionOrder }) => {
  const isActive = status === order.status;
  return (
    <div className={`${styles.statusCard} ${isActive ? styles.active : ""}`}>
      <p className={styles.head}>{status.replace(/_/g, " ")}</p>
    </div>
  );
};

export default OrderView;