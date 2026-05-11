import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchInputRef = useRef(null);

  // Keyboard Shortcut (⌘ + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const studioUpdates = [
    "Julian V. just started a 50pc production for 'Aura Studio'",
    "New 450GSM Heavyweight Fleece templates added to catalog",
    "Infrastructure update: Global shipping now active for 52 countries"
  ];

  const ateliers = [
    { id: 1, name: "Admin", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
    { id: 2, name: "Julian", img: " https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
    { id: 3, name: "Elena", img: " https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" }
  ];

  const BrutigeLogo = () => (
    <svg className={styles.logoSvg} viewBox="0 0 100 100" fill="none">
      {/* Added className to circle for specific dark mode styling */}
      <circle className={styles.logoCircle} cx="50" cy="50" r="50"/>
      <path d="M48 25L48 65L25 80L48 25Z" fill="var(--brut-bg)"/>
      <path d="M52 25L52 65L75 80L52 25Z" fill="var(--brut-bg)"/>
    </svg>
  );

  const handleProfileClick = () => {
    navigate('/platform/settings');
  };

  return (
    <div className={styles.headerWrapper}>
      {/* 1. STUDIO TICKER */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {studioUpdates.concat(studioUpdates).map((update, i) => (
            <span key={i} className={styles.tickerItem}>
              <span className={styles.tickerDot}>•</span> {update}
            </span>
          ))}
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.container}>
          
          {/* MOBILE ONLY: BRANDING */}
          <div className={styles.mobileBrand} onClick={() => setActiveTab('shop')}>
            <BrutigeLogo />
            {/* <span className={styles.brandName}>brutige</span> */}
          </div>

          {/* LAPTOP ONLY: SEARCH */}
          <div className={`${styles.searchContainer} ${searchFocused ? styles.expanded : ''}`}>
            <div className={styles.searchBar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search aesthetics, infrastructure..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              />
              {!searchFocused && (
                <div className={styles.kbdShortcut}>
                  <kbd>⌘</kbd><kbd>K</kbd>
                </div>
              )}
            </div>

            {searchFocused && (
              <div className={styles.searchDropdown}>
                <div className={styles.dropdownSection}>
                  <div className={styles.searchMeta}>124 results found in 0.04s</div>
                  
                  <h4>Atelier Profiles</h4>
                  <div className={styles.atelierRow}>
                    {ateliers.map(a => (
                      <div key={a.id} className={styles.atelierStory} onClick={() => setActiveTab('profile')}>
                        <div className={styles.ring}><img src={a.img} alt="" /></div>
                        <span>{a.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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