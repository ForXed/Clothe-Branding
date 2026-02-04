import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { 
      id: 'shop', 
      label: 'Shop', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      )
    },
    { 
      id: 'chat', 
      label: 'Chat', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
        </svg>
      )
    },
    { 
      id: 'studio', 
      label: 'Maker Studio', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      )
    },
    { 
      id: 'cart', 
      label: 'Cart', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      )
    }
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoContainer} onClick={() => setActiveTab('shop')}>
        <svg width="45" height="45" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="black"/>
          <path d="M48 25L48 65L25 80L48 25Z" fill="white"/>
          <path d="M52 25L52 65L75 80L52 25Z" fill="white"/>
        </svg>
      </div>

      {/* Navigation */}
      <nav className={styles.navStack}>
        {navItems.map(item => (
          <button 
            key={item.id}
            className={`${styles.navBtn} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-label={item.label}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </nav>

      {/* Settings Button */}
      <button 
        className={`${styles.settingsBtn} ${activeTab === 'settings' ? styles.active : ''}`}
        onClick={() => setActiveTab('settings')}
        aria-label="Settings"
        title="Settings"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24"/>
        </svg>
      </button>
    </aside>
  );
};

export default Sidebar;