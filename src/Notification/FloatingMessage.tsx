import React from 'react';
import styles from './FloatingMessage.module.css';

interface FloatingMessageProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
}

const FloatingMessage: React.FC<FloatingMessageProps> = ({ message, type, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={`${styles.wrapper} ${styles[type] || ''}`}>
      <div className={styles.icon}>
        {type === 'success' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        )}
      </div>
      <span className={styles.text}>{message}</span>
    </div>
  );
};

export default FloatingMessage;