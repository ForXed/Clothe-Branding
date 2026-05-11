// ChatService.js

// No delay for creation to prevent UI flashing/layout shifts
const LIST_LOAD_DELAY = 600; 

// Initial Mock Data (The "Database" seed)
const initialConversations = [
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
    avatar: " https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", 
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
    avatar: " https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", 
    lastMessage: "Silk samples arrived yesterday",
    hasRequest: false,
    requestStatus: null,
    unread: 1
  },
];

const initialMessages = {
  1: [
    { id: 101, content: "Ciao! I'm ready to review your new collection.", sent: false, senderId: 99, type: 'text', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 102, content: "Hi Elena, I'm finalizing the specs now.", sent: true, senderId: 1, type: 'text', timestamp: new Date(Date.now() - 3500000).toISOString() },
    { id: 103, content: "Perfect. Please send the Tech Pack PDF when ready.", sent: false, senderId: 99, type: 'text', timestamp: new Date(Date.now() - 3400000).toISOString() }
  ],
  2: [
    { id: 201, content: "Do you handle small batches for selvedge?", sent: true, senderId: 1, type: 'text', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 202, content: "Yes, our MOQ for raw denim is 100 units per wash.", sent: false, senderId: 99, type: 'text', timestamp: new Date(Date.now() - 86000000).toISOString() }
  ]
};

// In-memory state for the session
let conversations = [...initialConversations];
let messages = { ...initialMessages };

export const chatAPI = {
  /**
   * Get all conversations (Simulates network load for list)
   */
  getConversations: async (query = "") => {
    await new Promise(r => setTimeout(r, LIST_LOAD_DELAY));
    if (!query) return conversations;
    return conversations.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  },

  /**
   * CRITICAL FIX: Find OR Create a conversation SYNCHRONOUSLY
   * Removed delay to prevent UI layout thrashing when navigating from Profile
   */
  findOrCreateConversation: (makerData) => {
    // 1. Check if conversation already exists by Name
    const existingIndex = conversations.findIndex(c => 
      c.name === makerData.name
    );

    if (existingIndex !== -1) {
      // RETURN EXISTING CHAT immediately
      return conversations[existingIndex];
    }

    // 2. If not found, CREATE NEW immediately (No await/delay)
    const newId = Date.now(); 
    const newConversation = {
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

    // Add to top of list
    conversations.unshift(newConversation);
    
    // Initialize empty message thread
    messages[newId] = [];

    return newConversation;
  },
  
  /**
   * Get messages for a specific conversation ID
   */
  getMessages: async (id) => {
    await new Promise(r => setTimeout(r, LIST_LOAD_DELAY));
    return { content: messages[id] || [] };
  },

  /**
   * Send a message
   */
  sendMessage: async (payload) => {
    const newMsg = { 
      id: Date.now(), 
      ...payload, 
      timestamp: new Date().toISOString(),
      status: 'sent' 
    };

    if (!messages[payload.conversationId]) {
      messages[payload.conversationId] = [];
    }
    
    messages[payload.conversationId].push(newMsg);
    
    // Update last message preview
    const convIndex = conversations.findIndex(c => c.id === payload.conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].lastMessage = payload.type === 'file' ? 'Sent a file' : payload.content;
      conversations[convIndex].time = 'Just now';
      
      // Move to top
      const updatedConv = conversations.splice(convIndex, 1)[0];
      conversations.unshift(updatedConv);
    }

    // Simulate auto-reply (This stays async as it's a background event)
    setTimeout(() => {
      const replyMsg = {
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

  uploadFile: async (formData) => {
    await new Promise(r => setTimeout(r, 1500));
    const file = formData.get('file');
    return { fileName: file.name, fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB' };
  }
};

// Helper hook for WebSocket simulation
export const useChatWebSocket = (onMessage) => {
  useEffect(() => {
    const handler = () => onMessage();
    window.addEventListener('new-message', handler);
    return () => window.removeEventListener('new-message', handler);
  }, [onMessage]);
  
  return { sendMessage: () => {}, isConnected: true };
};