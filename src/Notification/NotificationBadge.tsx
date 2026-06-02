import React from 'react';
import styles from './NotificationBadge.module.css';

const NotificationBadge = ({ 
  count = 0, 
  maxCount = 99,
  showZero = false,
  pulse = false,
  onClick,
  className = ''
}) => {
  if (count === 0 && !showZero) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <span 
      className={`${styles.badge} ${pulse ? styles.pulse : ''} ${className}`}
      onClick={onClick}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;