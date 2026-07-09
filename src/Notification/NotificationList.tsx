import React, { useEffect, useState } from "react";
import {
  useNotifications,
  // NOTIFICATION_TYPES,
  // NotificationType,
} from "./NotificationContext";
import styles from "./NotificationList.module.css";
import {
  formatTime,
  NOTIFICATION_TYPES,
  NotificationType,
  Notification,
} from "./notification";
import SwipeableNotification from "./SwipeableNotification";

const typeLabels: Record<NotificationType, string> = {
  [NOTIFICATION_TYPES.ORDER]: "Order",
  [NOTIFICATION_TYPES.MESSAGE]: "Message",
  [NOTIFICATION_TYPES.PRODUCT]: "Product",
  [NOTIFICATION_TYPES.SYSTEM]: "System",
  [NOTIFICATION_TYPES.REVIEW]: "Review",
  [NOTIFICATION_TYPES.PROMOTION]: "Promotion",
};

// 👇 Replaced emojis with clean SVG icons

const NotificationList: React.FC = () => {
  const {
    notifications,
    unreadCount,
    _setUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getUnread,
  } = useNotifications();

  useEffect(() => {
    const unread = getUnread();
    _setUnreadCount(unread.length || 0);
  }, []);

  const [currentFilter, setCurrentFilter] = useState<
    "all" | "unread" | "message" | "order"
  >("all");

  const filteredNotifications = notifications.filter((notif) => {
    if (currentFilter == "all") return true;
    if (currentFilter == "unread") return notif.read == false ? notif : false;
    return notif.type == currentFilter ? notif : false;
  });

  if (notifications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <h3>No notifications</h3>
        <p>You're all caught up!</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2>Notifications</h2>
          {/* {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount} new</span>
          )} */}
        </div>

        <div className={styles.actions}>
          {/* {unreadCount > 0 && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={markAllAsRead}
            >
              Mark all read
            </button>
          )}
          <button type="button" className={styles.actionBtn} onClick={clearAll}>
            Clear all
          </button> */}
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          onClick={() => {
            setCurrentFilter("all");
          }}
          className={` ${currentFilter == "all" && styles.active} ${styles.tab}`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentFilter("unread");
          }}
          className={` ${currentFilter == "unread" && styles.active} ${styles.tab}`}
        >
          Unread {getUnread().length > 0 && `(${getUnread().length})`}
        </button>
        <button
          onClick={() => {
            setCurrentFilter("order");
          }}
          type="button"
          className={` ${currentFilter == "order" && styles.active} ${styles.tab}`}
        >
          Orders
        </button>
        <button
          onClick={() => {
            setCurrentFilter("message");
          }}
          type="button"
          className={` ${currentFilter == "message" && styles.active} ${styles.tab}`}
        >
          Messages
        </button>
      </div>

      <div className={styles.list}>
        {/* <SwipeNotifications  /> */}

        {filteredNotifications.map((notification) => (
          <SwipeableNotification
            key={notification.id}
            onDelete={() => removeNotification(notification.id)}
            onMarkAsRead={() => markAsRead(notification.id)}
          >
            <NotificationCard notification={notification} />
          </SwipeableNotification>
        ))}
      </div>
    </div>
  );
};

const NotificationCard: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const typeIcons: Record<NotificationType, React.ReactNode> = {
    [NOTIFICATION_TYPES.ORDER]: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    [NOTIFICATION_TYPES.MESSAGE]: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    [NOTIFICATION_TYPES.PRODUCT]: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    [NOTIFICATION_TYPES.SYSTEM]: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    [NOTIFICATION_TYPES.REVIEW]: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    [NOTIFICATION_TYPES.PROMOTION]: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  };
  return (
    <div
      key={notification.id}
      className={`${styles.item} ${!notification.read ? styles.unread : ""}`}
      // onClick={() => markAsRead(notification.id)}
      role="button"
      tabIndex={0}
    >
      <div className={styles.icon}>
        {typeIcons[notification.type]}
        {!notification.read && <span className={styles.dot} />}
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          {/* <span className={styles.type}>
                  {typeLabels[notification.type]}
                </span> */}
          <p
            className={
              styles.title + (notification.read ? "" : " " + styles.unread)
            }
          >
            {notification.title}
          </p>

          <span className={styles.time}>
            {formatTime(notification.timestamp)}
          </span>
        </div>
        <p className={styles.message}>{notification.message}</p>
      </div>

      {/* <button
              type="button"
              className={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              aria-label="Delete notification"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button> */}
    </div>
  );
};
export default NotificationList;
