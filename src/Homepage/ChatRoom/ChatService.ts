// ChatService.ts - Fixed TypeScript errors

import { useEffect } from 'react'; // 👈 Added import

interface Conversation {
  id: number;
  name: string;
  role: string;
  status: 'ONLINE' | 'AWAY' | 'OFFLINE';
  avatar: string;
  lastMessage: string;
  time?: string;
  hasRequest: boolean;
  requestStatus: 'pending' | 'accepted' | null;
  unread: number;
}

interface Message {
  id: number;
  content: string;
  sent: boolean;
  senderId: number;
  type: 'text' | 'file' | 'image';
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
  timestamp: string;
  status: 'sent' | 'read' | 'delivered';
}

interface SendMessagePayload {
  conversationId: number;
  content: string;
  type: 'text' | 'file' | 'image';
  senderId: number;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
}

interface MakerData {
  id: number;
  name: string;
  role?: string;
  handle?: string;
  avatar: string;
}

const LIST_LOAD_DELAY = 600;

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "Elena Rossi",
    role: "Pattern Maker • Milan",
    status: "ONLINE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    lastMessage: "Please send your Tech Pack PDF",
    hasRequest: false,
    requestStatus: null,
    unread: 2
  },
  {
    id: 2,
    name: "Hiroshi Denim",
    role: "Denim Specialist • Osaka",
    status: "AWAY",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "MOQ for raw denim is 100 units",
    hasRequest: true,
    requestStatus: 'accepted',
    unread: 0
  },
  {
    id: 3,
    name: "Sarah Chen",
    role: "Textile Sourcing • Shanghai",
    status: "OFFLINE",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "Silk samples arrived yesterday",
    hasRequest: false,
    requestStatus: null,
    unread: 1
  },
];

const initialMessages: Record<number, Message[]> = {
  1: [
    { id: 101, content: "Ciao! I'm ready to review your new collection.", sent: false, senderId: 99, type: 'text', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'read' },
    { id: 102, content: "Hi Elena, I'm finalizing the specs now.", sent: true, senderId: 1, type: 'text', timestamp: new Date(Date.now() - 3500000).toISOString(), status: 'read' },
    { id: 103, content: "Perfect. Please send the Tech Pack PDF when ready.", sent: false, senderId: 99, type: 'text', timestamp: new Date(Date.now() - 3400000).toISOString(), status: 'read' }
  ],
  2: [
    { id: 201, content: "Do you handle small batches for selvedge?", sent: true, senderId: 1, type: 'text', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'read' },
    { id: 202, content: "Yes, our MOQ for raw denim is 100 units per wash.", sent: false, senderId: 99, type: 'text', timestamp: new Date(Date.now() - 86000000).toISOString(), status: 'read' }
  ]
};

let conversations: Conversation[] = [...initialConversations];
let messages: Record<number, Message[]> = { ...initialMessages };

export const chatAPI = {
  getConversations: async (query: string = ""): Promise<Conversation[]> => {
    await new Promise(r => setTimeout(r, LIST_LOAD_DELAY));
    if (!query) return conversations;
    return conversations.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  },

  findOrCreateConversation: (makerData: MakerData): Conversation => {
    const existingIndex = conversations.findIndex(c => c.name === makerData.name);

    if (existingIndex !== -1) {
      return conversations[existingIndex];
    }

    const newId = Date.now();
    const newConversation: Conversation = {
      id: newId,
      name: makerData.name,
      role: makerData.role || makerData.handle || "Maker",
      status: "ONLINE",
      avatar: makerData.avatar,
      lastMessage: "New conversation started",
      hasRequest: false,
      requestStatus: null,
      unread: 0
    };

    conversations.unshift(newConversation);
    messages[newId] = [];

    return newConversation;
  },

  getMessages: async (id: number): Promise<{ content: Message[] }> => {
    await new Promise(r => setTimeout(r, LIST_LOAD_DELAY));
    return { content: messages[id] || [] };
  },

  sendMessage: async (payload: SendMessagePayload): Promise<Message> => {
    const newMsg: Message = {
      id: Date.now(),
      content: payload.content,
      sent: payload.senderId === 1,
      senderId: payload.senderId,
      type: payload.type,
      fileName: payload.fileName,
      fileType: payload.fileType,
      fileUrl: payload.fileUrl,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    if (!messages[payload.conversationId]) {
      messages[payload.conversationId] = [];
    }

    messages[payload.conversationId].push(newMsg);

    const convIndex = conversations.findIndex(c => c.id === payload.conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].lastMessage = payload.type === 'file' ? 'Sent a file' : payload.content;
      conversations[convIndex].time = 'Just now';

      const updatedConv = conversations.splice(convIndex, 1)[0];
      conversations.unshift(updatedConv);
    }

    setTimeout(() => {
      const replyMsg: Message = {
        id: Date.now() + 1,
        content: payload.type === 'file'
          ? "File received. I'll review the details shortly."
          : "Thanks for the message. I'm looking into it now.",
        sent: false,
        senderId: 99,
        type: 'text',
        timestamp: new Date().toISOString(),
        status: 'read'
      };

      messages[payload.conversationId].push(replyMsg);

      const cIndex = conversations.findIndex(c => c.id === payload.conversationId);
      if (cIndex !== -1) {
        conversations[cIndex].lastMessage = replyMsg.content;
        conversations[cIndex].unread += 1;
      }
      window.dispatchEvent(new CustomEvent('new-message'));
    }, 2000);

    return newMsg;
  },

  uploadFile: async (formData: FormData): Promise<{ fileName: string; fileSize: string }> => {
    await new Promise(r => setTimeout(r, 1500));
    const file = formData.get('file') as File;
    return { fileName: file.name, fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB' };
  }
};

export const useChatWebSocket = (onMessage: () => void) => {
  useEffect(() => { // 👈 Fixed: removed React. prefix
    const handler = () => onMessage();
    window.addEventListener('new-message', handler);
    return () => window.removeEventListener('new-message', handler);
  }, [onMessage]);

  return { sendMessage: () => { }, isConnected: true };
};