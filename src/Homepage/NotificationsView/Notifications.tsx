import { useState } from "react";
import { BuyerNotification, MakerNotification } from "./notification";
import { NotificationIcon } from "./NotificationIcon";
import styles from "./Notifications.module.css";
import { timeAgo } from "./timeAgo";
const Notifications = ({
  notificationItems,
}: {
  notificationItems: BuyerNotification[];
}) => {
  const [currentFilter, setCurrentFilter] = useState("all");
  const now = new Date();

  const filteredNotifications = notificationItems.filter((notif) => {
    const diffDays = Math.floor(
      (now.getTime() - notif.timestamp.getTime()) / (1000 * 60 * 60 * 24),
    );

    switch (currentFilter) {
      case "all":
        return true;
      case "today":
        return diffDays === 0;

      case "week":
        return diffDays > 0 && diffDays <= 7;

      case "older":
        return diffDays > 7;

      default:
        return true;
    }
  });

  return (
    <div className={styles.container}>
      {notificationItems.length > 0 ? (
        <div>
          <div className={styles.main_header}>
            <h3>Notifications</h3>
            <button>Mark all as read</button>
          </div>

          <div className={styles.sort_buttons}>
            <button
              onClick={() => setCurrentFilter("all")}
              className={
                currentFilter == "all"
                  ? styles.sort_button_active
                  : styles.sort_button
              }
            >
              All
            </button>
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
              onClick={() => setCurrentFilter("older")}
              className={
                currentFilter == "older"
                  ? styles.sort_button_active
                  : styles.sort_button
              }
            >
              Older
            </button>
          </div>

          <div className={styles.notif_container}>
            {filteredNotifications.map((notif) => {
              return <NotificationCard data={notif} />;
            })}
          </div>
        </div>
      ) : (
        <div className={styles.empty_notif}>
          <div className={styles.illustrationBox}>
            {" "}
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
          <p>New notifications will appear here as activity happens.</p>
        </div>
      )}
    </div>
  );
};

const NotificationCard = ({ data }: { data: BuyerNotification }) => {
  return (
    <div className={styles.notification_card_main}>
      <div className={styles.notification_card}>
        <div className={styles.img}>
          <NotificationIcon category={data.category} />
          {!data.read && <div className={styles.indicator}></div>}
        </div>

        <div style={{ width: "100%" }}>
          <div className={styles.header}>
            <p className={styles.title}>{data.title}</p>
            <svg
              className={styles.dot}
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="4"
              viewBox="0 0 8 8"
              fill="none"
            >
              <circle cx="4" cy="4" r="4" fill="currentColor" />
            </svg>
            <p className={styles.timestamp}>{timeAgo(data.timestamp)}</p>
          </div>
          <p
            className={styles.body}
            style={{ marginBottom: `${data.actionLabel && "12px"}` }}
          >
            {data.body}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {!data.read && <button>{"Mark as read"}</button>}
            {data.actionLabel && <button>{data.actionLabel}</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
