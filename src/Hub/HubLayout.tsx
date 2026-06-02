import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './HubLayout.module.css';

const BrutigeLogo = () => (
  <svg width="32" height="32" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="25" fill="currentColor"/>
    <path d="M24.6 13L24.6 30.5L14 36.5L24.6 13Z" fill="var(--hub-bg)"/>
    <path d="M25.4 13L25.4 30.5L36 36.5L25.4 13Z" fill="var(--hub-bg)"/>
  </svg>
);

const HubLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  
  // Mobile Menu State (Full overlay menu)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Tablet Sidebar State (Collapsible sidebar)
  const [tabletSidebarOpen, setTabletSidebarOpen] = useState(true);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  const toggleTabletSidebar = () => setTabletSidebarOpen(!tabletSidebarOpen);

  const navItems = [
    { path: '/hub/collections', label: 'Collections' },
    { path: '/hub/process', label: 'How It Works' },
    { path: '/hub/showcase', label: 'Showcase' },
  ];

  const resourceItems = [
    { path: '/hub/faq', label: 'FAQ' },
    { path: '/hub/blog', label: 'Blog' },
    { path: '/hub/guides', label: 'Design Guides' },
    { path: '/hub/support', label: 'Support' },
  ];

  const legalItems = [
    { path: '/hub/privacy', label: 'Privacy' },
    { path: '/hub/terms', label: 'Terms' },
    { path: '/hub/cookies', label: 'Cookies' },
  ];

  return (
    <div className={styles.hubContainer}>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`${styles.mobileBackdrop} ${mobileMenuOpen ? styles.open : ''}`} 
        onClick={closeMobileMenu}
      />

      {/* Persistent Sidebar */}
      {/* Added class for tablet collapsed state */}
      <aside className={`
        ${styles.sidebar} 
        ${mobileMenuOpen ? styles.mobileOpen : ''} 
        ${!tabletSidebarOpen ? styles.tabletCollapsed : ''}
      `}>
        
        {/* Sidebar Header */}
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logoLink} onClick={closeMobileMenu}>
            <BrutigeLogo />
            {/* Hide text on tablet if collapsed */}
            <span className={`${styles.logoText} ${!tabletSidebarOpen ? styles.hideText : ''}`}>brutige</span>
          </Link>
          
          {/* Close Button for Mobile */}
          <button className={styles.menuToggle} onClick={toggleMobileMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className={styles.navSection}>
          {/* Main Navigation */}
          <div className={styles.navGroup}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Resources Dropdown */}
          <div className={styles.navGroup}>
            <button 
              className={styles.navGroupHeader}
              onClick={() => setResourcesOpen(!resourcesOpen)}
            >
              <span className={styles.navLabel}>Resources</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${styles.chevron} ${resourcesOpen ? styles.chevronOpen : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <div className={`${styles.subNav} ${resourcesOpen ? styles.subNavOpen : ''}`}>
              {resourceItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.subNavItem} ${isActive(item.path) ? styles.active : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.legalGroup}>
            {legalItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={styles.legalLink}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <button onClick={() => navigate('/')} className={styles.backBtn}>
            ← Back
          </button>
          <span className={`${styles.version} ${!tabletSidebarOpen ? styles.hideText : ''}`}>v2.4.0</span>
        </div>
      </aside>

      {/* Mobile Header Bar (Visible only on mobile < 768px) */}
      <div className={styles.mobileHeader}>
        <Link to="/" className={styles.mobileLogoWrapper}>
          <BrutigeLogo />
          <span>brutige</span>
        </Link>
        <button className={styles.menuToggle} onClick={toggleMobileMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Tablet Toggle Button (Visible ONLY on tablet 768px - 1150px) */}
      <button 
        className={styles.tabletToggle} 
        onClick={toggleTabletSidebar}
        aria-label="Toggle Sidebar"
      >
        {tabletSidebarOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Dynamic Content Area */}
      <main className={`${styles.mainContent} ${!tabletSidebarOpen ? styles.tabletExpanded : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default HubLayout;