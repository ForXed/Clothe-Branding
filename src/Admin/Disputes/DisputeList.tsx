// src/Admin/Disputes/DisputeList.tsx
// A dispute is an order in DISPUTED, so this queue is the order list filtered
// to that state. There is no separate dispute status in v1: opening a dispute
// moves the order, and resolving it moves the order again.

import { useNavigate } from "react-router-dom";
import { useAdminDisputes } from "../../hooks/useAdminDisputes";
import styles from "./DisputeList.module.css";

const shortId = (id: string) => (id ? id.slice(0, 8) : "—");

const formatDate = (iso?: string | null): string =>
  iso
    ? new Date(iso).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const DisputeList = () => {
  const navigate = useNavigate();
  const { disputes, loading, error, refetch } = useAdminDisputes();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Disputes</h2>
        </div>
        <div className={styles.skeletonList}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonBar} style={{ width: "55%" }} />
              <div className={styles.skeletonBar} style={{ width: "80%" }} />
              <div className={styles.skeletonBar} style={{ width: "40%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Disputes</h2>
        </div>
        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          <button type="button" onClick={refetch}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Disputes</h2>
        <p className={styles.subtitle}>
          Orders whose buyer or maker has raised a dispute. The escrow holds the
          money until you release it to the maker or refund the buyer.
        </p>
      </div>

      {disputes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No disputes. Every order is moving normally.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {disputes.map((order) => (
            <button
              key={order.id}
              type="button"
              className={styles.row}
              onClick={() => navigate(`/admin/disputes/${order.id}`)}
            >
              <div className={styles.rowMain}>
                <div className={styles.rowIdentity}>
                  <span className={styles.orderId}>#{shortId(order.id)}</span>
                  <span className={styles.garmentName}>
                    {order.brief?.garmentType ?? "Order"}
                  </span>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: "#ef4444" }}
                  >
                    DISPUTED
                  </span>
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.metaItem}>
                    Amount <strong>₦{order.quote?.priceNgn ?? "—"}</strong>
                  </span>
                  <span className={styles.metaItem}>
                    Placed <strong>{formatDate(order.createdAt)}</strong>
                  </span>
                  <span className={styles.metaItem}>
                    Escrow <strong>{order.escrow?.status ?? "—"}</strong>
                  </span>
                </div>
              </div>

              <span className={styles.rowArrow} aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisputeList;
