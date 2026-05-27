import React, { useState, useMemo } from 'react';
import styles from './UserManagementTab.module.css';

const UserManagementTab = ({ notify }) => {
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState(null);
  
  // NEW STATE: To hold the reason you type
  const [banReasonText, setBanReasonText] = useState('');

  const [users, setUsers] = useState([
    {
      id: 'U-001',
      name: 'Alex Mercer',
      email: 'alex@urbanthread.co',
      role: 'maker',
      brandName: 'Urban Thread Co.',
      status: 'active',
      joinedDate: '2023-09-15',
      totalOrders: 0,
      totalSales: 1250,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 'U-002',
      name: 'Sarah Jenkins',
      email: 'sarah@neonathletics.com',
      role: 'maker',
      brandName: 'Neon Athletics',
      status: 'active',
      joinedDate: '2023-10-01',
      totalOrders: 0,
      totalSales: 450,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      id: 'U-003',
      name: 'Michael Chen',
      email: 'mike.chen@gmail.com',
      role: 'customer',
      brandName: null,
      status: 'active',
      joinedDate: '2023-08-20',
      totalOrders: 14,
      totalSales: 0,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    {
      id: 'U-004',
      name: 'Bad Actor Inc',
      email: 'spam@fake.com',
      role: 'maker',
      brandName: 'Fake Goods',
      status: 'banned',
      joinedDate: '2023-10-10',
      totalOrders: 0,
      totalSales: 0,
      banReason: 'Fraudulent activity',
      avatar: 'https://via.placeholder.com/150?text=Banned'
    },
    {
      id: 'U-005',
      name: 'Emma Wilson',
      email: 'emma.w@yahoo.com',
      role: 'customer',
      brandName: null,
      status: 'active',
      joinedDate: '2023-10-22',
      totalOrders: 3,
      totalSales: 0,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  ]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.brandName && user.brandName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, filterRole, filterStatus, searchQuery]);

  const stats = {
    total: users.length,
    makers: users.filter(u => u.role === 'maker').length,
    customers: users.filter(u => u.role === 'customer').length,
    banned: users.filter(u => u.status === 'banned').length,
  };

  const handleOpenAction = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    // Reset the reason field when opening a new modal
    setBanReasonText(''); 
  };

  const confirmAction = async () => {
    if (!selectedUser) return;
    
    // Optional: Prevent banning without a reason if you want to enforce it
    if (actionType === 'ban' && !banReasonText.trim()) {
      alert("Please provide a reason for banning this user.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id 
          ? { 
              ...u, 
              status: actionType === 'ban' ? 'banned' : 'active',
              // Save the typed reason, or a default if empty
              banReason: actionType === 'ban' ? (banReasonText || 'Admin decision') : undefined
            } 
          : u
      ));
      
      setSelectedUser(null);
      setActionType(null);
      setBanReasonText('');
      setIsProcessing(false);
      
      const msg = actionType === 'ban' 
        ? `User ${selectedUser.name} has been banned.` 
        : `User ${selectedUser.name} has been reinstated.`;
      
      if (notify) notify(msg, actionType === 'ban' ? 'danger' : 'success');
    }, 800);
  };

  return (
    <div className={styles.container}>
      
      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Users</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={`${styles.statItem} ${styles.makers}`}>
          <span className={styles.statLabel}>Makers</span>
          <span className={styles.statValue}>{stats.makers}</span>
        </div>
        <div className={`${styles.statItem} ${styles.customers}`}>
          <span className={styles.statLabel}>Customers</span>
          <span className={styles.statValue}>{stats.customers}</span>
        </div>
        <div className={`${styles.statItem} ${styles.banned}`}>
          <span className={styles.statLabel}>Banned</span>
          <span className={styles.statValue}>{stats.banned}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <div className={styles.filterSegment}>
            <span className={styles.segmentLabel}>Role:</span>
            <button className={`${styles.filterBtn} ${filterRole === 'all' ? styles.active : ''}`} onClick={() => setFilterRole('all')}>All</button>
            <button className={`${styles.filterBtn} ${filterRole === 'maker' ? styles.active : ''}`} onClick={() => setFilterRole('maker')}>Makers</button>
            <button className={`${styles.filterBtn} ${filterRole === 'customer' ? styles.active : ''}`} onClick={() => setFilterRole('customer')}>Customers</button>
          </div>
          
          <div className={styles.filterSegment}>
            <span className={styles.segmentLabel}>Status:</span>
            <button className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.active : ''}`} onClick={() => setFilterStatus('all')}>All</button>
            <button className={`${styles.filterBtn} ${filterStatus === 'active' ? styles.active : ''}`} onClick={() => setFilterStatus('active')}>Active</button>
            <button className={`${styles.filterBtn} ${filterStatus === 'banned' ? styles.active : ''}`} onClick={() => setFilterStatus('banned')}>Banned</button>
          </div>
        </div>

        <div className={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search name, email, brand..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Activity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className={user.status === 'banned' ? styles.rowBanned : ''}>
                  <td>
                    <div className={styles.userCell}>
                      <img src={user.avatar} alt={user.name} className={styles.avatar} />
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>{user.name}</div>
                        <div className={styles.userEmail}>{user.email}</div>
                        {user.brandName && <div className={styles.userBrand}>{user.brandName}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                      {user.role === 'maker' ? 'Maker' : 'Customer'}
                    </span>
                  </td>
                  <td>{user.joinedDate}</td>
                  <td>
                    <div className={styles.activityMeta}>
                      {user.role === 'maker' ? (
                        <span>${user.totalSales} Sales</span>
                      ) : (
                        <span>{user.totalOrders} Orders</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[user.status]}`}>
                      {user.status === 'banned' ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.viewBtn} onClick={() => handleOpenAction(user, 'view')}>Details</button>
                      {user.status === 'active' ? (
                        <button className={styles.banBtn} onClick={() => handleOpenAction(user, 'ban')}>Ban</button>
                      ) : (
                        <button className={styles.unbanBtn} onClick={() => handleOpenAction(user, 'unban')}>Unban</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.emptyState}>No users found matching your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      {selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setSelectedUser(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            
            {actionType === 'view' ? (
              // VIEW DETAILS
              <>
                <div className={styles.modalHeader}>
                  <div>
                    <h3>{selectedUser.name}</h3>
                    <p>ID: {selectedUser.id} • {selectedUser.email}</p>
                  </div>
                  <button className={styles.closeBtn} onClick={() => setSelectedUser(null)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.profileHeader}>
                    <img src={selectedUser.avatar} alt="Profile" className={styles.largeAvatar} />
                    <div className={styles.profileInfo}>
                      <span className={`${styles.roleBadge} ${styles[selectedUser.role]}`}>{selectedUser.role === 'maker' ? 'Maker' : 'Customer'}</span>
                      <span className={`${styles.statusBadge} ${styles[selectedUser.status]}`}>{selectedUser.status}</span>
                    </div>
                  </div>
                  
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>Joined Date</label>
                      <span>{selectedUser.joinedDate}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Total Orders</label>
                      <span>{selectedUser.totalOrders}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Total Sales</label>
                      <span>${selectedUser.totalSales}</span>
                    </div>
                    {selectedUser.brandName && (
                      <div className={styles.infoItem}>
                        <label>Brand Name</label>
                        <span>{selectedUser.brandName}</span>
                      </div>
                    )}
                    {selectedUser.banReason && (
                      <div className={styles.infoItemFull}>
                        <label>Ban Reason</label>
                        <p className={styles.notes}>{selectedUser.banReason}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.closeActionBtn} onClick={() => setSelectedUser(null)}>Close</button>
                </div>
              </>
            ) : (
              // CONFIRM BAN/UNBAN
              <>
                <div className={styles.modalHeader}>
                  <h3>{actionType === 'ban' ? 'Ban User' : 'Unban User'}</h3>
                  <button className={styles.closeBtn} onClick={() => setSelectedUser(null)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <p className={styles.warningText}>
                    {actionType === 'ban' 
                      ? `You are about to ban ${selectedUser.name}. They will no longer be able to access their account or list products.` 
                      : `You are about to reinstate ${selectedUser.name}. They will regain full access to the platform.`}
                  </p>
                  {actionType === 'ban' && (
                    <div className={styles.reasonSection}>
                      <label>Reason for Ban *</label>
                      <textarea 
                        placeholder="e.g., Violation of Terms of Service, Fraudulent activity..." 
                        rows={4}
                        className={styles.reasonInput}
                        value={banReasonText}
                        onChange={(e) => setBanReasonText(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setSelectedUser(null)}>Cancel</button>
                  <button 
                    className={actionType === 'ban' ? styles.confirmBanBtn : styles.confirmUnbanBtn} 
                    onClick={confirmAction} 
                    disabled={isProcessing || (actionType === 'ban' && !banReasonText.trim())}
                  >
                    {isProcessing ? 'Processing...' : (actionType === 'ban' ? 'Confirm Ban' : 'Confirm Unban')}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTab;