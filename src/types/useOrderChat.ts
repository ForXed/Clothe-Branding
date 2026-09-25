// src/hooks/useOrderChat.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import { orderChatService, type OrderMessage } from '../services/orderChatService';

interface UseOrderChatProps {
  orderId: string;
  currentUserId: string;
  orderStatus: string; // pass from the order object you already have
  accessToken: string; // from your auth context/localStorage
}

export const useOrderChat = ({ orderId, currentUserId, orderStatus, accessToken }: UseOrderChatProps) => {
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);

  // 1. Load history via REST on mount
  useEffect(() => {
    if (!orderId) return;
    setIsLoading(true);
    orderChatService.getMessages(orderId)
      .then(setMessages)
      .catch(err => setError(err.response?.data?.message || 'Failed to load chat.'))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  // 2. Open STOMP connection + subscribe
  useEffect(() => {
    if (!orderId || !accessToken) return;

    const client = new Client({
      brokerURL: 'wss://api.brutige.name.ng/ws',
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        setIsConnected(true);
        client.subscribe(
          `/topic/orders/${orderId}/messages`,
          (message: IMessage) => {
            const incoming: OrderMessage = JSON.parse(message.body);
            setMessages(prev => {
              // Dedupe by id — covers our own optimistic sends + WS echo
              if (prev.some(m => m.id === incoming.id)) return prev;
              return [...prev, incoming];
            });
          }
        );
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        setError(frame.headers['message'] || 'Connection error.');
      },

      onDisconnect: () => setIsConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); clientRef.current = null; };
  }, [orderId, accessToken]);

  // 3. Publish message via STOMP (server broadcasts back via topic)
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/orders/${orderId}/messages`,
      body: JSON.stringify({ content }),
    });
    // Server will broadcast the saved OrderMessage back via our subscription —
    // no optimistic append needed; dedupe handles echo safely
  }, [orderId]);

  // 4. Business rules
  const isLocked = orderStatus === 'AWAITING_PAYMENT';

  return {
    messages,
    isLoading,
    isConnected,
    error,
    sendMessage,
    isLocked,
    currentUserId, // UI uses this for bubble alignment
  };
};