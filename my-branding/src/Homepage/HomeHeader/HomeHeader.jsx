import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate
import styles from './HomeHeader.module.css';

const HomeHeader = ({ 
  setActiveTab, 
  activeTab,
  cartCount = 0, 
  orderCount = 0, 
  notificationCount = 0,
  userAvatar = null,
  userName = 'User'
}) => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Keyboard Shortcut (⌘ + K) - Now navigates to search page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        navigate('/platform/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const BrutigeLogo = () => (
    <svg className={styles.logoSvg} viewBox="0 0 100 100" fill="none">
      <circle className={styles.logoCircle} cx="50" cy="50" r="50"/>
      <path d="M48 25L48 65L25 80L48 25Z" fill="var(--brut-bg)"/>
      <path d="M52 25L52 65L75 80L52 25Z" fill="var(--brut-bg)"/>
    </svg>
  );

  const handleProfileClick = () => {
    navigate('/platform/settings');
  };

  // New handler to redirect to SearchView
  const handleSearchClick = () => {
    navigate('/platform/search');
  };

  return (
    <div className={styles.headerWrapper}>
      {/* 1. STUDIO TICKER */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {/* Ticker content remains the same */}
          <span className={styles.tickerItem}><span className={styles.tickerDot}>•</span> New 450GSM Heavyweight Fleece templates added</span>
          <span className={styles.tickerItem}><span className={styles.tickerDot}>•</span> Global shipping now active for 52 countries</span>
          <span className={styles.tickerItem}><span className={styles.tickerDot}>•</span> Julian V. just started a 50pc production</span>
          {/* Duplicate for infinite scroll effect */}
          <span className={styles.tickerItem}><span className={styles.tickerDot}>•</span> New 450GSM Heavyweight Fleece templates added</span>
          <span className={styles.tickerItem}><span className={styles.tickerDot}>•</span> Global shipping now active for 52 countries</span>
          <span className={styles.tickerItem}><span className={styles.tickerDot}>•</span> Julian V. just started a 50pc production</span>
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.container}>
          
          {/* MOBILE ONLY: BRANDING */}
          <div className={styles.mobileBrand} onClick={() => setActiveTab('shop')}>
            <BrutigeLogo />
          </div>

          {/* LAPTOP ONLY: SEARCH - Now acts as a button/link to SearchView */}
          <div 
            className={styles.searchContainer} 
            onClick={handleSearchClick}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.searchBar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search aesthetics, infrastructure..." 
                readOnly // Prevents typing here since it redirects
                onFocus={handleSearchClick} // Also triggers on focus
              />
              <div className={styles.kbdShortcut}>
                <kbd>⌘</kbd><kbd>K</kbd>
              </div>
            </div>
          </div>

          {/* ACTIONS WITH LABELS */}
          <div className={styles.headerActions}>
            
            {/* Profile */}
            <button 
              className={`${styles.actionItem} ${activeTab === 'profile' ? styles.activeAction : ''}`} 
              onClick={handleProfileClick}
              aria-label="Profile"
            >
              <div className={styles.iconWrapper}>
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" className={styles.avatarThumb} />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
                {notificationCount > 0 && <span className={styles.badge}>{notificationCount}</span>}
              </div>
              <span className={styles.actionLabel}>Profile</span>
            </button>

            {/* Notifications */}
            <button 
              className={`${styles.actionItem} ${activeTab === 'notifications' ? styles.activeAction : ''}`} 
              onClick={() => setActiveTab('notifications')}
              aria-label="Notifications"
            >
              <div className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {notificationCount > 0 && <span className={styles.badge}>{notificationCount}</span>}
              </div>
              <span className={styles.actionLabel}>Notifications</span>
            </button>

            {/* Orders */}
            <button 
              className={`${styles.actionItem} ${activeTab === 'orders' ? styles.activeAction : ''}`} 
              onClick={() => setActiveTab('orders')}
              aria-label="Orders"
            >
              <div className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                {orderCount > 0 && <span className={styles.badge}>{orderCount}</span>}
              </div>
              <span className={styles.actionLabel}>Orders</span>
            </button>

            {/* Cart */}
            <button 
              className={`${styles.actionItem} ${activeTab === 'cart' ? styles.activeAction : ''}`} 
              onClick={() => setActiveTab('cart')}
              aria-label="Cart"
            >
              <div className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
              </div>
              <span className={styles.actionLabel}>Cart</span>
            </button>

          </div>

        </div>
      </header>
    </div>
  );
};

export default HomeHeader;