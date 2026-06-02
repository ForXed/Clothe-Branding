import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ activeTab, setActiveTab, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();

  const navItems = [
    { 
      id: 'shop', 
      label: 'Feed', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> 
    },
    { 
      id: 'saved', 
      label: 'Saved Items', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> 
    },
    { 
      id: 'chat', 
      label: 'Messages', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg> 
    }
  ];

  // Navigate to Studio (standalone page)
  const goToStudio = () => {
    navigate('/studio');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer} onClick={() => setActiveTab('shop')}>
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
            className={`${styles.navBtn} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-label={item.label}
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
      </nav>

      <div className={styles.bottomStack}>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {isDarkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        {/* GEAR ICON - Now goes to Settings instead of Profile */}
        <button 
          className={`${styles.settingsBtn} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
          aria-label="Settings"
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