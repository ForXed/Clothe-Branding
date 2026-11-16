// src/Admin/Orders/OrderList.tsx
// Brutige Admin — order monitoring list.
// Read-only view of all orders across statuses.
// DISPUTED orders link into /admin/disputes/:orderId.
// Wired to adminService.getOrders.

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { getErrorMessage } from "../../utils/apiError";
import type { OrderStatus, ProductionOrder } from "../../types/order";
import type { EscrowStatus } from "../../types/escrow";
import styles from "./OrderList.module.css";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STATUS_FILTERS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "AWAITING_PAYMENT", label: "Awaiting Payment" },
  { value: "IN_ESCROW", label: "In Escrow" },
  { value: "IN_PRODUCTION", label: "In Production" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "DISPUTED", label: "Disputed" },
];

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  AWAITING_PAYMENT: "#f59e0b",
  IN_ESCROW: "#3b82f6",
  IN_PRODUCTION: "#8b5cf6",
  DELIVERED: "#14b8a6",
  COMPLETED: "#10b981",
  CANCELLED: "#6b7280",
  DISPUTED: "#ef4444",
};

const ESCROW_STATUS_COLORS: Record<EscrowStatus, string> = {
  AWAITING: "#6b7280",
  HELD: "#3b82f6",
  RELEASED: "#10b981",
  REFUNDED: "#f97316",
  DISPUTED: "#ef4444",
};

const ACTIVE_STATUSES: OrderStatus[] = [
  "IN_ESCROW",
  "IN_PRODUCTION",
  "DELIVERED",
];

const formatCurrency = (n: number): string =>
  `₦${n.toLocaleString("en-NG")}`;

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const shortId = (id: string) => id.slice(0, 8);

const formatStatus = (status: string): string =>
  status.replace(/_/g, " ");

/* ------------------------------------------------------------------ */
/* Order row card                                                      */
/* ------------------------------------------------------------------ */

const OrderRow = ({
  order,
  onClick,
}: {
  order: ProductionOrder;
  onClick: (order: ProductionOrder) => void;
}) => {
  const isDisputed = order.status === "DISPUTED";
  const isActive = ACTIVE_STATUSES.includes(order.status);

  return (
    <div
      className={`${styles.row} ${isDisputed ? styles.rowDisputed : ""}`}
      onClick={() => onClick(order)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(order);
        }
      }}
    >
      <div className={styles.rowMain}>
        {/* Top line: order id + garment + status */}
        <div className={styles.rowIdentity}>
          <span className={styles.orderId}>#{shortId(order.id)}</span>
          <span className={styles.garmentName}>
            {order.brief.garmentType}
          </span>
          <span
            className={styles.statusBadge}
            style={{
              backgroundColor:
                ORDER_STATUS_COLORS[order.status as OrderStatus] ?? "#6b7280",
            }}
          >
            {formatStatus(order.status)}
          </span>
        </div>

        {/* Parties line */}
        <p className={styles.parties}>
          <span className={styles.partyLabel}>Brand</span>{" "}
          <span className={styles.partyName}>
            {order.buyer.displayName}
          </span>
          <span className={styles.partySep}>↔</span>
          <span className={styles.partyLabel}>Maker</span>{" "}
          <span className={styles.partyName}>
            {order.maker.displayName}
          </span>
        </p>

        {/* Meta row */}
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <strong>Escrow:</strong> {formatCurrency(order.escrow.amountNgn)}
          </span>
          <span className={styles.metaItem}>
            <strong>Fee:</strong> {order.escrow.platformFeePercent}%
          </span>
          <span className={styles.metaItem}>
            <strong>Payout:</strong>{" "}
            {formatCurrency(order.escrow.makerPayoutNgn)}
          </span>
          <span className={styles.metaItem}>
            <strong>Qty:</strong> {order.brief.quantity} units
          </span>
          <span className={styles.metaItem}>
            <strong>Created:</strong> {formatDate(order.createdAt)}
          </span>
          {order.deliveredAt && (
            <span className={styles.metaItem}>
              <strong>Delivered:</strong> {formatDate(order.deliveredAt)}
            </span>
          )}
          {order.completedAt && (
            <span className={styles.metaItem}>
              <strong>Completed:</strong> {formatDate(order.completedAt)}
            </span>
          )}
        </div>

        {/* Escrow status inline indicator */}
        <div className={styles.escrowLine}>
          <span className={styles.escrowLabel}>ESCROW</span>
          <span
            className={styles.escrowBadge}
            style={{
              backgroundColor:
                ESCROW_STATUS_COLORS[
                  order.escrow.status as EscrowStatus
                ] ?? "#6b7280",
            }}
          >
            {order.escrow.status}
          </span>
          {isActive && (
            <span className={styles.activePill}>● Active</span>
          )}
          {isDisputed && (
            <span className={styles.disputePill}>⚠ Dispute pending</span>
          )}
        </div>
      </div>

      <span className={styles.rowArrow}>→</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const OrderList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  const fetchOrders = useCallback(async (status?: OrderStatus) => {
    const current = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.getOrders(status);
      if (current !== requestId.current) return;
      setOrders(data);
    } catch (err) {
      if (current !== requestId.current) return;
      setError(getErrorMessage(err, "Failed to load orders."));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders(filter === "ALL" ? undefined : filter);
    return () => {
      requestId.current += 1;
    };
  }, [fetchOrders, filter]);

  const handleClick = (order: ProductionOrder) => {
    // DISPUTED orders go to the dispute resolution screen.
    // Others go to the buyer/maker order detail (existing routes).
    if (order.status === "DISPUTED") {
      navigate(`/admin/disputes/${order.id}`);
    } else {
      navigate(`/admin/orders/${order.id}`);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Counts for filter badges                                          */
  /* ---------------------------------------------------------------- */

  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const totalCount = orders.length;

  /* ---------------------------------------------------------------- */
  /* Loading state                                                     */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Orders</h2>
        </div>
        <div className={styles.skeletonList}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonBar} style={{ width: "50%" }} />
              <div className={styles.skeletonBar} style={{ width: "75%" }} />
              <div className={styles.skeletonBar} style={{ width: "90%" }} />
              <div className={styles.skeletonBar} style={{ width: "40%" }} />
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
          <h2 className={styles.title}>Orders</h2>
        </div>
        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => fetchOrders(filter === "ALL" ? undefined : filter)}>
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
        <h2 className={styles.title}>Orders</h2>
        <p className={styles.subtitle}>
          Monitor all production orders across every status. Click a disputed
          order to open its resolution screen.
        </p>
      </div>

      {/* Filter tabs */}
      <div className={styles.filterBar}>
        {STATUS_FILTERS.map((f) => {
          const count =
            f.value === "ALL" ? totalCount : counts[f.value] ?? 0;
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
      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            {filter === "ALL"
              ? "No orders have been created yet."
              : `No ${formatStatus(filter).toLowerCase()} orders.`}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onClick={handleClick} />
          ))}
        </div>
      )}

      {/* Summary footer */}
      {orders.length > 0 && (
        <div className={styles.summaryBar}>
          <span>
            Showing <strong>{orders.length}</strong> order
            {orders.length !== 1 ? "s" : ""}
          </span>
          <span>
            Total escrow held:{" "}
            <strong>
              {formatCurrency(
                orders.reduce(
                  (sum, o) =>
                    o.escrow.status === "HELD" ||
                    o.escrow.status === "DISPUTED"
                      ? sum + o.escrow.amountNgn
                      : sum,
                  0,
                ),
              )}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderList;