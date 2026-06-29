import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudioHeader.module.css";

interface StudioHeaderProps {
  activeTab: string;
  goToPlatform: () => void;
  isPro: boolean;
  setActiveTab: (tab: string) => void;
}

const StudioHeader: React.FC<StudioHeaderProps> = ({
  activeTab,
  goToPlatform,
  isPro,
  setActiveTab,
}) => {
  const navigate = useNavigate();
  const getPageTitle = () => {
    const titles: Record<string, string> = {
      overview: "Dashboard",
      "add-product": "Add Product",
      products: "Products",
      orders: "Orders",
      messages: "Messages",
      transactions: "Transactions",
      settings: "Settings",
      notifications: "Notifications",
    };
    return titles[activeTab] || "Maker Studio";
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={goToPlatform}
          aria-label="Back to Platform"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className={styles.backText}>Exit Studio</span>
        </button>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          {isPro && (
            <span className={styles.mobileProBadge}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
          )}
        </div>
        <div className={styles.actions}>
          {isPro && (
            <span className={styles.proBadge}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>{" "}
              PRO
            </span>
          )}
          <button
            onClick={() => {
              setActiveTab("notifications");
            }}
            type="button"
            className={styles.iconBtn}
            aria-label="Notifications"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className={styles.notificationDot}></span>
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Help">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
export default StudioHeader;
