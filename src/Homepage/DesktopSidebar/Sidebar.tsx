// src/DesktopSidebar/Sidebar.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  goToStudio?: () => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isDarkMode, toggleTheme, goToStudio: propGoToStudio }) => {
  const navigate = useNavigate();

  // ✅ UPDATED: New B2B MVP Navigation Items
  const navItems: NavItem[] = [
    { 
      id: 'discovery', 
      label: 'Discover', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> 
    },
    { 
      id: 'briefs', 
      label: 'Briefs', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> 
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> 
    },
    { 
      id: 'chat', 
      label: 'Messages', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> 
    }
  ];

  const handleGoToStudio = () => {
    if (propGoToStudio) {
      propGoToStudio();
    } else {
      navigate('/studio');
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer} onClick={() => setActiveTab('discovery')}>
        <svg width="45" height="45" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="var(--brut-accent)"/>
          <path d="M48 25L48 65L25 80L48 25Z" fill="var(--brut-white)"/>
          <path d="M52 25L52 65L75 80L52 25Z" fill="var(--brut-white)"/>
        </svg>
      </div>

      <nav className={styles.navStack}>
        {navItems.map(item => (
          <button 
            key={item.id}
            type="button"
            className={`${styles.navBtn} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-label={item.label}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
        
        {/* Maker Studio Button */}
        <button 
          type="button"
          className={styles.navBtn}
          onClick={handleGoToStudio}
          aria-label="Maker Studio"
          title="Maker Studio"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
      </nav>

      <div className={styles.bottomStack}>
        <button type="button" className={styles.themeToggle} onClick={toggleTheme} title={isDarkMode ? 'Switch to Light' : 'Switch to Dark'}>
          {isDarkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        <button 
          type="button"
          className={`${styles.settingsBtn} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
          aria-label="Settings"
          title="Settings"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;