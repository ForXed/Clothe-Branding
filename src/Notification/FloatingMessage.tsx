import React from 'react';
import styles from './FloatingMessage.module.css';

const FloatingMessage = ({ message, type, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={`${styles.wrapper} ${type === 'success' ? styles.success : styles.error}`}>
      <div className={styles.icon}>
        {type === 'success' ? '✓' : '!'}
      </div>
      <span className={styles.text}>{message}</span>
    </div>
  );
};

export default FloatingMessage;