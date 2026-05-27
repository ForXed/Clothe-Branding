import React, { useState } from 'react';
import styles from './PlatformSettingsTab.module.css';

const PlatformSettingsTab = ({ notify }) => {
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  
  // State: General Settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'Brutige Marketplace',
    supportEmail: 'support@brutige.com',
    currency: 'USD',
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing scheduled maintenance. Check back soon.'
  });

  // State: Financial Settings
  const [financialSettings, setFinancialSettings] = useState({
    commissionRate: 10,
    minimumPayout: 50,
    autoApprovePayouts: false,
    taxId: 'US-123456789'
  });

  // State: Admin Users
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Super Admin', email: 'admin@brutige.com', role: 'Super Admin', status: 'active' },
    { id: 2, name: 'Support Lead', email: 'support@brutige.com', role: 'Support', status: 'active' },
    { id: 3, name: 'Content Mod', email: 'mod@brutige.com', role: 'Moderator', status: 'inactive' }
  ]);

  // State: Audit Logs (Security)
  const [auditLogs, setAuditLogs] = useState([
    { id: 101, timestamp: '2023-10-26 09:41 AM', user: 'Super Admin', action: 'Login', details: 'Successful login from IP 192.168.1.1', type: 'info' },
    { id: 102, timestamp: '2023-10-26 10:15 AM', user: 'Support Lead', action: 'User Ban', details: 'Banned user U-992 for fraud', type: 'warning' },
    { id: 103, timestamp: '2023-10-26 11:30 AM', user: 'Super Admin', action: 'Payout Approved', details: 'Approved payout PAY-001 ($450)', type: 'success' },
  ]);

  // State: System Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'High Dispute Volume', message: 'Dispute rate increased by 15% this week.', time: '1 hour ago' },
    { id: 2, type: 'info', title: 'System Backup', message: 'Daily database backup completed successfully.', time: '4 hours ago' },
    { id: 3, type: 'warning', title: 'Pending Payouts', message: '5 maker payouts exceeding $2,000 require review.', time: '1 day ago' },
  ]);

  // Helper to add log entry
  const addLog = (action, details, type = 'info') => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      user: 'Super Admin', // Mocked current user
      action,
      details,
      type
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleSaveGeneral = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addLog('Settings Update', 'Updated general platform configuration', 'success');
      if(notify) notify('General settings updated successfully.', 'success');
    }, 1000);
  };

  const handleSaveFinancial = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addLog('Financial Update', `Commission rate changed to ${financialSettings.commissionRate}%`, 'warning');
      if(notify) notify('Financial parameters updated.', 'success');
    }, 1000);
  };

  const toggleMaintenance = () => {
    const newState = !generalSettings.maintenanceMode;
    setGeneralSettings(prev => ({ ...prev, maintenanceMode: newState }));
    addLog(
      newState ? 'Maintenance Enabled' : 'Maintenance Disabled', 
      newState ? 'Platform taken offline' : 'Platform restored to online', 
      newState ? 'warning' : 'success'
    );
    if(notify) notify(
      newState ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled', 
      newState ? 'warning' : 'success'
    );
  };

  const toggleAdminStatus = (id) => {
    const admin = admins.find(a => a.id === id);
    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    
    setAdmins(prev => prev.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    ));
    
    addLog('Admin Status Change', `Set ${admin.name} to ${newStatus}`, 'info');
    if(notify) notify('Admin status updated.', 'success');
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.settingsLayout}>
        
        {/* Navigation Sidebar */}
        <aside className={styles.settingsNav}>
          <button 
            className={`${styles.navItem} ${activeSection === 'general' ? styles.active : ''}`}
            onClick={() => setActiveSection('general')}
          >
            <span className={styles.navIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </span> 
            General
          </button>
          <button 
            className={`${styles.navItem} ${activeSection === 'financial' ? styles.active : ''}`}
            onClick={() => setActiveSection('financial')}
          >
            <span className={styles.navIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </span> 
            Financial & Fees
          </button>
          <button 
            className={`${styles.navItem} ${activeSection === 'admins' ? styles.active : ''}`}
            onClick={() => setActiveSection('admins')}
          >
            <span className={styles.navIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </span> 
            Admin Access
          </button>
          <button 
            className={`${styles.navItem} ${activeSection === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <span className={styles.navIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </span> 
            Notifications
            {notifications.length > 0 && <span className={styles.badge}>{notifications.length}</span>}
          </button>
          <button 
            className={`${styles.navItem} ${activeSection === 'security' ? styles.active : ''}`}
            onClick={() => setActiveSection('security')}
          >
            <span className={styles.navIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </span> 
            Security Logs
          </button>
        </aside>

        {/* Content Area */}
        <main className={styles.settingsContent}>
          
          {/* SECTION: GENERAL */}
          {activeSection === 'general' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>General Configuration</h2>
                <p>Manage platform identity and availability.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.formGroup}>
                  <label>Platform Name</label>
                  <input type="text" value={generalSettings.platformName} onChange={(e) => setGeneralSettings({...generalSettings, platformName: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Support Email</label>
                  <input type="email" value={generalSettings.supportEmail} onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Currency</label>
                  <select value={generalSettings.currency}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleRow}>
                    <div>
                      <label className={styles.toggleLabel}>Maintenance Mode</label>
                      <p className={styles.toggleDesc}>Take the entire marketplace offline for users and makers.</p>
                    </div>
                    <button className={`${styles.toggleSwitch} ${generalSettings.maintenanceMode ? styles.active : ''}`} onClick={toggleMaintenance}>
                      <span className={styles.toggleKnob}></span>
                    </button>
                  </div>
                  {generalSettings.maintenanceMode && (
                    <div className={styles.formGroup}>
                      <label>Maintenance Message</label>
                      <textarea rows={3} value={generalSettings.maintenanceMessage} onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMessage: e.target.value})} />
                    </div>
                  )}
                </div>
                <div className={styles.actions}>
                  <button className={styles.saveBtn} onClick={handleSaveGeneral} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: FINANCIAL */}
          {activeSection === 'financial' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Financial Parameters</h2>
                <p>Control revenue models and payout rules.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.formGroup}>
                  <label>Platform Commission Rate (%)</label>
                  <div className={styles.inputWithSuffix}>
                    <input type="number" value={financialSettings.commissionRate} onChange={(e) => setFinancialSettings({...financialSettings, commissionRate: parseFloat(e.target.value)})} />
                    <span>%</span>
                  </div>
                  <small>Taken from every order total. Current: {financialSettings.commissionRate}%</small>
                </div>
                <div className={styles.formGroup}>
                  <label>Minimum Payout Threshold</label>
                  <div className={styles.inputWithSuffix}>
                    <span>$</span>
                    <input type="number" value={financialSettings.minimumPayout} onChange={(e) => setFinancialSettings({...financialSettings, minimumPayout: parseFloat(e.target.value)})} />
                  </div>
                  <small>Makers must earn at least this amount to request a payout.</small>
                </div>
                <div className={styles.formGroup}>
                  <label>Tax ID / VAT Number</label>
                  <input type="text" value={financialSettings.taxId} onChange={(e) => setFinancialSettings({...financialSettings, taxId: e.target.value})} />
                </div>
                <div className={styles.toggleGroup}>
                  <div className={styles.toggleRow}>
                    <div>
                      <label className={styles.toggleLabel}>Auto-Approve Payouts</label>
                      <p className={styles.toggleDesc}>Danger: Automatically mark payouts as paid without admin verification.</p>
                    </div>
                    <button className={`${styles.toggleSwitch} ${financialSettings.autoApprovePayouts ? styles.active : ''}`} onClick={() => setFinancialSettings({...financialSettings, autoApprovePayouts: !financialSettings.autoApprovePayouts})}>
                      <span className={styles.toggleKnob}></span>
                    </button>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button className={styles.saveBtn} onClick={handleSaveFinancial} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Update Financials'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ADMINS */}
          {activeSection === 'admins' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Admin Access Control</h2>
                <p>Manage team members and permissions.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.tableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map(admin => (
                        <tr key={admin.id}>
                          <td><strong>{admin.name}</strong></td>
                          <td>{admin.email}</td>
                          <td><span className={styles.roleBadge}>{admin.role}</span></td>
                          <td>
                            <span className={`${styles.statusDot} ${admin.status === 'active' ? styles.active : styles.inactive}`}></span>
                            {admin.status}
                          </td>
                          <td>
                            <button className={styles.smallBtn} onClick={() => toggleAdminStatus(admin.id)}>
                              {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.addAdminPlaceholder}>
                  <button className={styles.addBtn}>+ Invite New Admin</button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>System Notifications</h2>
                <p>Recent alerts and system updates requiring attention.</p>
              </div>
              <div className={styles.card}>
                {notifications.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>All caught up! No new notifications.</p>
                  </div>
                ) : (
                  <div className={styles.notificationList}>
                    {notifications.map(note => (
                      <div key={note.id} className={`${styles.noteItem} ${styles[note.type]}`}>
                        <div className={styles.noteContent}>
                          <div className={styles.noteHeader}>
                            <h4>{note.title}</h4>
                            <span className={styles.noteTime}>{note.time}</span>
                          </div>
                          <p>{note.message}</p>
                        </div>
                        <button className={styles.dismissBtn} onClick={() => clearNotification(note.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION: SECURITY LOGS */}
          {activeSection === 'security' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Security & Audit Logs</h2>
                <p>Immutable record of all admin actions and system events.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.tableWrapper}>
                  <table className={styles.logTable}>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Details</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map(log => (
                        <tr key={log.id}>
                          <td className={styles.monospace}>{log.timestamp}</td>
                          <td>{log.user}</td>
                          <td><strong>{log.action}</strong></td>
                          <td>{log.details}</td>
                          <td>
                            <span className={`${styles.logBadge} ${styles[log.type]}`}>
                              {log.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.logFooter}>
                  <p>Last system backup: <strong>Today, 04:00 AM</strong></p>
                  <button className={styles.exportBtn}>Export Logs (CSV)</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default PlatformSettingsTab;