import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StudioMobileNav.module.css';

const StudioMobileNav = ({ 
  activeTab, 
  setActiveTab, 
  goToPlatform, 
  isDarkMode, 
  toggleTheme, 
  isPro, 
  onUpgradeClick 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // PRIMARY NAV (Visible in the Pill)
  const primaryNav = [
    { 
      id: 'overview', 
      label: 'Overview',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    },
    { 
      id: 'add-product', 
      label: 'Create',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    },
    { 
      id: 'products', 
      label: 'Inventory',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    },
    { 
      id: 'orders', 
      label: 'Orders',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    },
    { 
      id: 'messages', 
      label: 'Messages',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>
    }
  ];

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const handleTabClick = (id) => {
    setActiveTab(id);
    navigate(`/studio/${id}`);
    setIsMenuOpen(false);
  };

  // Centralized Handler for Pro Upgrade
  const handleProUpgrade = () => {
    console.log("Pro Upgrade Clicked from Mobile Nav"); // Debug log
    
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      // Fallback if prop is missing (optional debug)
      alert("Upgrade function not connected yet.");
    }
    
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* 1. iOS-STYLE BOTTOM SHEET (MODAL MENU) */}
      <div className={`${styles.bottomSheet} ${isMenuOpen ? styles.showSheet : ''}`}>
        <div className={styles.sheetHeader}>
           <div className={styles.dragBar} onClick={() => setIsMenuOpen(false)} />
        </div>
        
        <div className={styles.sheetContent}>
          {/* Secondary Items */}
          <button onClick={() => handleTabClick('transactions')} className={styles.sheetBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Revenue Analytics
          </button>

          <button onClick={() => handleTabClick('settings')} className={styles.sheetBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Studio Settings
          </button>

          {/* PRO UPGRADE BUTTON - Only shows if NOT Pro */}
          {!isPro && (
            <>
              <div className={styles.sheetDivider} />
              <button onClick={handleProUpgrade} className={`${styles.sheetBtn} ${styles.proSheetBtn}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span>Upgrade to Pro</span>
              </button>
            </>
          )}

          <div className={styles.sheetDivider} />

          <button onClick={toggleTheme} className={styles.sheetBtn}>
            {isDarkMode ? (
              <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> Switch to Light</>
            ) : (
              <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Switch to Dark</>
            )}
          </button>

          <button onClick={goToPlatform} className={`${styles.sheetBtn} ${styles.exitBtn}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Exit Studio
          </button>
        </div>
      </div>

      {/* 2. FLOATING BOTTOM PILL */}
      <div className={styles.wrapper}>
        <div className={styles.pill}>
          {primaryNav.map(item => (
            <button 
              key={item.id}
              className={`${styles.navBtn} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => handleTabClick(item.id)}
              aria-label={item.label}
            >
              {item.icon}
            </button>
          ))}
          
          {/* Three Dot Menu Trigger */}
          <button 
            className={`${styles.moreBtn} ${isMenuOpen ? styles.moreActive : ''}`}
            onClick={() => setIsMenuOpen(true)}
            aria-label="More Options"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Background Dimming when menu open */}
      {isMenuOpen && <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />}
    </>
  );
};

export default StudioMobileNav;