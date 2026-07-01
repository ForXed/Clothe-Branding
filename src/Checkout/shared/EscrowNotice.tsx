import React from 'react';
import styles from './EscrowNotice.module.css';

interface EscrowNoticeProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const EscrowNotice: React.FC<EscrowNoticeProps> = ({ checked, onChange }) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <input 
          type="checkbox" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={styles.checkmark}></div>
        <div className={styles.content}>
          <div className={styles.icon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className={styles.text}>
            <strong>Secure Escrow Payment</strong>
            <p>Your payment is held safely until you confirm delivery. This protects both you and the maker.</p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default EscrowNotice;