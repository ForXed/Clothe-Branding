import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  Notification,
  NotificationContextType,
  NotificationType,
} from "./notification";

const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  // const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      if (!newNotification.read) {
        setUnreadCount((prev) => prev + 1);
      }
    },
    [],
  );

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === notificationId);
      if (target && !target.read) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      return prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      );
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === notificationId);
      if (target && !target.read) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      return prev.filter((n) => n.id !== notificationId);
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const getByType = useCallback(
    (type: NotificationType) => {
      return notifications.filter((n) => n.type === type);
    },
    [notifications],
  );

  const getUnread = useCallback(() => {
    return notifications.filter((n) => !n.read);
  }, [notifications]);

  const _setUnreadCount = useCallback(
    (count: number) => {
      setUnreadCount(count);
    },
    [notifications],
  );
  const initializeNotifications = useCallback(
    (initialNotifications: Notification[]) => {
      setNotifications((prev) =>
        prev.length === 0 ? initialNotifications : prev,
      );
    },
    [],
  );
  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getByType,
    getUnread,
    _setUnreadCount,
    initializeNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};

export default NotificationContext;
