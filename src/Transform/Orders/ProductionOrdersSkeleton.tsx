// src/Transform/Orders/ProductionOrdersSkeleton.tsx
import styles from "./ProductionOrdersSkeleton.module.css";

/**
 * Placeholder shown while the orders list loads.
 * Mirrors the real order card: title + status badge, meta line, action buttons.
 */
const ProductionOrdersSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div
      className={styles.list}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className={styles.srOnly}>Loading orders...</span>

      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.card} aria-hidden="true">
          <div className={styles.headerRow}>
            <div className={`${styles.bar} ${styles.title}`} />
            <div className={`${styles.bar} ${styles.badge}`} />
          </div>

          <div className={`${styles.bar} ${styles.meta}`} />

          <div className={styles.actions}>
            <div className={`${styles.bar} ${styles.button}`} />
            <div className={`${styles.bar} ${styles.buttonWide}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductionOrdersSkeleton;
