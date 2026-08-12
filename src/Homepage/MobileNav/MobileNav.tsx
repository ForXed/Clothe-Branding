// src/MobileNav/MobileNav.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MobileNav.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode; 
}

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  goToStudio?: () => void;
  cartCount?: number;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, goToStudio, cartCount, isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // ✅ UPDATED: New B2B MVP Navigation Items
  const primaryNav: NavItem[] = [
    { 
      id: 'discovery', 
      label: 'Discover',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> 
    },
    { 
      id: 'briefs', 
      label: 'Briefs',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> 
    },
    { 
      id: 'orders', 
      label: 'Orders',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> 
    },
    { 
      id: 'chat', 
      label: 'Messages',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> 
    }
  ];

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

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    navigate(`/platform/${id}`);
    setIsMenuOpen(false);
  };

  const handleGoToStudio = () => {
    if (goToStudio) {
      goToStudio(); 
    } else {
      navigate('/studio'); 
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Bottom Sheet Menu */}
      <div className={`${styles.bottomSheet} ${isMenuOpen ? styles.showSheet : ''}`}>
        <div className={styles.sheetHeader}>
           <div className={styles.dragBar} onClick={() => setIsMenuOpen(false)} />
        </div>
        <div className={styles.sheetContent}>
          <button type="button" onClick={() => handleTabClick('settings')} className={styles.sheetBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
            </svg> 
            Settings
          </button>
          
          <button type="button" onClick={() => handleTabClick('search')} className={styles.sheetBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg> 
            Search
          </button>
          
          <button 
            type="button"
            onClick={() => { toggleTheme(); setIsMenuOpen(false); }} 
            className={`${styles.sheetBtn} ${styles.themeBtn}`}
          >
            {isDarkMode ? '☼ Switch to Light' : '☾ Switch to Dark'}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsMenuOpen(false)} 
          aria-hidden="true"
        />
      )}

      {/* Bottom Navigation Pill */}
      <nav className={styles.wrapper}>
        <div className={styles.pill}>
          {primaryNav.map(item => (
            <button 
              key={item.id} 
              type="button"
              className={`${styles.navBtn} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => handleTabClick(item.id)}
              aria-label={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              {item.icon}
            </button>
          ))}
          
          <button 
            type="button"
            className={styles.navBtn}
            onClick={handleGoToStudio}
            aria-label="Maker Studio"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M9 21V9"/>
            </svg>
          </button>
          
          <button 
            type="button"
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