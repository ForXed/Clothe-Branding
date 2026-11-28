// src/pages/ChatUnavailable.tsx
// Shown instead of the messaging screens while VITE_FEATURE_CHAT is off.
// The chat UI exists and is wired, but the endpoints behind it are not in the
// API yet, so a "no messages" screen would be a lie. This page says where things
// stand and sends the user back to the order, which is where chat will live.

import { useNavigate } from "react-router-dom";

interface ChatUnavailableProps {
  /** Where "back" should go — the order the chat belongs to, or the order list. */
  backTo?: string;
  backLabel?: string;
}

const ChatUnavailable = ({
  backTo = "/platform/orders",
  backLabel = "Back to orders",
}: ChatUnavailableProps) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "64px auto",
        padding: "32px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#e6e6e6",
        fontFamily: "inherit",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
        Order chat is not live yet
      </h1>
      <p style={{ marginTop: 12, lineHeight: 1.6, opacity: 0.85 }}>
        The interface is built, but the messaging endpoints are still being
        finished on the API. Until they ship, this screen stays switched off so
        nobody mistakes an empty room for a conversation.
      </p>
      <p style={{ marginTop: 12, lineHeight: 1.6, opacity: 0.85 }}>
        Everything else on the order — quotes, escrow, delivery, confirmation —
        works today.
      </p>
      <button
        type="button"
        onClick={() => navigate(backTo)}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          borderRadius: 10,
          border: "none",
          background: "#e6e6e6",
          color: "#111",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {backLabel}
      </button>
    </div>
  );
};

export default ChatUnavailable;
