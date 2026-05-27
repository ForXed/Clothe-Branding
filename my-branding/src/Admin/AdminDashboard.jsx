import React, { useState } from 'react';
import styles from './AdminDashboard.module.css';

// Import all Tab Components
import OverviewTab from './OverviewTab/OverviewTab';
import MakerVerificationTab from './MakerVerificationTab/MakerVerificationTab';
import ContentModerationTab from './ContentModerationTab/ContentModerationTab';
import UserManagementTab from './UserManagementTab/UserManagementTab';
import OrdersAndEscrowTab from './OrdersAndEscrowTab/OrdersAndEscrowTab';
import FinanceAndPayoutsTab from './FinanceAndPayoutsTab/FinanceAndPayoutsTab';
import PlatformSettingsTab from './PlatformSettingsTab/PlatformSettingsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse

  const metrics = {
    totalRevenue: '$124,592.00',
    revenueGrowth: '+12.5%',
    activeUsers: 1458,
    userGrowth: '+5.2%',
    totalOrders: 892,
    orderGrowth: '+8.1%',
    pendingVerifications: 12,
  };

  // Mock notification handler
  const handleNotify = (message, type) => {
    console.log(`Notification: ${message} (${type})`);
    // In a real app, trigger your global toast/notification context here
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'users', label: 'User Management', icon: <UsersIcon /> },
    { id: 'makers', label: 'Maker Verification', icon: <VerifyIcon />, badge: metrics.pendingVerifications },
    { id: 'orders', label: 'Orders & Escrow', icon: <BoxIcon /> },
    { id: 'finance', label: 'Finance & Payouts', icon: <DollarIcon /> },
    { id: 'content', label: 'Content Moderation', icon: <ShieldIcon />, badge: 2 }, 
    { id: 'settings', label: 'Platform Settings', icon: <SettingsIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab metrics={metrics} />;
      
      case 'users':
        return <UserManagementTab notify={handleNotify} />;
      
      case 'makers':
        return <MakerVerificationTab notify={handleNotify} />;
      
      case 'orders':
        return <OrdersAndEscrowTab notify={handleNotify} />;
      
      case 'finance':
        return <FinanceAndPayoutsTab notify={handleNotify} />;
      
      case 'content':
        return <ContentModerationTab notify={handleNotify} />;
      
      case 'settings':
        return <PlatformSettingsTab notify={handleNotify} />;
      
      default:
        return <div className={styles.placeholder}>Module Under Construction</div>;
    }
  };

  return (
    <div className={styles.adminContainer}>
      
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>
          {/* Logo SVG - Accent Circle, Black Shapes */}
          <svg width="32" height="32" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" fill="var(--brut-accent)" />
            <path d="M48 25L48 65L25 80L48 25Z" fill="#000000" />
            <path d="M52 25L52 65L75 80L52 25Z" fill="#000000" />
          </svg>
          <span>Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className={styles.menuBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.layoutWrapper}>
        
        {/* Sidebar */}
        <aside className={`
          ${styles.sidebar} 
          ${sidebarOpen ? styles.open : ''} 
          ${sidebarCollapsed ? styles.collapsed : ''}
        `}>
          <div className={styles.logoArea}>
            <svg width="45" height="45" viewBox="0 0 100 100" className={styles.logoIcon}>
              <circle cx="50" cy="50" r="50" fill="var(--brut-accent)" />
              <path d="M48 25L48 65L25 80L48 25Z" fill="#000000" />
              <path d="M52 25L52 65L75 80L52 25Z" fill="#000000" />
            </svg>
            <h1 className={`${styles.logoText} ${sidebarCollapsed ? styles.hidden : ''}`}>
              Admin
            </h1>
          </div>
          
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={`${styles.label} ${sidebarCollapsed ? styles.hidden : ''}`}>{item.label}</span>
                {item.badge > 0 && !sidebarCollapsed && (
                  <span className={styles.badge}>{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className={`${styles.adminProfile} ${sidebarCollapsed ? styles.collapsedProfile : ''}`}>
            <div className={styles.avatar}>AD</div>
            <div className={`${styles.info} ${sidebarCollapsed ? styles.hidden : ''}`}>
              <span className={styles.name}>Admin User</span>
              <span className={styles.role}>Super Admin</span>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className={`${styles.mainContent} ${sidebarCollapsed ? styles.contentExpanded : ''}`}>
          <header className={styles.topBar}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <button 
                className={styles.collapseBtn} 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
              </button>
              <h2>{navItems.find(i => i.id === activeTab)?.label}</h2>
            </div>
            
            <div className={styles.actions}>
              <button className={styles.btnSecondary}>Export</button>
              <button className={styles.btnPrimary}>
                <span className={styles.statusDot}></span>
                Operational
              </button>
            </div>
          </header>
          
          <div className={styles.contentBody}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- Icons ---
const DashboardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const VerifyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const BoxIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
const DollarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;

export default AdminDashboard;