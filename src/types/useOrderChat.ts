// src/hooks/useOrderChat.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { orderChatService, type OrderMessage } from "../services/orderChatService";

interface UseOrderChatProps {
  orderId: string;
  currentUserId: string;
  orderStatus: string;
  accessToken?: string;
}

type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

const getWsUrl = (): string => {
  const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
  try {
    const url = new URL(base);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/ws";
    url.search = "";
    return url.toString();
  } catch {
    return base
      .replace(/^https:/, "wss:")
      .replace(/^http:/, "ws:")
      .replace(/\/api\/v1\/?$/, "/ws");
  }
};

export const useOrderChat = ({
  orderId,
  currentUserId,
  orderStatus,
  accessToken,
}: UseOrderChatProps) => {
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);

  // 1. Load history via REST
  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    orderChatService
      .getMessages(orderId)
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch((err: any) => {
        if (!cancelled)
          setError(err.response?.data?.message || "Failed to load chat history.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  // 2. STOMP connect + subscribe (receive-only; send is via REST)
  useEffect(() => {
    if (!orderId) return;
    setConnectionStatus("connecting");

    const client = new Client({
      brokerURL: getWsUrl(),
      connectHeaders: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setConnectionStatus("connected");
        client.subscribe(`/topic/orders/${orderId}/messages`, (message: IMessage) => {
          try {
            const incoming: OrderMessage = JSON.parse(message.body);
            setMessages((prev) =>
              prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming],
            );
          } catch (e) {
            console.error("Failed to parse WS message:", e);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        setConnectionStatus("error");
        setError(frame.headers["message"] || "WebSocket connection error.");
      },
      onWebSocketClose: () => setConnectionStatus("disconnected"),
    });

    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [orderId, accessToken]);

  // 3. Send via REST (authoritative). WS broadcasts to the other party.
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !orderId) return;
      setIsSending(true);
      setError(null);
      try {
        const saved = await orderChatService.sendMessage(orderId, trimmed);
        setMessages((prev) =>
          prev.some((m) => m.id === saved.id) ? prev : [...prev, saved],
        );
      } catch (err: any) {
        const message = err.response?.data?.message || "Failed to send message.";
        setError(message);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [orderId],
  );

  // 4. Business rule: locked until escrow funded
  const isLocked = orderStatus === "AWAITING_PAYMENT";

  return {
    messages,
    isLoading,
    isSending,
    connectionStatus,
    error,
    sendMessage,
    isLocked,
    currentUserId,
  };
};