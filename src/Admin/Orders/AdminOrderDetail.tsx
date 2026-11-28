// src/Admin/Orders/AdminOrderDetail.tsx
// Read-only view of one order for an admin: the parties, the money, the state
// and the event trail. There is no admin-specific order endpoint in v1 — an
// admin is a participant on the order, so GET /api/v1/orders/{id} answers, and
// the events come from GET /api/v1/orders/{id}/events.

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { orderService } from "../../services/orderService";
import { getErrorMessage } from "../../utils/apiError";
import type { OrderEvent, ProductionOrder } from "../../types/order";
import styles from "./OrderList.module.css";

const shortId = (value?: string | null) => (value ? value.slice(0, 8) : "—");

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
  typeof amount === "number" ? `₦${amount.toLocaleString("en-NG")}` : "—";

const AdminOrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<ProductionOrder | null>(null);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  const load = useCallback(async () => {
    if (!orderId) return;
    const current = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.getOrder(orderId);
      if (current !== requestId.current) return;
      setOrder(data);

      const trail = await orderService.getOrderEvents(orderId).catch(() => []);
      if (current !== requestId.current) return;
      setEvents(trail);
    } catch (err) {
      if (current !== requestId.current) return;
      setError(getErrorMessage(err, "Failed to load this order."));
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonList}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonBar} style={{ width: "35%" }} />
              <div className={styles.skeletonBar} style={{ width: "60%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.container}>
        <button
          type="button"
          className={styles.filterBtn}
          onClick={() => navigate("/admin/orders")}
        >
          ← Back to orders
        </button>
        <div className={styles.errorBox} role="alert">
          <span>{error ?? "This order could not be loaded."}</span>
          <button type="button" onClick={() => void load()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const escrow = order.escrow;

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.filterBtn}
        onClick={() => navigate("/admin/orders")}
      >
        ← Back to orders
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>Order #{shortId(order.id)}</h1>
        <p className={styles.subtitle}>
          {order.brief?.garmentType ?? "Order"}
          {order.brief?.quantity ? ` × ${order.brief.quantity}` : ""} · placed{" "}
          {formatDate(order.createdAt)}
        </p>
      </div>

      <div className={styles.summaryBar}>
        <strong>{order.status}</strong>
        <div className={styles.parties}>
          <span className={styles.partyLabel}>Buyer</span>
          <span className={styles.partyName}>
            {order.buyer?.displayName ?? shortId(order.buyer?.id)}
          </span>
          <span className={styles.partySep}>·</span>
          <span className={styles.partyLabel}>Maker</span>
          <span className={styles.partyName}>
            {order.maker?.displayName ?? shortId(order.maker?.id)}
          </span>
        </div>
        {order.status === "DISPUTED" && (
          <button
            type="button"
            className={styles.filterBtnActive}
            onClick={() => navigate(`/admin/disputes/${order.id}`)}
          >
            Resolve dispute →
          </button>
        )}
      </div>

      <div className={styles.summaryBar}>
        <strong>Money</strong>
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            Quote
            <strong>{formatCurrency(order.quote?.priceNgn)}</strong>
          </div>
          <div className={styles.metaItem}>
            Escrow held
            <strong>{formatCurrency(escrow?.amountNgn)}</strong>
          </div>
          <div className={styles.metaItem}>
            Platform fee
            <strong>{formatCurrency(escrow?.feeAmountNgn)}</strong>
          </div>
          <div className={styles.metaItem}>
            Maker payout
            <strong>{formatCurrency(escrow?.makerPayoutNgn)}</strong>
          </div>
          <div className={styles.metaItem}>
            Escrow status
            <strong>{escrow?.status ?? "—"}</strong>
          </div>
        </div>
      </div>

      <div className={styles.summaryBar}>
        <strong>Timeline</strong>
        {events.length === 0 ? (
          <p className={styles.emptyState}>
            <p>No events recorded for this order.</p>
          </p>
        ) : (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.eventType}</strong>
                {event.fromStatus && event.toStatus
                  ? ` · ${event.fromStatus} → ${event.toStatus}`
                  : ""}{" "}
                — {formatDate(event.createdAt)}
                {event.actorId ? "" : " (system)"}
                {event.note ? ` · ${event.note}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetail;
