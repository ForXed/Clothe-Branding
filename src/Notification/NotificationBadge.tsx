import React from 'react';
import styles from './NotificationBadge.module.css';

interface NotificationBadgeProps {
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  pulse?: boolean;
  onClick?: () => void;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
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
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;