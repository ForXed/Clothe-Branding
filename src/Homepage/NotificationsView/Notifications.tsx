import { useState } from "react";
import { MakerNotification } from "./notification";
import { NotificationIcon } from "./NotificationIcon";
import styles from "./Notifications.module.css";
import { timeAgo } from "./timeAgo";
const Notifications = ({
  notificationItems,
}: {
  notificationItems: MakerNotification[];
}) => {
  const [currentFilter, setCurrentFilter] = useState("today");

  return (
    <div className={styles.container}>
      {notificationItems.length > 0 ? (
        <div>
          <h3>Notifications</h3>

          <div className={styles.sort_buttons}>
            <button
              onClick={() => setCurrentFilter("today")}
              className={
                currentFilter == "today"
                  ? styles.sort_button_active
                  : styles.sort_button
              }
            >
              Today
            </button>
            <button
              onClick={() => setCurrentFilter("week")}
              className={
                currentFilter == "week"
                  ? styles.sort_button_active
                  : styles.sort_button
              }
            >
              This Week
            </button>
            <button
              onClick={() => setCurrentFilter("earlier")}
              className={
                currentFilter == "earlier"
                  ? styles.sort_button_active
                  : styles.sort_button
              }
            >
              Earlier
            </button>
          </div>

          <div className={styles.notif_container}>
            {notificationItems.map((notif) => {
              return <NotificationCard data={notif} />;
            })}
          </div>
        </div>
      ) : (
        <div className={styles.emptyCart}>
          <div className={styles.illustrationBox}>
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2>You have no new notifications</h2>
          <p>
            No active production runs. Connect with a maker to start sourcing.
          </p>
          <button
            className={styles.continueBtn}
            // onClick={() => navigate("/platform/shop")}
          >
            Browse Catalog
          </button>
        </div>
      )}
    </div>
  );
};

const NotificationCard = ({ data }: { data: MakerNotification }) => {
  return (
    <div className={styles.notification_card_main}>
      <div className={styles.notification_card}>
        <div className={styles.img}>
          <NotificationIcon category={data.category} />
        </div>
        <div style={{ width: "100%" }}>
          <div className={styles.header}>
            {!data.read && <div className={styles.indicator}></div>}
            <p className={styles.title}>{data.title}</p>
            <p className={styles.timestamp}>{timeAgo(data.timestamp)}</p>
          </div>
          <p className={styles.body}>{data.body}</p>
        </div>
      </div>

      {data.actionLabel && <button>{data.actionLabel + " ->"}</button>}
    </div>
  );
};

export default Notifications;
