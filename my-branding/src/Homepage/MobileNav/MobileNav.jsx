import React from 'react';
import styles from './MobileNav.module.css';

const MobileNav = ({ activeTab, setActiveTab, cartCount = 0, theme, toggleTheme }) => {
  const navItems = [
    { 
      id: 'shop', 
      label: 'Shop',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      )
    },
    { 
      id: 'search', 
      label: 'Search',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      )
    },
    { 
      id: 'cart', 
      label: 'Cart',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
      badge: cartCount
    },
    { 
      id: 'settings', 
      label: 'Settings',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24"/>
        </svg>
      )
    },
    { 
      id: 'theme', 
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      icon: theme === 'dark' ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      ),
      isAction: true
    }
  ];

  const handleClick = (item) => {
    if (item.id === 'theme') {
      toggleTheme();
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <div className={styles.wrapper}>
      <nav className={styles.pillContainer}>
        {navItems.map(item => (
          <button 
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id && !item.isAction ? styles.active : ''}`}
            onClick={() => handleClick(item)}
            aria-label={item.label}
          >
            <span className={styles.iconWrapper}>
              {item.icon}
              {item.badge > 0 && (
                <span className={styles.badge}>{item.badge}</span>
              )}
            </span>
            {activeTab === item.id && !item.isAction && <span className={styles.activeDot} />}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;