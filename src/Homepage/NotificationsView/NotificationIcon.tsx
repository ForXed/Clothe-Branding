type NotificationCategory =
  | "order"
  | "message"
  | "escrow"
  | "payment"
  | "brandVault"
  | "verification"
  | "dispute"
  | "shipping"
  | "success";

export function NotificationIcon({
  category,
  className = "w-5 h-5",
}: {
  category: string;
  className?: string;
}) {
  switch (category) {
    case "order":
      return (
        <svg
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 7L12 3L21 7L12 11L3 7Z" />
          <path d="M3 7V17L12 21L21 17V7" />
        </svg>
      );

    case "message":
      return (
        <svg
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15A2 2 0 0 1 19 17H7L3 21V5A2 2 0 0 1 5 3H19A2 2 0 0 1 21 5V15Z" />
        </svg>
      );

    case "escrow":
      return (
        <svg
          style={{ width: "24px", height: "24px" }}
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 3L19 6V12C19 17 15.5 20 12 21C8.5 20 5 17 5 12V6L12 3Z" />
        </svg>
      );

    case "payment":
      return (
        <svg
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M2 10H22" />
        </svg>
      );

    case "brandVault":
      return (
        <svg
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8Z" />
          <path d="M14 2V8H20" />
        </svg>
      );

    case "verification":
      return (
        <svg
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L15 5L20 6L18 11L20 16L15 17L12 22L9 17L4 16L6 11L4 6L9 5L12 2Z" />
          <path d="M9 12L11 14L15 10" />
        </svg>
      );

    case "dispute":
      return (
        <svg
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 9V13" />
          <path d="M12 17H12.01" />
          <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.53 21H20.47A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" />
        </svg>
      );

    case "shipping":
      return (
        <svg
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="1" y="3" width="15" height="13" />
          <path d="M16 8H20L23 11V16H16V8Z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );

    case "success":
      return (
        <svg
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12L11 15L16 9" />
        </svg>
      );

    default:
      return null;
  }
}
