import { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./NotificationDetails.module.css";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationDetailsProps {
  open: boolean;
  notification: Notification | null;
  onClose: () => void;
}

export default function NotificationDetails({
  open,
  notification,
  onClose,
}: NotificationDetailsProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !notification) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.close}
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={22} />
        </button>

        <div className={styles.handle} />

        <h2>{notification.title}</h2>

        <span className={styles.time}>{notification.timestamp}</span>

        <p className={styles.message}>{notification.message}</p>

        {notification.onAction && (
          <button
            className={styles.primary}
            onClick={() => {
              notification.onAction?.();
              onClose();
            }}
          >
            {notification.actionLabel ?? "View"}
          </button>
        )}

        {!notification.onAction && (
          <button className={styles.primary} onClick={onClose}>
            Okay
          </button>
        )}
      </div>
    </div>
  );
}
