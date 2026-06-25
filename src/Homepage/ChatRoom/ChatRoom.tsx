import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChatRoom.module.css';

// @ts-ignore
import { chatAPI } from './ChatService';

// Import new chat components
import AttachmentMenu from '../../chat/AttachmentMenu';
import VaultPicker from '../../chat/VaultPicker';
import type { Design } from '../../chat/VaultPicker';

// --- TypeScript Interfaces ---
export interface Chat {
  id: number | string;
  name: string;
  avatar: string;
  role: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  hasRequest?: boolean;
  requestStatus?: 'pending' | 'accepted' | null;
}

export interface Message {
  id: number | string;
  content: string;
  sent: boolean;
  senderId: number | string;
  type: 'text' | 'file' | 'image' | 'vault';
  fileName?: string | null;
  fileType?: string | null;
  fileUrl?: string | null;
  designs?: Design[];
  time: string;
  timestamp: string;
  status: 'sent' | 'read' | 'delivered';
}

interface Attachment {
  url: string;
  type: 'image' | 'file';
  name: string;
  fileType: string;
}

interface ChatRoomProps {
  initialData?: {
    newConversation?: {
      id: number | string;
      name: string;
      avatar: string;
      role: string;
      initialMessage?: string;
    };
  } | any;
  onMobileNavChange?: (hide: boolean) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ initialData, onMobileNavChange }) => {
  const navigate = useNavigate();

  // --- State Management ---
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string | number, Message[]>>({});
  const [selectedChatId, setSelectedChatId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMobileList, setShowMobileList] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [vaultDesigns, setVaultDesigns] = useState<Design[]>([]);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState<boolean>(false);
  const [showVaultPicker, setShowVaultPicker] = useState<boolean>(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState<boolean>(false);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [reqTitle, setReqTitle] = useState<string>('');
  const [reqDesc, setReqDesc] = useState<string>('');
  const [modalError, setModalError] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [viewDesign, setViewDesign] = useState<Design | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState<boolean>(false);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);

  // --- HELPERS ---
  const activeChat = chats.find(c => c.id === selectedChatId);
  const currentMessages = selectedChatId ? (messages[selectedChatId] || []) : [];

  // --- Format helpers ---
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
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();
    return currentDate !== prevDate;
  };

  // --- Initial Load ---
  useEffect(() => {
    const loadData = async () => {
      try {
        let conversations = await chatAPI.getConversations() as Chat[];

        if (initialData?.newConversation) {
          const { id, name, avatar, role, initialMessage } = initialData.newConversation;
          const exists = conversations.find(c => c.id === id || c.name === name);

          if (!exists) {
            const newConv = await chatAPI.findOrCreateConversation({ id, name, avatar, role }) as Chat;
            conversations = [newConv, ...conversations];

            if (initialMessage) {
              setTimeout(async () => {
                await chatAPI.sendMessage({
                  conversationId: newConv.id,
                  content: initialMessage,
                  type: 'text',
                  senderId: 1
                });
                const res = await chatAPI.getMessages(newConv.id) as { content: Message[] };
                setMessages(prev => ({
                  ...prev,
                  [newConv.id]: res.content.map(m => ({
                    ...m,
                    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'read' as const
                  }))
                }));
              }, 500);
            }

            setSelectedChatId(newConv.id);
            setShowMobileList(false);
          } else {
            setSelectedChatId(exists.id);
            setShowMobileList(false);
          }
        }

        const enhancedChats: Chat[] = conversations.map(c => ({
          ...c,
          status: c.id === 1 ? 'online' : c.id === 2 ? 'away' : 'offline',
          lastSeen: c.id === 3 ? new Date(Date.now() - 3600000).toISOString() : undefined,
          hasRequest: c.id === 2,
          requestStatus: c.id === 2 ? 'accepted' : null,
          unread: c.id === 1 ? 2 : 0
        }));

        setChats(enhancedChats);

        const allMessages: Record<string | number, Message[]> = {};
        for (let chat of conversations) {
          const res = await chatAPI.getMessages(chat.id) as { content: Message[] };
          allMessages[chat.id] = res.content.map(m => ({
            ...m,
            time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read' as const
          }));
        }
        setMessages(allMessages);
      } catch (error) {
        console.error("Failed to load chat", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [initialData]);

  // --- Sync Mobile Nav ---
  useEffect(() => {
    if (onMobileNavChange) {
      onMobileNavChange(!showMobileList);
    }
  }, [showMobileList, onMobileNavChange]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && !showScrollBtn) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages.length]);

  // Track scroll position for scroll-to-bottom button
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
  }, [selectedChatId]);

  // Close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(`.${styles.attachWrapper}`)) setAttachmentMenuOpen(false);
      if (!(event.target as HTMLElement).closest(`.${styles.optionsWrapper}`)) setOptionsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulate Read Status
  useEffect(() => {
    if (currentMessages.length > 0) {
      const lastMsg = currentMessages[currentMessages.length - 1];
      if (lastMsg && lastMsg.sent && lastMsg.status === 'sent') {
        const timer = setTimeout(() => {
          setMessages(prev => ({
            ...prev,
            [selectedChatId as string | number]: prev[selectedChatId as string | number].map((m, idx) =>
              idx === prev[selectedChatId as string | number].length - 1 ? { ...m, status: 'read' as const } : m
            )
          }));
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentMessages, selectedChatId]);

  // --- Handlers ---
  const handleChatSelect = async (id: number | string) => {
    setSelectedChatId(id);
    setShowMobileList(false);
    setChats(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleBackToList = () => {
    setShowMobileList(true);
    setSelectedChatId(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    const hasText = inputText.trim();
    const hasAttachment = attachment !== null;
    const hasVaultDesigns = vaultDesigns.length > 0;

    if ((!hasText && !hasAttachment && !hasVaultDesigns) || !selectedChatId) return;

    let newMsg: Message;

    if (hasVaultDesigns) {
      newMsg = {
        id: Date.now(),
        content: inputText || `Shared ${vaultDesigns.length} design${vaultDesigns.length !== 1 ? 's' : ''} from Brand Vault`,
        sent: true,
        senderId: 1,
        type: 'vault',
        designs: vaultDesigns,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
    } else if (hasAttachment) {
      newMsg = {
        id: Date.now(),
        content: inputText,
        sent: true,
        senderId: 1,
        type: attachment.type === 'image' ? 'image' : 'file',
        fileName: attachment.name,
        fileType: attachment.fileType,
        fileUrl: attachment.url,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
    } else {
      newMsg = {
        id: Date.now(),
        content: inputText,
        sent: true,
        senderId: 1,
        type: 'text',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
    }

    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
    }));

    const lastMessageText = hasVaultDesigns 
      ? `📦 Shared ${vaultDesigns.length} design${vaultDesigns.length !== 1 ? 's' : ''}`
      : hasAttachment 
        ? attachment.type === 'image' ? 'Sent an image' : 'Sent a file'
        : inputText;

    setChats(prev => prev.map(chat =>
      chat.id === selectedChatId
        ? { ...chat, lastMessage: lastMessageText, time: 'Now' }
        : chat
    ));

    setInputText('');
    setAttachment(null);
    setVaultDesigns([]);

    try {
      await chatAPI.sendMessage({
        conversationId: selectedChatId,
        content: newMsg.content,
        type: newMsg.type,
        senderId: 1,
        designs: newMsg.designs
      });
    } catch (e) { console.error(e); }
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

  const handleSubmitRequest = () => {
    if (!reqTitle.trim() || !reqDesc.trim()) {
      setModalError('Please fill in both fields.');
      return;
    }
    setChats(prev => prev.map(chat =>
      chat.id === selectedChatId ? { ...chat, hasRequest: true, requestStatus: 'pending' } : chat
    ));
    setReqTitle(''); setReqDesc(''); setModalError('');
    setShowRequestModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleViewProfile = () => {
    if (activeChat) navigate(`/platform/profile/${activeChat.name.toLowerCase().replace(/\s+/g, '-')}`);
    setOptionsMenuOpen(false);
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

  const filteredChats = chats.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesCategory = true;
    if (activeFilter === 'Pending Review') matchesCategory = c.requestStatus === 'pending';
    else if (activeFilter === 'Completed') matchesCategory = c.requestStatus === 'accepted';
    else if (activeFilter === 'Active') matchesCategory = (c.unread || 0) > 0 || c.requestStatus === 'accepted';
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className={styles.loadingState}>Loading Chat Infrastructure...</div>;

  return (
    <div className={styles.container}>
      {showSuccessToast && (
        <div className={styles.notificationToast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Request Submitted!</span>
        </div>
      )}

      {viewImage && (
        <div className={styles.fullScreenImageOverlay} onClick={() => setViewImage(null)}>
          <img src={viewImage} alt="Full view" className={styles.fullScreenImage} />
        </div>
      )}

      {/* Design Preview Modal */}
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

      {/* Vault Picker Modal */}
      {showVaultPicker && (
        <VaultPicker
          onClose={() => setShowVaultPicker(false)}
          onSelect={handleVaultSelect}
        />
      )}

      {/* LEFT SIDEBAR */}
      <div className={`${styles.chatList} ${!showMobileList ? styles.chatListHidden : ''}`}>
        <div className={styles.listHeader}>
          <h3>My Requests</h3>
          <span className={styles.badgeTotal}>{chats.length}</span>
        </div>

        <div className={styles.labelScroller}>
          {['All', 'Active', 'Pending Review', 'Completed'].map((f) => (
            <button key={f} type="button" className={`${styles.labelPill} ${activeFilter === f ? styles.active : ''}`} onClick={() => setActiveFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        <div className={styles.searchWrapper}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input type="text" placeholder="Search makers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className={styles.chatListScroll}>
          {filteredChats.map((chat) => (
            <div key={chat.id} className={`${styles.chatRow} ${selectedChatId === chat.id ? styles.selected : ''}`} onClick={() => handleChatSelect(chat.id)}>
              <div className={styles.chatAvatarWrapper}>
                <img src={chat.avatar} alt={chat.name} className={styles.chatAvatar} />
                {chat.status && (
                  <span className={`${styles.statusDot} ${styles[chat.status]}`} />
                )}
              </div>
              <div className={styles.chatDetails}>
                <div className={styles.chatTop}>
                  <span className={styles.chatName}>{chat.name}</span>
                  <span className={styles.chatTime}>{chat.time}</span>
                </div>
                <div className={styles.chatBottom}>
                  <span className={styles.chatPreview}>{chat.lastMessage}</span>
                  {(chat.unread || 0) > 0 && <span className={styles.unreadDot}>{chat.unread}</span>}
                </div>
                {chat.hasRequest && (
                  <span className={`${styles.tagMini} ${styles['tag' + (chat.requestStatus || '')]}`}>
                    {chat.requestStatus === 'pending' ? 'Reviewing' : 'Accepted'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT MAIN AREA */}
      <div className={`${styles.msgMain} ${!showMobileList ? styles.msgMainVisible : ''}`}>
        {selectedChatId && activeChat ? (
          <>
            {/* Header */}
            <div className={styles.mainHeader}>
              <div className={styles.headerUser}>
                <button type="button" className={styles.mobileBackBtn} onClick={handleBackToList}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className={styles.headerAvatarWrapper}>
                  <img src={activeChat.avatar} alt="" className={styles.headerAvatar} />
                  {activeChat.status && (
                    <span className={`${styles.statusDot} ${styles.headerStatusDot} ${styles[activeChat.status]}`} />
                  )}
                </div>
                <div className={styles.headerInfo}>
                  <span className={styles.headerName}>{activeChat.name}</span>
                  <span className={styles.headerStatus}>
                    {activeChat.status === 'online' ? (
                      <><span className={styles.onlineIndicator} /> Online</>
                    ) : activeChat.status === 'away' ? (
                      <><span className={styles.awayIndicator} /> Away</>
                    ) : (
                      `Last seen ${formatLastSeen(activeChat.lastSeen)}`
                    )}
                  </span>
                </div>
              </div>
              <div className={styles.headerActions}>
                <button type="button" className={styles.newRequestBtn} onClick={() => setShowRequestModal(true)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Request Custom Order</span>
                </button>
                <div className={styles.optionsWrapper}>
                  <button type="button" className={styles.iconBtn} onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                  {optionsMenuOpen && (
                    <div className={styles.dropdownMenu}>
                      <button type="button" onClick={handleViewProfile}>View Maker Profile</button>
                      <button type="button">Search in Conversation</button>
                      <button type="button">Mute Notifications</button>
                      <div className={styles.divider}></div>
                      <button type="button" className={styles.dangerText}>Delete Chat</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Banner */}
            {activeChat.hasRequest && (
              <div className={`${styles.agreementBanner} ${styles[activeChat.requestStatus || '']}`}>
                {activeChat.requestStatus === 'pending' ? (
                  <div className={styles.bannerContent}>
                    <div className={styles.bannerText}><strong>Under Review</strong><p>Maker is checking details.</p></div>
                    <span className={styles.statusBadgePending}>Pending</span>
                  </div>
                ) : (
                  <div className={styles.bannerSuccess}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Request Accepted!</span>
                  </div>
                )}
              </div>
            )}

            {/* Messages Area */}
            <div className={styles.chatContentWrapper}>
              <div className={styles.messagesArea} ref={messagesAreaRef}>
                {currentMessages.map((msg, idx) => {
                  const showDate = shouldShowDateSeparator(msg, currentMessages[idx - 1]);
                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className={styles.dateSeparator}>
                          <span>{formatDateSeparator(msg.timestamp)}</span>
                        </div>
                      )}
                      <div className={`${styles.message} ${msg.sent ? styles.sent : styles.received}`}>
                        <div className={styles.bubble}>
                          {msg.type === 'vault' ? (
                            <div className={styles.vaultMessage}>
                              <div className={styles.vaultHeader}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.vaultDesignArrow}>
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
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
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
                          {msg.sent && (
                            <span className={`${styles.msgStatus} ${msg.status === 'read' ? styles.statusRead : styles.statusSent}`}>
                              {msg.status === 'read' ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /><polyline points="16 6 9 17 4 12" transform="translate(4,0)" /></svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                              )}
                            </span>
                          )}
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

              {/* Attachment Preview - File/Image */}
              {attachment && (
                <div className={styles.attachmentPreview}>
                  {attachment.type === 'image' ? (
                    <div className={styles.previewImageWrapper}><img src={attachment.url} alt="Preview" /></div>
                  ) : (
                    <div className={styles.filePreviewCard}>
                      <div className={styles.fileIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              )}

              {/* Attachment Preview - Vault Designs */}
              {vaultDesigns.length > 0 && (
                <div className={styles.attachmentPreview}>
                  <div className={styles.vaultPreview}>
                    <div className={styles.vaultPreviewHeader}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                      {vaultDesigns.length > 3 && (
                        <div className={styles.vaultPreviewMore}>
                          +{vaultDesigns.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <button type="button" className={styles.removeAttachBtn} onClick={() => setVaultDesigns([])}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              )}

              <div className={styles.inputZone}>
                <div className={styles.attachWrapper}>
                  <button 
                    type="button" 
                    className={styles.btnAttach} 
                    onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  placeholder="Message..."
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                />

                <button type="button" className={styles.btnSend} onClick={handleSendMessage}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9" /></svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z" /></svg></div>
            <p>Select a maker to start chatting</p>
          </div>
        )}
      </div>

      {showRequestModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRequestModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Request Custom Order</h3>
            <input type="text" placeholder="Title" value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} autoFocus style={{ borderColor: modalError && !reqTitle ? 'var(--brut-danger)' : '' }} />
            <textarea placeholder="Description" value={reqDesc} onChange={(e) => setReqDesc(e.target.value)} style={{ width: '100%', padding: '12px', background: 'var(--brut-bg)', border: `1px solid ${modalError && !reqDesc ? 'var(--brut-danger)' : 'var(--brut-border)'}`, borderRadius: '8px', color: 'var(--brut-text)', marginBottom: '16px', minHeight: '100px' }} />
            {modalError && <div style={{ color: 'var(--brut-danger)', fontSize: '0.85rem', marginBottom: '12px' }}>⚠️ {modalError}</div>}
            <div className={styles.modalActions}>
              <button type="button" onClick={() => { setShowRequestModal(false); setModalError(''); }}>Cancel</button>
              <button type="button" className={styles.primaryBtn} onClick={handleSubmitRequest}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;