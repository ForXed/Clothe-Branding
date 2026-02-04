import React, { useState, useRef, useEffect } from 'react';
import styles from './HomeHeader.module.css';

const HomeHeader = ({ activeTab, setActiveTab, user }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const profileRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality here
    }
  };

  const recentSearches = ['Oversized Hoodie', 'Minimalist Tee', 'Techwear'];
  const trendingCategories = ['Streetwear', 'Couture', 'Minimalist', 'Anime', 'Goth'];

  return (
    <header className={styles.header}>
      {/* Mobile Branding */}
      <div className={styles.mobileBrand}>
        <svg width="32" height="32" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="black"/>
          <path d="M48 25L48 65L25 80L48 25Z" fill="white"/>
          <path d="M52 25L52 65L75 80L52 25Z" fill="white"/>
        </svg>
        <span>brutige</span>
      </div>

      {/* Search Area - Desktop */}
      <div className={`${styles.searchContainer} ${searchFocused ? styles.focused : ''}`}>
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search for styles, aesthetics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className={styles.clearBtn}
              onClick={() => setSearchQuery('')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </form>

        {/* Search Dropdown */}
        {searchFocused && (
          <div className={styles.searchDropdown}>
            {searchQuery === '' ? (
              <>
                <div className={styles.dropdownSection}>
                  <h4>Recent Searches</h4>
                  <div className={styles.recentList}>
                    {recentSearches.map(item => (
                      <button key={item} className={styles.recentItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.dropdownSection}>
                  <h4>Trending Categories</h4>
                  <div className={styles.tagCloud}>
                    {trendingCategories.map(tag => (
                      <button key={tag} className={styles.trendTag}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.dropdownSection}>
                <h4>Search Results</h4>
                <p className={styles.searchHint}>Press Enter to search for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side Actions */}
      <div className={styles.headerActions}>
        {/* Cart Button */}
        <button 
          className={styles.cartBtn}
          onClick={() => setActiveTab('cart')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </button>

        {/* Profile Dropdown */}
        <div className={styles.profileContainer} ref={profileRef}>
          <button 
            className={styles.profileBtn}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className={styles.profileAvatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatarLarge}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user?.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className={styles.profileInfo}>
                  <h4>{user?.name || 'Guest User'}</h4>
                  <p>{user?.email || 'guest@brutige.com'}</p>
                </div>
              </div>

              <div className={styles.profileDivider} />

              <div className={styles.menuSection}>
                <button onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>My Profile</span>
                </button>
                <button onClick={() => { setActiveTab('orders'); setShowProfileMenu(false); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  </svg>
                  <span>My Orders</span>
                </button>
                <button onClick={() => { setActiveTab('saved'); setShowProfileMenu(false); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>Saved Items</span>
                </button>
              </div>

              <div className={styles.profileDivider} />

              <div className={styles.menuSection}>
                <button onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24"/>
                  </svg>
                  <span>Settings</span>
                </button>
                <button className={styles.logoutBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;