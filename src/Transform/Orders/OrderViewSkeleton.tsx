import styles from "./OrderViewSkeleton.module.css";

const OrderViewSkeleton = () => {
  return (
    <div className={styles.main}>
      {/* Order header */}
      <section className={`${styles.container} ${styles.prod}`}>
        <div className={styles.content}>
          <div className={styles.orderInfo}>
            <div className={styles.lineSmall} />

            <div className={styles.header}>
              <div className={styles.lineTiny} />
              <div className={styles.status} />
              <div className={styles.lineTiny} />
            </div>

            <div className={styles.title} />

            <div className={styles.lineMedium} />
          </div>

          <div className={styles.orderDetail}>
            <div>
              <div className={styles.lineTiny} />
              <div className={styles.price} />
            </div>

            <div>
              <div className={styles.lineTiny} />
              <div className={styles.lineMedium} />
            </div>
          </div>
        </div>
      </section>

      {/* Lifecycle */}
      <section className={styles.container}>
        <div className={styles.sectionTitle} />

        <div className={styles.lifeCycle}>
          {Array.from({ length: 7 }).map((_, index) => (
            <div className={styles.statusCard} key={index}>
              <div className={styles.lineTiny} />
              <div className={styles.lineSmall} />
            </div>
          ))}
        </div>

        {/* Status action */}
        <div className={styles.statusAction}>
          <div>
            <div className={styles.lineTiny} />
            <div className={styles.lineLarge} />
          </div>

          <div className={styles.actionButtons}>
            <div className={styles.button} />
            <div className={styles.button} />
          </div>
        </div>
      </section>

      {/* Escrow */}
      <section className={styles.container}>
        <div className={styles.escrowHeader}>
          <div>
            <div className={styles.heading} />
            <div className={styles.lineMedium} />
          </div>

          <div>
            <div className={styles.lineTiny} />
            <div className={styles.escrowStatus} />
          </div>
        </div>

        <div className={styles.escrowDetails}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div className={styles.escrowItem} key={index}>
              <div className={styles.lineTiny} />
              <div className={styles.priceSmall} />
            </div>
          ))}
        </div>
      </section>

      {/* Specifications */}
      <section className={styles.container}>
        <div className={styles.tabs}>
          <div className={styles.tab} />
          <div className={styles.tab} />
        </div>

        <div className={styles.specs}>
          <div className={styles.image} />

          <div className={styles.prodDetails}>
            <div>
              <div className={styles.lineTiny} />
              <div className={styles.lineMedium} />
            </div>

            <div>
              <div className={styles.lineTiny} />
              <div className={styles.lineSmall} />
            </div>

            <div>
              <div className={styles.lineTiny} />
              <div className={styles.description} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderViewSkeleton;