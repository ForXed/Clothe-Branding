import React, { useState, useRef, useEffect } from 'react';
import styles from './Messages.module.css';

// Import chat components
import AttachmentMenu from '../../../chat/AttachmentMenu';
import VaultPicker from '../../../chat/VaultPicker';
import QuoteCard from '../../../chat/QuoteCard';
import QuoteForm from '../../../chat/QuoteForm';
import type { Design } from '../../../chat/VaultPicker';
import type { QuoteData } from '../../../chat/QuoteForm';

interface Chat {
  id: number;
  name: string;
  label: string;
  avatar: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: number;
  content: string;
  sent: boolean;
  type: 'text' | 'file' | 'image' | 'vault' | 'quote';
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
  designs?: Design[];
  quote?: QuoteData;
  time: string;
  timestamp?: string;
}

interface Attachment {
  url: string;
  type: 'image' | 'file';
  name: string;
  fileType: string;
}

interface MessagesProps {
  onMobileNavChange?: (hide: boolean) => void;
  isCollapsed?: boolean;
}

const Messages: React.FC<MessagesProps> = ({ onMobileNavChange, isCollapsed = false }) => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showTagDropdown, setShowTagDropdown] = useState<boolean>(false);
  const [activeLabel, setActiveLabel] = useState<string>('All');
  
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [vaultDesigns, setVaultDesigns] = useState<Design[]>([]);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState<boolean>(false);
  const [showVaultPicker, setShowVaultPicker] = useState<boolean>(false);
  const [showQuoteForm, setShowQuoteForm] = useState<boolean>(false);
  
  const [orderAccepted, setOrderAccepted] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
  const [newLabelName, setNewLabelName] = useState<string>('');
  const [showMobileList, setShowMobileList] = useState<boolean>(true);
  const [labels, setLabels] = useState<string[]>(['All', 'Priority', 'In-Production', 'New Inquiry']);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [viewDesign, setViewDesign] = useState<Design | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState<boolean>(false);
  
  // Messages state with timestamps for date separators
  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, content: 'Hi! Can we brand the 450GSM hoodie?', sent: false, type: 'text', time: '10:30 AM', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 2, content: 'Absolutely. Send the logo file.', sent: true, type: 'text', time: '10:32 AM', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 3, content: 'Here are the design specs from our vault.', sent: true, type: 'text', time: '2:15 PM', timestamp: new Date().toISOString() },
    ],
    2: [],
    3: []
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentBtnRef = useRef<HTMLDivElement>(null);
  const tagBtnRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: 'John Doe', label: 'Priority', status: 'online', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', lastMessage: 'When will my order arrive?', time: '2m ago', unread: 2 },
    { id: 2, name: 'Jane Smith', label: 'In-Production', status: 'away', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', lastMessage: 'Thanks for the quick response!', time: '1h ago', unread: 0 },
    { id: 3, name: 'Mike Johnson', label: 'New Inquiry', status: 'offline', lastSeen: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', lastMessage: 'Do you have this in XL?', time: '3h ago', unread: 1 },
  ]);

  // Format last seen time
  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return '';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format date separator
  const formatDateSeparator = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const shouldShowDateSeparator = (currentMsg: Message, prevMsg?: Message) => {
    if (!prevMsg || !currentMsg.timestamp || !prevMsg.timestamp) return false;
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();
    return currentDate !== prevDate;
  };

  useEffect(() => {
    if (onMobileNavChange) onMobileNavChange(!showMobileList);
  }, [showMobileList, onMobileNavChange]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [selectedChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && !showScrollBtn && selectedChat) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedChat]);

  // Track scroll position
  useEffect(() => {
    const messagesArea = messagesAreaRef.current;
    if (!messagesArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = messagesArea;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollBtn(!isNearBottom);
    };

    messagesArea.addEventListener('scroll', handleScroll);
    return () => messagesArea.removeEventListener('scroll', handleScroll);
  }, [selectedChat]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachmentBtnRef.current && !attachmentBtnRef.current.contains(event.target as Node)) setAttachmentMenuOpen(false);
      if (!(event.target as HTMLElement).closest(`.${styles.optionsWrapper}`)) setShowOptions(false);
      if (tagBtnRef.current && !tagBtnRef.current.contains(event.target as Node)) setShowTagDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (file: File) => {
    const isImage = file.type.startsWith('image/');
    setAttachment({
      url: URL.createObjectURL(file),
      type: isImage ? 'image' : 'file',
      name: file.name,
      fileType: file.type
    });
    setVaultDesigns([]);
  };

  const handleVaultSelect = (designs: Design[]) => {
    setVaultDesigns(designs);
    setAttachment(null);
    setShowVaultPicker(false);
  };

  const handleSendMessage = () => {
    if (!selectedChat || !textareaRef.current) return;
    
    const inputText = textareaRef.current.value.trim();
    const hasText = inputText.length > 0;
    const hasAttachment = attachment !== null;
    const hasVaultDesigns = vaultDesigns.length > 0;

    if (!hasText && !hasAttachment && !hasVaultDesigns) return;

    const now = new Date();
    let newMsg: Message;

    if (hasVaultDesigns) {
      newMsg = {
        id: Date.now(),
        content: inputText || `Shared ${vaultDesigns.length} design${vaultDesigns.length !== 1 ? 's' : ''} from Brand Vault`,
        sent: true,
        type: 'vault',
        designs: vaultDesigns,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: now.toISOString()
      };
    } else if (hasAttachment) {
      newMsg = {
        id: Date.now(),
        content: inputText,
        sent: true,
        type: attachment.type === 'image' ? 'image' : 'file',
        fileName: attachment.name,
        fileType: attachment.fileType,
        fileUrl: attachment.url,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: now.toISOString()
      };
    } else {
      newMsg = {
        id: Date.now(),
        content: inputText,
        sent: true,
        type: 'text',
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: now.toISOString()
      };
    }

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg]
    }));

    const lastMessageText = hasVaultDesigns 
      ? `📦 Shared ${vaultDesigns.length} design${vaultDesigns.length !== 1 ? 's' : ''}`
      : hasAttachment 
        ? attachment.type === 'image' ? 'Sent an image' : 'Sent a file'
        : inputText;

    setChats(prev => prev.map(chat =>
      chat.id === selectedChat
        ? { ...chat, lastMessage: lastMessageText, time: 'Now' }
        : chat
    ));

    textareaRef.current.value = '';
    setAttachment(null);
    setVaultDesigns([]);
  };

  const handleQuoteSubmit = (quote: QuoteData) => {
    if (!selectedChat) return;

    const newMsg: Message = {
      id: Date.now(),
      content: 'Sent a production quote',
      sent: true,
      type: 'quote',
      quote,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg]
    }));

    setChats(prev => prev.map(chat =>
      chat.id === selectedChat
        ? { ...chat, lastMessage: '📋 Sent a quote', time: 'Now' }
        : chat
    ));

    setShowQuoteForm(false);
  };

  const handleQuoteAccept = (quoteId: string) => {
    setMessages(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(chatId => {
        updated[Number(chatId)] = updated[Number(chatId)].map(msg => {
          if (msg.type === 'quote' && msg.quote?.id === quoteId) {
            return { ...msg, quote: { ...msg.quote!, status: 'accepted' as const } };
          }
          return msg;
        });
      });
      return updated;
    });
  };

  const handleQuoteDecline = (quoteId: string) => {
    setMessages(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(chatId => {
        updated[Number(chatId)] = updated[Number(chatId)].map(msg => {
          if (msg.type === 'quote' && msg.quote?.id === quoteId) {
            return { ...msg, quote: { ...msg.quote!, status: 'declined' as const } };
          }
          return msg;
        });
      });
      return updated;
    });
  };

  const handleAcceptOrder = () => {
    setOrderAccepted(true);
    setShowBanner(false); // Hide banner after accepting
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleDeclineOrder = () => {
    setShowBanner(false); // Hide banner after declining too
  };

  const handleAddLabel = () => {
    if (newLabelName.trim() && !labels.includes(newLabelName.trim())) {
      setLabels([...labels, newLabelName.trim()]);
      setNewLabelName('');
      setShowLabelModal(false);
    }
  };

  const handleUpdateChatTag = (newTag: string) => {
    if (!selectedChat) return;
    setChats(prev => prev.map(chat => chat.id === selectedChat ? { ...chat, label: newTag } : chat));
    setShowTagDropdown(false);
  };

  const handleChatSelect = (id: number) => {
    setSelectedChat(id);
    setShowMobileList(false);
    // Reset banner state for this chat
    setShowBanner(true);
    setOrderAccepted(false);
  };

  const handleBackToList = () => {
    setShowMobileList(true);
    setSelectedChat(null);
  };

  const handleImageClick = (url: string) => setViewImage(url);

  const handleFileClick = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredChats = activeLabel === 'All' ? chats : chats.filter(c => c.label === activeLabel);
  const activeChatData = chats.find(c => c.id === selectedChat);
  const currentMessages = selectedChat ? (messages[selectedChat] || []) : [];

  return (
    <div className={`${styles.container} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
      {showNotification && (
        <div className={styles.notificationToast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Order Initialized Successfully!</span>
        </div>
      )}

      {/* Image Viewer */}
      {viewImage && (
        <div className={styles.fullScreenImageOverlay} onClick={() => setViewImage(null)}>
          <img src={viewImage} alt="Full view" className={styles.fullScreenImage} />
        </div>
      )}

      {/* Design Preview Modal (PDF-like) */}
      {viewDesign && (
        <div className={styles.fullScreenImageOverlay} onClick={() => setViewDesign(null)}>
          <div className={styles.designPreviewModal} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.modalCloseBtn} onClick={() => setViewDesign(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div className={styles.designPreviewHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <div>
                <h3>{viewDesign.name}</h3>
                <span>Brand Vault Design</span>
              </div>
            </div>
            <div className={styles.designPreviewContent}>
              {viewDesign.thumbnail && (
                <div className={styles.designPreviewImage}>
                  <img src={viewDesign.thumbnail} alt={viewDesign.name} />
                </div>
              )}
              <div className={styles.designPreviewMeta}>
                {viewDesign.techPack && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Tech Pack</span>
                    <span className={styles.metaValue}>{viewDesign.techPack.name} ({viewDesign.techPack.size})</span>
                  </div>
                )}
                {viewDesign.colors.length > 0 && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Colors</span>
                    <div className={styles.colorSwatches}>
                      {viewDesign.colors.map(color => (
                        <div key={color.id} className={styles.colorSwatch} style={{ background: color.hex }} title={color.name} />
                      ))}
                    </div>
                  </div>
                )}
                {viewDesign.fonts.length > 0 && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Fonts</span>
                    <span className={styles.metaValue}>{viewDesign.fonts.map(f => f.family).join(', ')}</span>
                  </div>
                )}
                {viewDesign.logos.length > 0 && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Logos</span>
                    <span className={styles.metaValue}>{viewDesign.logos.length} logo{viewDesign.logos.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {viewDesign.measurements && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Measurements</span>
                    <pre className={styles.measurementsText}>{viewDesign.measurements}</pre>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.designPreviewActions}>
              {viewDesign.techPack && (
                <button type="button" className={styles.downloadBtn} onClick={() => handleFileClick(viewDesign.techPack!.url, viewDesign.techPack!.name)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download Tech Pack
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && activeChatData && (
        <div className={styles.modalOverlay} onClick={() => setShowOrderModal(false)}>
          <div className={styles.orderModal} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.modalCloseBtn} onClick={() => setShowOrderModal(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div className={styles.orderModalHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
                <path d="M12 2v13"/>
                <path d="M8 6l4-4 4 4"/>
              </svg>
              <div>
                <h3>Custom Order Request</h3>
                <span>From {activeChatData.name}</span>
              </div>
            </div>
            <div className={styles.orderModalContent}>
              <div className={styles.orderDetailRow}>
                <span className={styles.orderDetailLabel}>Customer</span>
                <span className={styles.orderDetailValue}>{activeChatData.name}</span>
              </div>
              <div className={styles.orderDetailRow}>
                <span className={styles.orderDetailLabel}>Status</span>
                <span className={`${styles.orderStatusBadge} ${orderAccepted ? styles.accepted : styles.pending}`}>
                  {orderAccepted ? 'Accepted' : 'Pending Review'}
                </span>
              </div>
              <div className={styles.orderDetailRow}>
                <span className={styles.orderDetailLabel}>Label</span>
                <span className={`${styles.tagMini} ${styles['tag' + activeChatData.label.replace(/-/g, '')]}`}>
                  {activeChatData.label}
                </span>
              </div>
              <div className={styles.orderDetailRow}>
                <span className={styles.orderDetailLabel}>Last Message</span>
                <span className={styles.orderDetailValue}>{activeChatData.lastMessage}</span>
              </div>
            </div>
            <div className={styles.orderModalActions}>
              {!orderAccepted && (
                <>
                  <button type="button" className={styles.orderDeclineBtn} onClick={() => { handleDeclineOrder(); setShowOrderModal(false); }}>
                    Decline Order
                  </button>
                  <button type="button" className={styles.orderAcceptBtn} onClick={() => { handleAcceptOrder(); setShowOrderModal(false); }}>
                    Accept Order
                  </button>
                </>
              )}
              {orderAccepted && (
                <button type="button" className={styles.orderAcceptBtn} onClick={() => setShowOrderModal(false)}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vault Picker Modal */}
      {showVaultPicker && (
        <VaultPicker
          onClose={() => setShowVaultPicker(false)}
          onSelect={handleVaultSelect}
        />
      )}

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <QuoteForm
          onClose={() => setShowQuoteForm(false)}
          onSubmit={handleQuoteSubmit}
        />
      )}

      {/* Chat List Sidebar */}
      <div className={`${styles.chatList} ${!showMobileList ? styles.chatListHidden : ''}`}>
        <div className={styles.listHeader}>
          <h3>Messages</h3>
          <span className={styles.badgeTotal}>{chats.length}</span>
        </div>
        <div className={styles.labelScroller}>
          {labels.map((l) => (
            <button key={l} type="button" className={`${styles.labelPill} ${activeLabel === l ? styles.active : ''}`} onClick={() => setActiveLabel(l)}>
              {l}
            </button>
          ))}
          <button type="button" className={styles.addLabelBtn} onClick={() => setShowLabelModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
        <div className={styles.searchWrapper}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input type="text" placeholder="Search customers..." />
        </div>
        <div className={styles.chatListScroll}>
          {filteredChats.map((chat) => (
            <div key={chat.id} className={`${styles.chatRow} ${selectedChat === chat.id ? styles.selected : ''}`} onClick={() => handleChatSelect(chat.id)}>
              <div className={styles.chatAvatarWrapper}>
                <img src={chat.avatar} alt={chat.name} className={styles.chatAvatar} />
                {chat.status && <span className={`${styles.statusDot} ${styles[chat.status]}`} />}
              </div>
              <div className={styles.chatDetails}>
                <div className={styles.chatTop}>
                  <span className={styles.chatName}>{chat.name}</span>
                  <span className={styles.chatTime}>{chat.time}</span>
                </div>
                <div className={styles.chatBottom}>
                  <span className={styles.chatPreview}>{chat.lastMessage}</span>
                  {chat.unread > 0 && <span className={styles.unreadDot}>{chat.unread}</span>}
                </div>
                <span className={`${styles.tagMini} ${styles['tag' + chat.label.replace(/-/g, '')]}`}>{chat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${styles.msgMain} ${!showMobileList ? styles.msgMainVisible : ''}`}>
        {selectedChat && activeChatData ? (
          <>
            {/* Compact Header */}
            <div className={styles.mainHeader}>
              <div className={styles.headerUser}>
                <button type="button" className={styles.mobileBackBtn} onClick={handleBackToList}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
                <div className={styles.headerAvatarWrapper}>
                  <img src={activeChatData.avatar} alt="" className={styles.headerAvatar} />
                  {activeChatData.status && (
                    <span className={`${styles.statusDot} ${styles.headerStatusDot} ${styles[activeChatData.status]}`} />
                  )}
                </div>
                <div className={styles.headerInfo}>
                  <span className={styles.headerName}>{activeChatData.name}</span>
                  <span className={styles.headerStatus}>
                    {activeChatData.status === 'online' ? (
                      <><span className={styles.onlineIndicator} /> Online</>
                    ) : activeChatData.status === 'away' ? (
                      <><span className={styles.awayIndicator} /> Away</>
                    ) : (
                      `Last seen ${formatLastSeen(activeChatData.lastSeen)}`
                    )}
                  </span>
                </div>
              </div>
              <div className={styles.headerActions}>
                <button 
                  type="button" 
                  className={styles.quoteBtn}
                  onClick={() => setShowQuoteForm(true)}
                  title="Send Quote"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <span>Quote</span>
                </button>
                <div className={styles.tagSelectorWrapper} ref={tagBtnRef}>
                  <button type="button" className={styles.tagSelectorBtn} onClick={() => setShowTagDropdown(!showTagDropdown)}>
                    <span className={`${styles.tagMini} ${styles['tag' + activeChatData.label.replace(/-/g, '')]}`}>{activeChatData.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {showTagDropdown && (
                    <div className={styles.tagDropdownMenu}>
                      {labels.filter(l => l !== 'All').map(label => (
                        <button key={label} type="button" onClick={() => handleUpdateChatTag(label)}>
                          <span className={`${styles.tagMini} ${styles['tag' + label.replace(/-/g, '')]}`}>{label}</span>
                          {activeChatData.label === label && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.optionsWrapper}>
                  <button type="button" className={styles.iconBtn} onClick={() => setShowOptions(!showOptions)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                  {showOptions && (
                    <div className={styles.dropdownMenu}>
                      <button type="button">Pin Chat</button>
                      <button type="button">Search in Conversation</button>
                      <button type="button">Mute Notifications</button>
                      <div className={styles.divider}></div>
                      <button type="button" className={styles.dangerText}>Delete Conversation</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Banner - only shows if showBanner is true */}
            {showBanner && !orderAccepted && (
              <div className={styles.agreementBanner}>
                <div className={styles.bannerContent}>
                  <div className={styles.bannerText}>
                    <strong>Custom Order Discussion</strong>
                    <p>Review the order details and accept or decline.</p>
                  </div>
                  <div className={styles.bannerActions}>
                    <button type="button" className={styles.btnDecline} onClick={handleDeclineOrder}>
                      Decline
                    </button>
                    <button type="button" className={styles.btnViewOrder} onClick={() => setShowOrderModal(true)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      View Order
                    </button>
                    <button type="button" className={styles.btnAccept} onClick={handleAcceptOrder}>
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Content */}
            <div className={styles.chatContentWrapper}>
              <div className={styles.messagesArea} ref={messagesAreaRef}>
                {currentMessages.map((msg, idx) => {
                  const showDate = shouldShowDateSeparator(msg, currentMessages[idx - 1]);
                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && msg.timestamp && (
                        <div className={styles.dateSeparator}>
                          <span>{formatDateSeparator(msg.timestamp)}</span>
                        </div>
                      )}
                      <div className={`${styles.message} ${msg.sent ? styles.sent : styles.received}`}>
                        <div className={styles.bubble}>
                          {msg.type === 'quote' && msg.quote ? (
                            <QuoteCard
                              quote={msg.quote}
                              sent={msg.sent}
                              onAccept={handleQuoteAccept}
                              onDecline={handleQuoteDecline}
                            />
                          ) : msg.type === 'vault' ? (
                            <div className={styles.vaultMessage}>
                              <div className={styles.vaultHeader}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14 2 14 8 20 8"/>
                                </svg>
                                <span>Brand Vault Designs</span>
                              </div>
                              <div className={styles.vaultDesigns}>
                                {msg.designs?.map(design => (
                                  <div 
                                    key={design.id} 
                                    className={styles.vaultDesignCard}
                                    onClick={() => setViewDesign(design)}
                                  >
                                    <div className={styles.vaultDesignThumb}>
                                      {design.thumbnail ? (
                                        <img src={design.thumbnail} alt={design.name} />
                                      ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                          <polyline points="14 2 14 8 20 8"/>
                                        </svg>
                                      )}
                                    </div>
                                    <div className={styles.vaultDesignInfo}>
                                      <strong>{design.name}</strong>
                                      <div className={styles.vaultDesignMeta}>
                                        {design.techPack && <span>📄 {design.techPack.name}</span>}
                                        {design.colors.length > 0 && <span>🎨 {design.colors.length}</span>}
                                        {design.logos.length > 0 && <span>🖼️ {design.logos.length}</span>}
                                      </div>
                                    </div>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.vaultDesignArrow}>
                                      <polyline points="9 18 15 12 9 6"/>
                                    </svg>
                                  </div>
                                ))}
                              </div>
                              {msg.content && !msg.content.startsWith('Shared') && (
                                <p className={styles.vaultNote}>{msg.content}</p>
                              )}
                            </div>
                          ) : msg.type === 'image' || msg.fileType?.startsWith('image/') ? (
                            <div className={styles.imageBubble} onClick={() => handleImageClick(msg.fileUrl || '')}>
                              <img src={msg.fileUrl || ''} alt="Sent" />
                            </div>
                          ) : msg.type === 'file' ? (
                            <div className={styles.filePreview} onClick={() => handleFileClick(msg.fileUrl || '', msg.fileName || 'file')}>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              <div className={styles.filePreviewContent}>
                                <span className={styles.filePreviewName}>{msg.fileName}</span>
                                <span className={styles.filePreviewType}>
                                  {msg.fileType ? msg.fileType.split('/')[1].toUpperCase() : 'FILE'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p>{msg.content}</p>
                          )}
                        </div>
                        <div className={styles.msgMeta}>
                          <span className={styles.msgTime}>{msg.time}</span>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll to bottom button */}
              {showScrollBtn && (
                <button type="button" className={styles.scrollToBottom} onClick={scrollToBottom}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
              )}

              {/* Attachment Preview */}
              {attachment && (
                <div className={styles.attachmentPreview}>
                  {attachment.type === 'image' ? (
                    <div className={styles.previewImageWrapper}><img src={attachment.url} alt="Preview" /></div>
                  ) : (
                    <div className={styles.filePreviewCard}>
                      <div className={styles.fileIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className={styles.fileInfo}>
                        <span className={styles.fileName}>{attachment.name}</span>
                        <span className={styles.fileSize}>
                          {(attachment.fileType ? attachment.fileType.split('/')[1] : 'FILE').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                  <button type="button" className={styles.removeAttachBtn} onClick={() => setAttachment(null)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Vault Preview */}
              {vaultDesigns.length > 0 && (
                <div className={styles.attachmentPreview}>
                  <div className={styles.vaultPreview}>
                    <div className={styles.vaultPreviewHeader}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span>{vaultDesigns.length} design{vaultDesigns.length !== 1 ? 's' : ''} from Brand Vault</span>
                    </div>
                    <div className={styles.vaultPreviewGrid}>
                      {vaultDesigns.slice(0, 3).map(design => (
                        <div key={design.id} className={styles.vaultPreviewItem}>
                          {design.thumbnail ? (
                            <img src={design.thumbnail} alt={design.name} />
                          ) : (
                            <div className={styles.vaultPreviewPlaceholder}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                      {vaultDesigns.length > 3 && (
                        <div className={styles.vaultPreviewMore}>+{vaultDesigns.length - 3}</div>
                      )}
                    </div>
                  </div>
                  <button type="button" className={styles.removeAttachBtn} onClick={() => setVaultDesigns([])}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Input Zone */}
              <div className={styles.inputZone}>
                <div className={styles.attachWrapper} ref={attachmentBtnRef}>
                  <button 
                    type="button" 
                    className={styles.btnAttach} 
                    onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  </button>
                  
                  <AttachmentMenu
                    isOpen={attachmentMenuOpen}
                    onClose={() => setAttachmentMenuOpen(false)}
                    onFileSelect={handleFileSelect}
                    onVaultSelect={() => setShowVaultPicker(true)}
                  />
                </div>

                <textarea 
                  ref={textareaRef} 
                  className={styles.msgInput} 
                  placeholder="Type a message..." 
                  rows={1}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                />
                <button type="button" className={styles.btnSend} onClick={handleSendMessage}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z" />
              </svg>
            </div>
            <p>Select a conversation to begin</p>
          </div>
        )}
      </div>

      {/* Label Modal */}
      {showLabelModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLabelModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Create New Label</h3>
            <input 
              type="text" 
              value={newLabelName} 
              onChange={(e) => setNewLabelName(e.target.value)} 
              placeholder="Label name (e.g., VIP)" 
              autoFocus 
            />
            <div className={styles.modalActions}>
              <button type="button" onClick={() => setShowLabelModal(false)}>Cancel</button>
              <button type="button" className={styles.primaryBtn} onClick={handleAddLabel}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;