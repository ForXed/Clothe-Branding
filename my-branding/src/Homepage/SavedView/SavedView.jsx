import React from 'react';
import styles from './SavedView.module.css';

const SavedView = ({ savedItems, onSelect, toggleSaved }) => {
  if (savedItems.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <h2>No Saved Items</h2>
        <p>Start saving items you love to view them here</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Saved Items</h1>
        <span className={styles.count}>{savedItems.length} items</span>
      </div>

      <div className={styles.grid}>
        {savedItems.map(item => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageContainer} onClick={() => onSelect(item)}>
              <img src={item.img} alt={item.title} />
              <button 
                className={styles.unsaveBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaved(item);
                }}
                aria-label="Remove from saved"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            </div>
            <div className={styles.cardInfo}>
              <h3>{item.title}</h3>
              <p className={styles.price}>{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedView;