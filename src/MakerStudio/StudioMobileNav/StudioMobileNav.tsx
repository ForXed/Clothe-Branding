// src/MakerStudio/StudioMobileNav/StudioMobileNav.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StudioMobileNav.module.css';

interface NavItem { id: string; label: string; icon: React.ReactNode; }
interface StudioMobileNavProps {
  activeTab: string; setActiveTab: (tab: string) => void; goToPlatform: () => void;
  isDarkMode: boolean; toggleTheme: () => void; isPro: boolean; onUpgradeClick: () => void;
}

const StudioMobileNav: React.FC<StudioMobileNavProps> = ({ activeTab, setActiveTab, goToPlatform, isDarkMode, toggleTheme, isPro, onUpgradeClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // ✅ UPDATED: New B2B MVP Navigation Items
  const primaryNav: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id: 'briefs', label: 'Briefs', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { id: 'orders', label: 'Orders', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> },
    { id: 'messages', label: 'Messages', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
  ];

  useEffect(() => { document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset'; return () => { document.body.style.overflow = 'unset'; }; }, [isMenuOpen]);

  const handleTabClick = (id: string) => { setActiveTab(id); navigate(`/studio/${id}`); setIsMenuOpen(false); };

  return (
    <>
      <div className={`${styles.bottomSheet} ${isMenuOpen ? styles.showSheet : ''}`}>
        <div className={styles.sheetHeader}><div className={styles.dragBar} onClick={() => setIsMenuOpen(false)} /></div>
        <div className={styles.sheetContent}>
          <button type="button" onClick={() => handleTabClick('quotes')} className={styles.sheetBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/>
            </svg> 
            My Quotes
          </button>
          <button type="button" onClick={() => handleTabClick('settings')} className={styles.sheetBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg> 
            Settings
          </button>
          {!isPro && (<>
            <div className={styles.sheetDivider} />
            <button type="button" onClick={onUpgradeClick} className={`${styles.sheetBtn} ${styles.proSheetBtn}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>Upgrade to Pro</span>
            </button>
          </>)}
          <div className={styles.sheetDivider} />
          <button type="button" onClick={toggleTheme} className={styles.sheetBtn}>{isDarkMode ? '☼ Switch to Light' : '☾ Switch to Dark'}</button>
          <button type="button" onClick={goToPlatform} className={`${styles.sheetBtn} ${styles.exitBtn}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg> 
            Exit Studio
          </button>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.pill}>
          {primaryNav.map(item => (
            <button key={item.id} type="button" className={`${styles.navBtn} ${activeTab === item.id ? styles.active : ''}`} onClick={() => handleTabClick(item.id)} aria-label={item.label}>
              {item.icon}
            </button>
          ))}
          <button type="button" className={`${styles.moreBtn} ${isMenuOpen ? styles.moreActive : ''}`} onClick={() => setIsMenuOpen(true)} aria-label="More Options">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />}
    </>
  );
};

export default StudioMobileNav;