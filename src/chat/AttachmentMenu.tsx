import React, { useRef } from 'react';
import styles from './AttachmentMenu.module.css';

interface AttachmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  onVaultSelect: () => void;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({ 
  isOpen, 
  onClose, 
  onFileSelect,
  onVaultSelect 
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      onClose();
    }
  };

  const handleVaultClick = () => {
    onVaultSelect();
    onClose();
  };

  return (
    <>
      <div className={styles.menuOverlay} onClick={onClose} />
      
      <div className={styles.menu}>
        {/* Photo/Gallery Option */}
        <button type="button" className={styles.menuItem} onClick={handleImageClick}>
          <div className={`${styles.iconWrapper} ${styles.photoIcon}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <div className={styles.menuContent}>
            <span className={styles.menuLabel}>Photo & Gallery</span>
            <span className={styles.menuDesc}>Upload images from your device</span>
          </div>
        </button>

        {/* Document Option */}
        <button type="button" className={styles.menuItem} onClick={handleFileClick}>
          <div className={`${styles.iconWrapper} ${styles.fileIcon}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div className={styles.menuContent}>
            <span className={styles.menuLabel}>Document</span>
            <span className={styles.menuDesc}>PDF, AI, PSD, DOC files</span>
          </div>
        </button>

        {/* Brand Vault Option */}
        <button type="button" className={styles.menuItem} onClick={handleVaultClick}>
          <div className={`${styles.iconWrapper} ${styles.vaultIcon}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div className={styles.menuContent}>
            <span className={styles.menuLabel}>From Brand Vault</span>
            <span className={styles.menuDesc}>Share saved designs & assets</span>
          </div>
        </button>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={imageInputRef}
        hidden
        accept="image/*"
        onChange={handleImageChange}
      />
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept=".pdf,.ai,.psd,.doc,.docx,.zip"
        onChange={handleFileChange}
      />
    </>
  );
};

export default AttachmentMenu;