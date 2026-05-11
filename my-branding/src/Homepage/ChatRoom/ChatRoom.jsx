import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChatRoom.module.css';
import { chatAPI } from './ChatService';

const ChatRoom = ({ initialData, onMobileNavChange }) => {
  const navigate = useNavigate();
  
  // --- State Management ---
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Mobile Navigation State
  const [showMobileList, setShowMobileList] = useState(true);
  
  // UI States
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  
  // Attachment State
  const [attachment, setAttachment] = useState(null);
  
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  
  // Request Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [modalError, setModalError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Image Viewer State
  const [viewImage, setViewImage] = useState(null);

  // Refs
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  // We keep the ref in case you want to manually scroll later, 
  // but we are NOT using it for auto-scrolling anymore.
  const messagesEndRef = useRef(null);

  // --- HELPERS ---
  const activeChat = chats.find(c => c.id === selectedChatId);
  const currentMessages = selectedChatId ? (messages[selectedChatId] || []) : [];

  // --- Initial Load ---
  useEffect(() => {
    const loadData = async () => {
      try {
        let conversations = await chatAPI.getConversations();
        
        if (initialData?.newConversation) {
          const { id, name, avatar, role, initialMessage } = initialData.newConversation;
          const exists = conversations.find(c => c.id === id || c.name === name);
          
          if (!exists) {
            const newConv = await chatAPI.findOrCreateConversation({ id, name, avatar, role });
            conversations = [newConv, ...conversations];
            
            if (initialMessage) {
               setTimeout(async () => {
                 await chatAPI.sendMessage({
                   conversationId: newConv.id,
                   content: initialMessage,
                   type: 'text',
                   senderId: 1
                 });
                 const res = await chatAPI.getMessages(newConv.id);
                 setMessages(prev => ({
                   ...prev,
                   [newConv.id]: res.content.map(m => ({
                     ...m,
                     time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                     status: m.sent ? 'read' : 'read'
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

        const enhancedChats = conversations.map(c => ({
          ...c,
          hasRequest: c.id === 2,
          requestStatus: c.id === 2 ? 'accepted' : null,
          unread: c.id === 1 ? 2 : 0
        }));
        
        setChats(enhancedChats);

        const allMessages = {};
        for (let chat of conversations) {
          const res = await chatAPI.getMessages(chat.id);
          allMessages[chat.id] = res.content.map(m => ({
            ...m,
            time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: m.sent ? 'read' : 'read'
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

  // --- AUTO-SCROLL REMOVED ---
  // The previous useEffect that called scrollIntoView has been deleted.
  // This prevents the "double push" and forced scroll when sending messages.
  // The natural flow of the chat layout will now handle visibility.

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  // Close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.attachWrapper}`)) setAttachmentMenuOpen(false);
      if (!event.target.closest(`.${styles.optionsWrapper}`)) setOptionsMenuOpen(false);
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
            [selectedChatId]: prev[selectedChatId].map((m, idx) => 
              idx === prev[selectedChatId].length - 1 ? { ...m, status: 'read' } : m
            )
          }));
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentMessages, selectedChatId]);

  // --- Handlers ---
  const handleChatSelect = async (id) => {
    setSelectedChatId(id);
    setShowMobileList(false);
    setChats(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleBackToList = () => {
    setShowMobileList(true);
    setSelectedChatId(null);
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !attachment) || !selectedChatId) return;

    const isNewFile = attachment && attachment.type === 'file';
    const isNewImage = attachment && attachment.type === 'image';

    const newMsg = {
      id: Date.now(),
      content: inputText,
      sent: true,
      senderId: 1,
      type: isNewFile || isNewImage ? 'file' : 'text',
      fileName: attachment ? attachment.name : null,
      fileType: attachment ? attachment.fileType : null,
      fileUrl: attachment ? attachment.url : null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
    }));

    setChats(prev => prev.map(chat => 
      chat.id === selectedChatId 
        ? { ...chat, lastMessage: isNewFile ? 'Sent a file' : isNewImage ? 'Sent an image' : inputText, time: 'Now' } 
        : chat
    ));

    setInputText('');
    setAttachment(null);

    try {
      await chatAPI.sendMessage({
        conversationId: selectedChatId,
        content: inputText,
        type: isNewFile || isNewImage ? 'file' : 'text',
        senderId: 1
      });
    } catch (e) { console.error(e); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      setAttachment({
        url: URL.createObjectURL(file),
        type: isImage ? 'image' : 'file',
        name: file.name,
        fileType: file.type
      });
      setAttachmentMenuOpen(false);
    }
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

  const handleImageClick = (url) => setViewImage(url);

  const handleFileClick = (url, name) => {
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
    else if (activeFilter === 'Active') matchesCategory = c.unread > 0 || c.requestStatus === 'accepted';
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

      {/* LEFT SIDEBAR */}
      <div className={`${styles.chatList} ${!showMobileList ? styles.chatListHidden : ''}`}>
        <div className={styles.listHeader}>
          <h3>My Requests</h3>
          <span className={styles.badgeTotal}>{chats.length}</span>
        </div>

        <div className={styles.labelScroller}>
          {['All', 'Active', 'Pending Review', 'Completed'].map((f) => (
            <button key={f} className={`${styles.labelPill} ${activeFilter === f ? styles.active : ''}`} onClick={() => setActiveFilter(f)}>
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
              <img src={chat.avatar} alt={chat.name} className={styles.chatAvatar} />
              <div className={styles.chatDetails}>
                <div className={styles.chatTop}>
                  <span className={styles.chatName}>{chat.name}</span>
                  <span className={styles.chatTime}>{chat.time}</span>
                </div>
                <div className={styles.chatBottom}>
                  <span className={styles.chatPreview}>{chat.lastMessage}</span>
                  {chat.unread > 0 && <span className={styles.unreadDot}>{chat.unread}</span>}
                </div>
                {chat.hasRequest && (
                  <span className={`${styles.tagMini} ${styles['tag' + chat.requestStatus]}`}>
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
        {selectedChatId ? (
          <>
            {/* Header */}
            <div className={styles.mainHeader}>
              <div className={styles.headerUser}>
                <button className={styles.mobileBackBtn} onClick={handleBackToList}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
                <img src={activeChat.avatar} alt="" className={styles.headerAvatar} />
                <div className={styles.headerInfo}>
                  <span className={styles.headerName}>{activeChat.name}</span>
                  <span className={styles.headerStatus}>{activeChat.role}</span>
                </div>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.newRequestBtn} onClick={() => setShowRequestModal(true)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>New Request</span>
                </button>
                <div className={styles.optionsWrapper}>
                  <button className={styles.iconBtn} onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                  {optionsMenuOpen && (
                    <div className={styles.dropdownMenu}>
                      <button onClick={handleViewProfile}>View Maker Profile</button>
                      <button>Report Issue</button>
                      <div className={styles.divider}></div>
                      <button className={styles.dangerText}>Delete Chat</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Banner */}
            {activeChat.hasRequest && (
              <div className={`${styles.agreementBanner} ${styles[activeChat.requestStatus]}`}>
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
              <div className={styles.messagesArea}>
                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`${styles.message} ${msg.sent ? styles.sent : styles.received}`}>
                    <div className={styles.bubble}>
                      {msg.type === 'file' ? (
                        msg.fileType?.startsWith('image/') ? (
                          <div className={styles.imageBubble} onClick={() => handleImageClick(msg.fileUrl)}>
                            <img src={msg.fileUrl} alt="Sent" />
                          </div>
                        ) : (
                          <div className={styles.filePreview} onClick={() => handleFileClick(msg.fileUrl, msg.fileName)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                            <div className={styles.filePreviewContent}>
                              <span className={styles.filePreviewName}>{msg.fileName}</span>
                              <span className={styles.filePreviewType}>
                                {msg.fileType ? msg.fileType.split('/')[1] : 'FILE'}
                              </span>
                            </div>
                          </div>
                        )
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
                ))}
                {/* Ref kept here but no longer used for auto-scrolling */}
                <div ref={messagesEndRef} />
              </div>

              {attachment && (
                <div className={styles.attachmentPreview}>
                  {attachment.type === 'image' ? (
                    <div className={styles.previewImageWrapper}><img src={attachment.url} alt="Preview" /></div>
                  ) : (
                    <div className={styles.filePreviewCard}>
                      <div className={styles.fileIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
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
                  <button className={styles.removeAttachBtn} onClick={() => setAttachment(null)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              )}

              <div className={styles.inputZone}>
                <div className={styles.attachWrapper}>
                  <button className={styles.btnAttach} onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                  </button>
                  {attachmentMenuOpen && (
                    <div className={styles.attachMenu}>
                      <button onClick={() => fileInputRef.current.click()}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Upload File</span></button>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept=".pdf,.ai,.psd,.jpg,.png,image/*" />
                
                <textarea ref={textareaRef} className={styles.msgInput} placeholder="Message..." rows={1} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
                
                <button className={styles.btnSend} onClick={handleSendMessage}>
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
            <h3>Submit Request</h3>
            <input type="text" placeholder="Title" value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} autoFocus style={{ borderColor: modalError && !reqTitle ? 'var(--brut-danger)' : '' }} />
            <textarea placeholder="Description" value={reqDesc} onChange={(e) => setReqDesc(e.target.value)} style={{ width: '100%', padding: '12px', background: 'var(--brut-bg)', border: `1px solid ${modalError && !reqDesc ? 'var(--brut-danger)' : 'var(--brut-border)'}`, borderRadius: '8px', color: 'var(--brut-text)', marginBottom: '16px', minHeight: '100px' }} />
            {modalError && <div style={{ color: 'var(--brut-danger)', fontSize: '0.85rem', marginBottom: '12px' }}>⚠️ {modalError}</div>}
            <div className={styles.modalActions}>
              <button onClick={() => { setShowRequestModal(false); setModalError(''); }}>Cancel</button>
              <button className={styles.primaryBtn} onClick={handleSubmitRequest}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;