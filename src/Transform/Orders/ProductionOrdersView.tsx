// src/Transform/Orders/ProductionOrdersView.tsx

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import type { ApiOrder, OrderStatus } from "../../types/order";
import { getErrorMessage, getErrorStatus } from "../../utils/apiError";
import ProductionOrdersSkeleton from "./ProductionOrdersSkeleton";
import styles from "./ProductionOrdersView.module.css";
import { dummyOrders } from "../../data/mockOrders";

/* ------------------------------ constants ------------------------------ */

// TODO: confirm both paths match your router
const orderDetailPath = (id: string) => `/platform/orders/${id}`;
const orderChatPath = (id: string) => `/platform/orders/${id}/chat`;

const FILTER_TABS = [
  "ALL",
  "IN_ESCROW",
  "IN_PRODUCTION",
  "DELIVERED",
  "COMPLETED",
  "DISPUTED",
];

// Chat is available from IN_ESCROW onward (not AWAITING_PAYMENT or CANCELLED).
const CHAT_STATUSES: OrderStatus[] = [
  "IN_ESCROW",
  "IN_PRODUCTION",
  "DELIVERED",
  "COMPLETED",
  "DISPUTED",
];

const STATUS_COLORS: Record<string, string> = {
  AWAITING_PAYMENT: "#f59e0b",
  IN_ESCROW: "#3b82f6",
  IN_PRODUCTION: "#8b5cf6",
  DELIVERED: "#14b8a6",
  COMPLETED: "#10b981",
  CANCELLED: "#6b7280",
  DISPUTED: "#ef4444",
};

/* ------------------------------- helpers ------------------------------- */

const formatStatus = (status: string) => status.replace(/_/g, " ");

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// Real ids are UUIDs, so show a short form
const shortId = (id: string) => id.slice(0, 8);

const canConfirm = (order: ApiOrder) => order.status === "DELIVERED";
const canChat = (order: ApiOrder) => CHAT_STATUSES.includes(order.status);

/* -------------------------------- page --------------------------------- */

const ProductionOrdersView = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // load/refresh failures
  const [actionError, setActionError] = useState<string | null>(null); // confirm failures
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const requestId = useRef(0); // ignores responses from outdated requests

  const fetchOrders = useCallback(async (opts?: { silent?: boolean }) => {
    const current = ++requestId.current;
    if (!opts?.silent) {
      setIsLoading(true);
      setError(null);
    }
    setIsLoading(false);

    try {
      const data = await orderService.getOrders();
      if (current !== requestId.current) return;
      setOrders(data);
      setError(null);
    } catch (err) {
      if (current !== requestId.current) return;
      setError(
        getErrorMessage(err, "Failed to load orders. Please try again."),
      );
    } finally {
      if (current === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
    return () => {
      requestId.current += 1; // drop in-flight response on unmount
    };
  }, [fetchOrders]);

  const filteredOrders = orders.filter(
    (o) => statusFilter === "ALL" || o.status === statusFilter,
  );

  // Response bodies aren't documented, so refetch rather than patch local state
  const handleConfirmDelivery = async (orderId: string) => {
    if (
      !window.confirm(
        "Confirm delivery and release funds to the maker? This action cannot be undone.",
      )
    )
      return;

    setActionLoadingId(orderId);
    setActionError(null);

    try {
      await orderService.confirmOrder(orderId);
      await fetchOrders({ silent: true });
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to confirm delivery."));
      // 409 = the order isn't in the state we thought, so resync the list
      if (getErrorStatus(err) === 409) await fetchOrders({ silent: true });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Production Orders</h1>
        <p className={styles.subtitle}>
          Your money is held in escrow and only released when you confirm
          delivery.
        </p>
      </div>

      {error && (
        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => fetchOrders()}>
            Retry
          </button>
        </div>
      )}

      {actionError && (
        <div className={styles.errorBox} role="alert">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError(null)}>
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        {FILTER_TABS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`${styles.filterBtn} ${
              statusFilter === status ? styles.filterBtnActive : ""
            }`}
          >
            {formatStatus(status).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <ProductionOrdersSkeleton />
      ) : filteredOrders.length === 0 ? (
        // if the load failed, the error box above already explains why it's empty
        !error && (
          <div className={styles.emptyState}>
            <p>No orders found with this status.</p>
          </div>
        )
      ) : (
        <div className={styles.orderList}>
          {filteredOrders.map((order) => {
            const isActionLoading = actionLoadingId === order.id;

            const meta = [
              `Placed ${formatDate(order.createdAt)}`,
              order.deliveredAt && `Delivered ${formatDate(order.deliveredAt)}`,
              order.completedAt && `Completed ${formatDate(order.completedAt)}`,
            ]
              .filter(Boolean)
              .join(" • ");

            return (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.titleRow}>
                      <h3 className={styles.orderTitle}>
                        Order {shortId(order.id)}
                      </h3>
                      <span
                        className={styles.statusBadge}
                        style={{
                          backgroundColor:
                            STATUS_COLORS[order.status] ?? "#6b7280",
                        }}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </div>
                    <p className={styles.metaLine}>{meta}</p>
                  </div>
                </div>

                <div className={styles.actionRow}>
                  {/* the detail page has escrow, specs and the dispute form */}
                  <button
                    type="button"
                    className={styles.viewBtn}
                    onClick={() => navigate(orderDetailPath(order.id))}
                  >
                    View Order
                  </button>

                  {canChat(order) && (
                    <button
                      type="button"
                      className={styles.chatBtn}
                      onClick={() => navigate(orderChatPath(order.id))}
                    >
                      Chat with Maker
                    </button>
                  )}

                  {canConfirm(order) && (
                    <button
                      type="button"
                      className={styles.confirmBtn}
                      onClick={() => handleConfirmDelivery(order.id)}
                      disabled={isActionLoading}
                    >
                      {isActionLoading
                        ? "Processing..."
                        : "Confirm Delivery & Release Funds"}
                    </button>
                  )}
                </div>

                {order.status === "DISPUTED" && (
                  <div className={styles.disputeBox}>
                    <p className={styles.disputeText}>
                      ⚠️ This order is under dispute. Escrow funds are held
                      pending resolution by Brutige mediation.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductionOrdersView;
