import React, { useState, useRef, useEffect } from 'react';
import styles from './Messages.module.css';

interface Chat {
  id: number;
  name: string;
  label: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface MessagesProps {
  onMobileNavChange?: (hide: boolean) => void;
}

const Messages: React.FC<MessagesProps> = ({ onMobileNavChange }) => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showTagDropdown, setShowTagDropdown] = useState<boolean>(false);
  const [activeLabel, setActiveLabel] = useState<string>('All');
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
  const [newLabelName, setNewLabelName] = useState<string>('');
  const [showMobileList, setShowMobileList] = useState<boolean>(true);
  const [labels, setLabels] = useState<string[]>(['All', 'Priority', 'In-Production', 'New Inquiry']);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentBtnRef = useRef<HTMLDivElement>(null);
  const tagBtnRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: 'John Doe', label: 'Priority', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', lastMessage: 'When will my order arrive?', time: '2m ago', unread: 2 },
    { id: 2, name: 'Jane Smith', label: 'In-Production', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', lastMessage: 'Thanks for the quick response!', time: '1h ago', unread: 0 },
    { id: 3, name: 'Mike Johnson', label: 'New Inquiry', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', lastMessage: 'Do you have this in XL?', time: '3h ago', unread: 1 },
  ]);

  useEffect(() => {
    if (onMobileNavChange) onMobileNavChange(!showMobileList);
  }, [showMobileList, onMobileNavChange]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(URL.createObjectURL(e.target.files[0]));
      setAttachmentMenuOpen(false);
    }
  };

  const handleAcceptOrder = () => {
    setIsAccepted(true);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
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
  };

  const handleBackToList = () => {
    setShowMobileList(true);
    setSelectedChat(null);
  };

  const filteredChats = activeLabel === 'All' ? chats : chats.filter(c => c.label === activeLabel);
  const activeChatData = chats.find(c => c.id === selectedChat);

  return (
    <div className={styles.container}>
      {showNotification && (<div className={styles.notificationToast}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg><span>Custom Loop Initialized.</span></div>)}

      <div className={`${styles.chatList} ${!showMobileList ? styles.chatListHidden : ''}`}>
        <div className={styles.listHeader}><h3>Messages</h3><span className={styles.badgeTotal}>{chats.length}</span></div>
        <div className={styles.labelScroller}>
          {labels.map((l) => (<button key={l} type="button" className={`${styles.labelPill} ${activeLabel === l ? styles.active : ''}`} onClick={() => setActiveLabel(l)}>{l}</button>))}
          <button type="button" className={styles.addLabelBtn} onClick={() => setShowLabelModal(true)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        </div>
        <div className={styles.searchWrapper}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg><input type="text" placeholder="Search customers..." /></div>
        <div className={styles.chatListScroll}>
          {filteredChats.map((chat) => (
            <div key={chat.id} className={`${styles.chatRow} ${selectedChat === chat.id ? styles.selected : ''}`} onClick={() => handleChatSelect(chat.id)}>
              <img src={chat.avatar} alt={chat.name} className={styles.chatAvatar} />
              <div className={styles.chatDetails}>
                <div className={styles.chatTop}><span className={styles.chatName}>{chat.name}</span><span className={styles.chatTime}>{chat.time}</span></div>
                <div className={styles.chatBottom}><span className={styles.chatPreview}>{chat.lastMessage}</span>{chat.unread > 0 && <span className={styles.unreadDot}>{chat.unread}</span>}</div>
                <span className={`${styles.tagMini} ${styles['tag' + chat.label.replace(/-/g, '')]}`}>{chat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.msgMain} ${!showMobileList ? styles.msgMainVisible : ''}`}>
        {selectedChat && activeChatData ? (
          <>
            <div className={styles.mainHeader}>
              <div className={styles.headerUser}>
                <button type="button" className={styles.mobileBackBtn} onClick={handleBackToList}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
                <img src={activeChatData.avatar} alt="" className={styles.headerAvatar} />
                <div className={styles.headerInfo}><span className={styles.headerName}>{activeChatData.name}</span><span className={styles.headerStatus}>Online</span></div>
              </div>
              <div className={styles.headerActions}>
                <div className={styles.tagSelectorWrapper} ref={tagBtnRef}>
                  <button type="button" className={styles.tagSelectorBtn} onClick={() => setShowTagDropdown(!showTagDropdown)}>
                    <span className={`${styles.tagMini} ${styles['tag' + activeChatData.label.replace(/-/g, '')]}`}>{activeChatData.label}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {showTagDropdown && (
                    <div className={styles.tagDropdownMenu}>
                      {labels.filter(l => l !== 'All').map(label => (
                        <button key={label} type="button" onClick={() => handleUpdateChatTag(label)}>
                          <span className={`${styles.tagMini} ${styles['tag' + label.replace(/-/g, '')]}`}>{label}</span>
                          {activeChatData.label === label && (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.optionsWrapper}>
                  <button type="button" className={styles.iconBtn} onClick={() => setShowOptions(!showOptions)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg></button>
                  {showOptions && (
                    <div className={styles.dropdownMenu}>
                      <button type="button">Pin Chat</button>
                      <button type="button">Mute Notifications</button>
                      <div className={styles.divider}></div>
                      <button type="button" className={styles.dangerText}>Report User</button>
                      <button type="button" className={styles.dangerText}>Delete Conversation</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`${styles.agreementBanner} ${isAccepted ? styles.accepted : ''}`}>
              {!isAccepted ? (
                <div className={styles.bannerContent}>
                  <div className={styles.bannerText}><strong>Custom Order Discussion</strong><p>Agreed on price and specs? Initialize branding loop.</p></div>
                  <div className={styles.bannerActions}>
                    <button type="button" className={styles.btnDecline}>Decline</button>
                    <button type="button" className={styles.btnAccept} onClick={handleAcceptOrder}>Accept Order</button>
                  </div>
                </div>
              ) : (
                <div className={styles.bannerSuccess}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg><span>Custom Loop Initialized.</span></div>
              )}
            </div>

            <div className={styles.messagesArea}>
              <div className={`${styles.message} ${styles.received}`}><div className={styles.bubble}><p>Hi! Can we brand the 450GSM hoodie?</p></div><span className={styles.msgTime}>10:30 AM</span></div>
              <div className={`${styles.message} ${styles.sent}`}><div className={styles.bubble}><p>Absolutely. Send the logo file.</p></div><span className={styles.msgTime}>10:32 AM</span></div>
            </div>

            {attachment && (
              <div className={styles.attachmentPreview}>
                <div className={styles.previewImageWrapper}><img src={attachment} alt="Preview" /></div>
                <button type="button" className={styles.removeAttachBtn} onClick={() => setAttachment(null)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
            )}

            <div className={styles.inputZone}>
              <div className={styles.attachWrapper} ref={attachmentBtnRef}>
                <button type="button" className={styles.btnAttach} onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg></button>
                {attachmentMenuOpen && (
                  <div className={styles.attachMenu}>
                    <button type="button" onClick={() => fileInputRef.current?.click()}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Image</span></button>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
              <textarea ref={textareaRef} className={styles.msgInput} placeholder="Type an infrastructure inquiry..." rows={1} />
              <button type="button" className={styles.btnSend}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9" /></svg></button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z" /></svg></div>
            <p>Select a conversation to begin the loop</p>
          </div>
        )}
      </div>

      {showLabelModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLabelModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Create New Label</h3>
            <input type="text" value={newLabelName} onChange={(e) => setNewLabelName(e.target.value)} placeholder="Label name (e.g., VIP)" autoFocus />
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