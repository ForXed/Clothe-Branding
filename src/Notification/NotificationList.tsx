import React from 'react';
import { useNotifications, NOTIFICATION_TYPES } from './NotificationContext';
import styles from './NotificationList.module.css';

// Type labels
const typeLabels = {
  [NOTIFICATION_TYPES.ORDER]: 'Order',
  [NOTIFICATION_TYPES.MESSAGE]: 'Message',
  [NOTIFICATION_TYPES.PRODUCT]: 'Product',
  [NOTIFICATION_TYPES.SYSTEM]: 'System',
  [NOTIFICATION_TYPES.REVIEW]: 'Review',
  [NOTIFICATION_TYPES.PROMOTION]: 'Promotion'
};

// Type icons
const typeIcons = {
  [NOTIFICATION_TYPES.ORDER]: '📦',
  [NOTIFICATION_TYPES.MESSAGE]: '💬',
  [NOTIFICATION_TYPES.PRODUCT]: '👕',
  [NOTIFICATION_TYPES.SYSTEM]: '⚙️',
  [NOTIFICATION_TYPES.REVIEW]: '⭐',
  [NOTIFICATION_TYPES.PROMOTION]: '🎁'
};

const NotificationList = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAll 
  } = useNotifications();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) return 'Just now';
    // Less than 1 hour
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    // Less than 24 hours
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    // Less than 7 days
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (notifications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <h3>No notifications</h3>
        <p>You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2>Notifications</h2>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount} new</span>
          )}
        </div>
        <div className={styles.actions}>
          {unreadCount > 0 && (
            <button className={styles.actionBtn} onClick={markAllAsRead}>
              Mark all read
            </button>
          )}
          <button className={styles.actionBtn} onClick={clearAll}>
            Clear all
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.active}`}>All</button>
        <button className={styles.tab}>Unread</button>
        <button className={styles.tab}>Orders</button>
        <button className={styles.tab}>Messages</button>
      </div>

      {/* Notification List */}
      <div className={styles.list}>
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`${styles.item} ${!notification.read ? styles.unread : ''}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className={styles.icon}>
              {typeIcons[notification.type]}
            </div>
            <div className={styles.content}>
              <div className={styles.row}>
                <span className={styles.type}>{typeLabels[notification.type]}</span>
                <span className={styles.time}>{formatTime(notification.timestamp)}</span>
              </div>
              <h4 className={styles.title}>{notification.title}</h4>
              <p className={styles.message}>{notification.message}</p>
            </div>
            <button 
              className={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              aria-label="Delete notification"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            {!notification.read && <span className={styles.dot} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;