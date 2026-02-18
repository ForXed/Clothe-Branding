import React, { useState } from 'react';
import styles from './HomeHeader.module.css';

const HomeHeader = ({ setActiveTab, cartCount = 0 }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // The Cart Icon provided in your prompt
  const CartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );

  // Brutige Logo SVG embedded directly
  const BrutigeLogo = () => (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="50" fill="white"/>
      <path d="M48 25L48 65L25 80L48 25Z" fill="black"/>
      <path d="M52 25L52 65L75 80L52 25Z" fill="black"/>
    </svg>
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* MOBILE ONLY: Logo + Name (Left Side) */}
        <div className={styles.mobileBrand} onClick={() => setActiveTab('feed')}>
          <BrutigeLogo />
          <span className={styles.brandName}>brutige</span>
        </div>

        {/* LAPTOP ONLY: Expanding Search Bar (Center/Left) */}
        <div className={`${styles.searchContainer} ${searchFocused ? styles.expanded : ''}`}>
          <div className={styles.searchBar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search aesthetics, infrastructure..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
          </div>

          {/* Desktop Search Dropdown */}
          {searchFocused && (
            <div className={styles.searchDropdown}>
              <div className={styles.dropdownSection}>
                <h4>Recent Inquiries</h4>
                <button className={styles.recentItem}>Oversized Techwear</button>
                <button className={styles.recentItem}>450GSM Blueprints</button>
                <h4 className={styles.marginTop}>Top Collections</h4>
                <div className={styles.tagCloud}>
                    <button className={styles.trendTag}>Streetwear</button>
                    <button className={styles.trendTag}>Couture</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* UNIVERSAL: Cart Icon (Right Side) */}
        <div className={styles.headerActions}>
          <button className={styles.cartBtn} onClick={() => setActiveTab('cart')}>
            <CartIcon />
            <span className={styles.cartBadge}>{cartCount}</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default HomeHeader;