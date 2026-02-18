import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ activeTab, setActiveTab, isDarkMode, toggleTheme }) => {
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
    },
    { 
      id: 'cart', 
      label: 'Cart', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> 
    },
    { 
      id: 'studio', 
      label: 'Maker Studio', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> 
    }
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Logo - Takes you to shop feed */}
      <div className={styles.logoContainer} onClick={() => setActiveTab('shop')}>
        <svg width="45" height="45" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="var(--brut-text)"/>
          <path d="M48 25L48 65L25 80L48 25Z" fill="var(--brut-bg)"/>
          <path d="M52 25L52 65L75 80L52 25Z" fill="var(--brut-bg)"/>
        </svg>
      </div>

      {/* Main Navigation */}
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
      </nav>

      {/* Bottom Actions: Theme Toggle + Profile Settings */}
      <div className={styles.bottomStack}>
        <button 
          className={styles.themeToggle} 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        <button 
          className={`${styles.settingsBtn} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
          aria-label="Account Settings"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;