import React from 'react';
import styles from './StudioSideBar.module.css';

const StudioSideBar = ({ 
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

  const navItems = [
    { 
      id: 'overview', 
      label: 'Studio Overview',
      // Dashboard/Grid icon for Overview
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    },
    { 
      id: 'add-product', 
      label: 'Initialize Template',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    },
    { 
      id: 'products', 
      label: 'Infrastructure List',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    },
    { 
      id: 'orders', 
      label: 'Order fulfillment',
      // Package icon for Orders
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    },
    { 
      id: 'messages', 
      label: 'Messenger',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>
    },
    { 
      id: 'transactions', 
      label: 'Revenue Analytics',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    }
  ];

  // Internal Brutige Logo
  const BrutigeLogo = () => (
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="var(--brut-text)"/>
      <path d="M48 25L48 65L25 80L48 25Z" fill="var(--brut-bg)" fillOpacity="0.8"/>
      <path d="M52 25L52 65L75 80L52 25Z" fill="var(--brut-bg)"/>
    </svg>
  );

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
      
      {/* 1. TOP LOGO & COLLAPSE TOGGLE */}
      <div className={styles.header}>
        <div className={styles.logoBox} onClick={goToPlatform}>
          <BrutigeLogo />
          {!isCollapsed && <span className={styles.studioLabel}>STUDIO</span>}
        </div>
        <button className={styles.collapseToggle} onClick={onToggle}>
            <svg className={isCollapsed ? styles.rotateIcon : ''} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>

      {/* 2. MAIN NAV LOOP */}
      <nav className={styles.navStack}>
        {navItems.map(item => (
          <button 
            key={item.id}
            className={`${styles.navBtn} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-label={item.label}
          >
            <span className={styles.iconWrapper}>{item.icon}</span>
            {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
            {isCollapsed && <div className={styles.tooltip}>{item.label}</div>}
          </button>
        ))}
      </nav>

      {/* 3. BOTTOM UTILITIES */}
      <div className={styles.bottomStack}>
        {!isPro && (
          <button className={`${styles.proBtn} ${isCollapsed ? styles.proBtnCollapsed : ''}`} onClick={onUpgradeClick}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
             {!isCollapsed && <span>Upgrade Pro</span>}
          </button>
        )}

        <button className={styles.navBtn} onClick={toggleTheme}>
          <span className={styles.iconWrapper}>
            {isDarkMode ? 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> 
              : 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
          </span>
          {!isCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button 
          className={`${styles.navBtn} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className={styles.iconWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </span>
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
};

export default StudioSideBar;