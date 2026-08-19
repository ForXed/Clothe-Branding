// src/MakerStudio/StudioSideBar/StudioSideBar.tsx

import React from 'react';
import styles from './StudioSideBar.module.css';

interface NavItem { id: string; label: string; icon: React.ReactNode; }

interface StudioSideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  goToPlatform: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isPro: boolean;
  onUpgradeClick: () => void;
}

const StudioSideBar: React.FC<StudioSideBarProps> = ({ 
  isCollapsed, 
  onToggle, 
  activeTab, 
  setActiveTab, 
  goToPlatform, 
  isDarkMode, 
  toggleTheme, 
  isPro, 
  onUpgradeClick 
}) => {
  // ✅ UPDATED: New B2B MVP Navigation Items
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id: 'briefs', label: 'Incoming Briefs', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { id: 'quotes', label: 'My Quotes', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg> },
    { id: 'orders', label: 'Active Orders', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> },
    { id: 'messages', label: 'Messages', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
  ];

  const BrutigeLogo = () => (
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="50" fill="var(--brut-text)"/>
      <path d="M48 25L48 65L25 80L48 25Z" fill="var(--brut-bg)" fillOpacity="0.8"/>
      <path d="M52 25L52 65L75 80L52 25Z" fill="var(--brut-bg)"/>
    </svg>
  );

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
      <div className={styles.header}>
        <div className={`${styles.logoBox} ${isCollapsed ? styles.logoHidden : ''}`} onClick={goToPlatform}>
          <BrutigeLogo />
          <span className={styles.studioLabel}>STUDIO</span>
        </div>
        <button 
          type="button" 
          className={styles.collapseToggle} 
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg 
            className={isCollapsed ? styles.rotateIcon : ''} 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      </div>

      <nav className={styles.navStack}>
        {navItems.map(item => (
          <button 
            key={item.id} 
            type="button" 
            className={`${styles.navBtn} ${activeTab === item.id ? styles.active : ''}`} 
            onClick={() => setActiveTab(item.id)} 
            aria-label={item.label}
          >
            <span className={styles.iconWrapper}>{item.icon}</span>
            <span className={`${styles.navLabel} ${isCollapsed ? styles.labelHidden : ''}`}>{item.label}</span>
            {isCollapsed && <div className={styles.tooltip}>{item.label}</div>}
          </button>
        ))}
      </nav>

      <div className={styles.bottomStack}>
        {!isPro && (
          <button 
            type="button" 
            className={`${styles.proBtn} ${isCollapsed ? styles.proBtnCollapsed : ''}`} 
            onClick={onUpgradeClick}
            aria-label="Upgrade to Pro"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span className={`${styles.proBtnLabel} ${isCollapsed ? styles.labelHidden : ''}`}>Upgrade Pro</span>
            {isCollapsed && <div className={styles.tooltip}>Upgrade to Pro</div>}
          </button>
        )}
        
        <button 
          type="button" 
          className={styles.navBtn} 
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className={styles.iconWrapper}>
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </span>
          <span className={`${styles.navLabel} ${isCollapsed ? styles.labelHidden : ''}`}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
          {isCollapsed && <div className={styles.tooltip}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</div>}
        </button>
        
        <button 
          type="button" 
          className={`${styles.navBtn} ${activeTab === 'settings' ? styles.active : ''}`} 
          onClick={() => setActiveTab('settings')}
          aria-label="Settings"
        >
          <span className={styles.iconWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </span>
          <span className={`${styles.navLabel} ${isCollapsed ? styles.labelHidden : ''}`}>Settings</span>
          {isCollapsed && <div className={styles.tooltip}>Settings</div>}
        </button>
      </div>
    </aside>
  );
};

export default StudioSideBar;