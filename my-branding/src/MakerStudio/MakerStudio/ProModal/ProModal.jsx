import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProModal.module.css';

const ProModal = ({ onClose, onUpgrade, currentPlan = 'starter' }) => {
  const navigate = useNavigate();

  if (currentPlan === 'enterprise') {
    onClose();
    return null;
  }

  const handleUpgrade = () => {
    onUpgrade('pro'); 
  };

  const goToPricing = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Upgrade to Pro</h2>
            <p>You've reached the limit of the <strong>Free Plan</strong>. Upgrade to unlock unlimited products.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Pro Plan Card */}
        <div className={styles.planFocus}>
          <div className={styles.popularBadge}>Recommended</div>

          <div className={styles.planTop}>
            <div className={styles.planInfo}>
              <h3>Pro Studio</h3>
              <p className={styles.planDesc}>Everything to scale your brand.</p>
            </div>
            <div className={styles.priceBlock}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>29</span>
              <span className={styles.period}>/mo</span>
            </div>
          </div>

          {/* 2-Column Grid to save vertical space */}
          <ul className={styles.featuresGrid}>
            <li className={styles.featureItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.checkIcon}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Unlimited Products</span>
            </li>
            <li className={styles.featureItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.checkIcon}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Advanced Analytics</span>
            </li>
            <li className={styles.featureItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.checkIcon}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>0% Transaction Fees</span>
            </li>
            <li className={styles.featureItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.checkIcon}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Priority 24/7 Support</span>
            </li>
          </ul>

          <div className={styles.actions}>
            <button className={`${styles.ctaBtn} ${styles.primaryBtn}`} onClick={handleUpgrade}>
              Upgrade Now — $29/mo
            </button>
            <button className={`${styles.ctaBtn} ${styles.secondaryBtn}`} onClick={goToPricing}>
              View All Plans
            </button>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className={styles.footer}>
          <span className={styles.trustItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secure Checkout
          </span>
          <span className={styles.trustDivider}>•</span>
          <span className={styles.trustItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Cancel Anytime
          </span>
        </div>

      </div>
    </div>
  );
};

export default ProModal;