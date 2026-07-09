import React, { ReactNode, useEffect, useState } from "react";
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
  BuyerNotification,
  MakerNotification,
  BuyerCategory,
  MakerCategory,
} from "./notification";
import SwipeableNotification from "./SwipeableNotification";
import { Check, Trash2 } from "lucide-react";
import {
  Archive,
  BadgeCheck,
  CircleAlert,
  Cog,
  FilePlus2,
  FileText,
  Lock,
  MessageSquare,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

type NotificationCategory = BuyerCategory | MakerCategory;

const iconMap: Record<NotificationCategory, LucideIcon> = {
  order: FileText,
  new_order: FilePlus2,
  escrow: Lock,
  brand_vault: Archive,
  message: MessageSquare,
  dispute: CircleAlert,
  shipping: Truck,
  delivery: BadgeCheck,
  verification: ShieldCheck,
  system: Cog,
};

export function getNotificationIcon(category: NotificationCategory) {
  const Icon = iconMap[category];

  return <Icon size={20} strokeWidth={2} />;
}

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
    return notif.category == currentFilter ? notif : false;
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
        {filteredNotifications.map((notification) => (
          <>
            <NotificationCardPC
              notification={notification}
              markAsRead={markAsRead}
              removeNotification={removeNotification}
            />
            <SwipeableNotification
              key={notification.id}
              onDelete={() => removeNotification(notification.id)}
              onMarkAsRead={() => markAsRead(notification.id)}
            >
              <NotificationCard notification={notification} />
            </SwipeableNotification>
          </>
        ))}
      </div>
    </div>
  );
};

const NotificationCard: React.FC<{
  notification: BuyerNotification | MakerNotification;
}> = ({ notification }) => {
  return (
    <div
      key={notification.id}
      className={`${styles.item} ${!notification.read ? styles.unread : ""}`}
      // onClick={() => markAsRead(notification.id)}
      role="button"
      tabIndex={0}
    >
      <div className={styles.icon}>
        {getNotificationIcon(notification.category)}
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
    </div>
  );
};

const NotificationCardPC: React.FC<{
  notification: BuyerNotification | MakerNotification;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
}> = ({ notification, markAsRead, removeNotification }) => {
  return (
    <div
      key={notification.id}
      className={`${styles.item_pc} ${!notification.read ? styles.unread : ""}`}
      role="button"
      tabIndex={0}
    >
      <div className={styles.icon}>
        {getNotificationIcon(notification.category)}
        {!notification.read && <span className={styles.dot} />}
      </div>

      <div className={styles.content_pc}>
        <div className={styles.row_pc}>
          <p
            className={
              styles.title + (notification.read ? "" : " " + styles.unread)
            }
          >
            {notification.title}
          </p>

          <p className={styles.message}>{notification.message}</p>
        </div>

        <div>
          <div className={styles.actions_pc}>
            <button
              className={styles.markRead}
              onClick={() => markAsRead(notification.id)}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                removeNotification(notification.id);
              }}
              className={styles.deleteBtn}
              aria-label="Delete notification"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <span className={styles.time}>
            {formatTime(notification.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};
export default NotificationList;
