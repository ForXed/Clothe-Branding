import React from 'react';
import styles from './TimelineDisplay.module.css';

interface TimelineDisplayProps {
  startDate: string;
  productionDays: number;
  estimatedDelivery: string;
}

const TimelineDisplay: React.FC<TimelineDisplayProps> = ({ 
  startDate, 
  productionDays, 
  estimatedDelivery 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const timelineSteps = [
    {
      icon: '💰',
      title: 'Payment Confirmed',
      description: 'Funds secured in escrow',
      date: formatDate(startDate),
      status: 'current'
    },
    {
      icon: '🏭',
      title: 'Production',
      description: `${productionDays} days manufacturing`,
      date: `Starts ${formatDate(startDate)}`,
      status: 'upcoming'
    },
    {
      icon: '✅',
      title: 'Quality Check',
      description: 'Final inspection & packaging',
      date: 'Before shipping',
      status: 'upcoming'
    },
    {
      icon: '📦',
      title: 'Delivery',
      description: 'Shipped to your address',
      date: formatDate(estimatedDelivery),
      status: 'upcoming'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <div>
          <h2>Production Timeline</h2>
          <p>Estimated completion: <strong>{formatDate(estimatedDelivery)}</strong></p>
        </div>
      </div>

      <div className={styles.timeline}>
        {timelineSteps.map((step, index) => (
          <div 
            key={index} 
            className={`${styles.timelineItem} ${step.status === 'current' ? styles.current : ''}`}
          >
            <div className={styles.timelineIcon}>
              <span>{step.icon}</span>
            </div>
            
            {index < timelineSteps.length - 1 && (
              <div className={styles.timelineLine}></div>
            )}
            
            <div className={styles.timelineContent}>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
              <span className={styles.timelineDate}>{step.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.notice}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <p>
          Production times are estimates. The maker will notify you of any delays 
          or changes to the timeline.
        </p>
      </div>
    </div>
  );
};

export default TimelineDisplay;