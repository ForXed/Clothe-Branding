// src/Transform/Orders/OrderChatView.tsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { useOrderChat } from "../../types/useOrderChat";
import styles from "./OrderChatView.module.css";

interface NotifyFunction {
  (message: string, type: "success" | "error" | "info"): void;
}

interface OrderChatViewProps {
  notify?: NotifyFunction;
}

const OrderChatView: React.FC<OrderChatViewProps> = ({ notify }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [orderStatus, setOrderStatus] = useState<string>("");
  const [loadingOrder, setLoadingOrder] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [text, setText] = useState<string>("");
  const endRef = useRef<HTMLDivElement>(null);

  // Optional bearer for STOMP. Under v1.2 httpOnly-cookie auth this is
  // usually absent, so WS may not authenticate until backend clarifies.
  // The hook degrades gracefully (REST still works for send + history).
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("brutige_access_token") || undefined
      : undefined;

  const {
    messages,
    isLoading,
    isSending,
    connectionStatus,
    error,
    sendMessage,
    isLocked,
  } = useOrderChat({
    orderId: orderId || "",
    currentUserId,
    orderStatus,
    accessToken,
  });

  // Who am I? (set at login as brutige_user)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("brutige_user");
      if (raw) setCurrentUserId(JSON.parse(raw)?.id || "");
    } catch (e) {
      console.warn("Failed to parse brutige_user", e);
    }
  }, []);

  // Load the order to know its status (drives the escrow lock)
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    setLoadingOrder(true);
    apiClient
      .get(`/orders/${orderId}`)
      .then((res) => {
        if (!cancelled) setOrderStatus(res.data?.status || "");
      })
      .catch((err: any) => {
        if (!cancelled) {
          const msg = err.response?.data?.message || "Failed to load order.";
          if (notify) notify(msg, "error");
          else console.error(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingOrder(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, notify]);

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending || isLocked) return;
    try {
      await sendMessage(trimmed);
      setText("");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to send message.";
      if (notify) notify(msg, "error");
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const connectionLabel =
    connectionStatus === "connected"
      ? "Live"
      : connectionStatus === "connecting"
        ? "Connecting"
        : connectionStatus === "error"
          ? "WS Error"
          : "Offline";

  const connectionClass =
    connectionStatus === "connected"
      ? styles.statusLive
      : connectionStatus === "error"
        ? styles.statusError
        : styles.statusOffline;

  if (!orderId) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>No order selected.</p>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => navigate("/platform/orders")}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Order Chat</h1>
          <p className={styles.meta}>Order {orderId}</p>
        </div>
        <div className={styles.headerRight}>
          <span className={`${styles.status} ${connectionClass}`}>
            {connectionLabel}
          </span>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => navigate("/platform/orders")}
          >
            Back
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loadingOrder ? (
        <div className={styles.empty}>Loading order...</div>
      ) : (
        <div className={styles.chatBox}>
          <div className={styles.messages}>
            {isLoading ? (
              <div className={styles.empty}>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className={styles.empty}>No messages yet.</div>
            ) : (
              messages.map((msg) => {
                const mine = currentUserId && msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={styles.row}>
                    <div
                      className={`${styles.bubble} ${
                        mine ? styles.mine : styles.theirs
                      }`}
                    >
                      {msg.content}
                      <span className={styles.time}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={endRef} />
          </div>

          {isLocked ? (
            <div className={styles.locked}>
              🔒 Chat unlocks once escrow is funded. This order is currently{" "}
              {orderStatus || "AWAITING_PAYMENT"}.
            </div>
          ) : (
            <div className={styles.composer}>
              <textarea
                className={styles.textarea}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                disabled={isSending}
                rows={1}
              />
              <button
                type="button"
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={!text.trim() || isSending}
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderChatView;