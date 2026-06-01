import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MobileNav.module.css';

const MobileNav = ({ activeTab, setActiveTab, isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const primaryNav = [
    { 
      id: 'shop', 
      label: 'Feed',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> 
    },
    { 
      id: 'chat', 
      label: 'Messages',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg> 
    },
    { 
      id: 'search', 
      label: 'Search',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> 
    }
  ];

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleTabClick = (id) => {
    setActiveTab(id);
    navigate(`/platform/${id}`);
    setIsMenuOpen(false);
  };

  // Navigate to Studio (standalone page)
  const goToStudio = () => {
    navigate('/studio');
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* BOTTOM SHEET (MODAL MENU) */}
      <div className={`${styles.bottomSheet} ${isMenuOpen ? styles.showSheet : ''}`}>
        <div className={styles.sheetHeader}>
           <div className={styles.dragBar} onClick={() => setIsMenuOpen(false)} />
        </div>
        <div className={styles.sheetContent}>
          {/* GEAR ICON - Now goes to Settings instead of Profile */}
          <button onClick={() => handleTabClick('settings')} className={styles.sheetBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
            </svg> 
            Settings
          </button>
          
          <button onClick={() => handleTabClick('saved')} className={styles.sheetBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg> 
            Saved Blueprints
          </button>
          
          <button onClick={() => handleTabClick('orders')} className={styles.sheetBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
            </svg> 
            Branding Orders
          </button>
          
          <button onClick={() => handleTabClick('cart')} className={styles.sheetBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg> 
            My Cart
          </button>
          
          <button 
            onClick={() => { toggleTheme(); setIsMenuOpen(false); }} 
            className={`${styles.sheetBtn} ${styles.themeBtn}`}
          >
            {isDarkMode ? '☼ Switch to Light' : '☾ Switch to Dark'}
          </button>
        </div>
      </div>
      
      {/* Overlay Background */}
      {isMenuOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsMenuOpen(false)} 
          aria-hidden="true"
        />
      )}

      {/* FIXED BOTTOM NAV PILL */}
      <nav className={styles.wrapper}>
        <div className={styles.pill}>
          {primaryNav.map(item => (
            <button 
              key={item.id} 
              className={`${styles.navBtn} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => handleTabClick(item.id)}
              aria-label={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              {item.icon}
            </button>
          ))}
          
          {/* Studio Button - Navigates to standalone /studio page */}
          <button 
            className={styles.navBtn}
            onClick={goToStudio}
            aria-label="Maker Studio"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M9 21V9"/>
            </svg>
          </button>
          
          {/* THE "MORE" MENU TRIGGER */}
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className={`${styles.moreBtn} ${isMenuOpen ? styles.moreActive : ''}`}
            aria-label="More options"
            aria-expanded={isMenuOpen}
          >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
             </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;