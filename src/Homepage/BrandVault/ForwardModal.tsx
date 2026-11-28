import React, { useState } from 'react';
import styles from './ForwardModal.module.css';

interface Design {
  id: number;
  name: string;
  thumbnail?: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
}

interface ForwardModalProps {
  design: Design;
  onClose: () => void;
  onForward: (chatId: number, chatName: string) => void;
}

const ForwardModal: React.FC<ForwardModalProps> = ({ design, onClose, onForward }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mock chats - TODO: Replace with real data from backend
  const chats: Chat[] = [
    { id: 1, name: 'Julian V. Studio', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', lastMessage: 'Thanks for the quick response!', time: '1h ago' },
    { id: 2, name: 'Tokyo Atelier', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', lastMessage: 'We can start production next week', time: '3h ago' },
    { id: 3, name: 'London Cut', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', lastMessage: 'Do you have this in XL?', time: '1d ago' },
  ];

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Forward Design</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.designPreview}>
          {design.thumbnail && (
            <img src={design.thumbnail} alt={design.name} />
          )}
          <div className={styles.designInfo}>
            <strong>{design.name}</strong>
            <span>Sharing design with maker</span>
          </div>
        </div>

        <div className={styles.searchWrapper}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search makers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.chatsList}>
          {filteredChats.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No chats found</p>
            </div>
          ) : (
            filteredChats.map(chat => (
              <div 
                key={chat.id} 
                className={styles.chatItem}
                onClick={() => onForward(chat.id, chat.name)}
              >
                <img src={chat.avatar} alt={chat.name} className={styles.chatAvatar} />
                <div className={styles.chatInfo}>
                  <div className={styles.chatTop}>
                    <span className={styles.chatName}>{chat.name}</span>
                    <span className={styles.chatTime}>{chat.time}</span>
                  </div>
                  <span className={styles.chatPreview}>{chat.lastMessage}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;