import React, { useState, useMemo } from 'react';
import styles from './MakerVerificationTab.module.css';

const MakerVerificationTab = ({ notify }) => {
  const [filter, setFilter] = useState('all'); 
  const [selectedApp, setSelectedApp] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTabModal, setActiveTabModal] = useState('details'); // 'details' or 'products'

  // Mock Data: Applications
  const [applications, setApplications] = useState([
    {
      id: 'APP-001',
      brandName: 'Urban Thread Co.',
      ownerName: 'Alex Mercer',
      email: 'alex@urbanthread.co',
      category: 'Streetwear',
      appliedDate: '2023-10-24',
      status: 'pending',
      portfolioUrl: 'https://urbanthread.co',
      monthlyRevenue: '$5k - $10k',
      notes: 'Specializes in heavyweight hoodies. Strong portfolio.',
      // New: Products waiting for review upon account approval
      submittedProducts: [
        { id: 1, name: '450GSM Heavyweight Tee', price: '$45.00', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' },
        { id: 2, name: 'Oversized Cargo Pants', price: '$85.00', img: 'https://images.unsplash.com/photo-1552160753-f16781e7a45e?w=500' }
      ]
    },
    {
      id: 'APP-002',
      brandName: 'Neon Athletics',
      ownerName: 'Sarah Jenkins',
      email: 'sarah@neonathletics.com',
      category: 'Activewear',
      appliedDate: '2023-10-23',
      status: 'pending',
      portfolioUrl: 'https://neonathletics.com',
      monthlyRevenue: '$1k - $5k',
      notes: 'New brand, high potential designs.',
      submittedProducts: [
        { id: 3, name: 'Compression Leggings', price: '$55.00', img: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=500' }
      ]
    },
    {
      id: 'APP-003',
      brandName: 'Void Archives',
      ownerName: 'Marcus Chen',
      email: 'm@voidarchives.net',
      category: 'Avant-Garde',
      appliedDate: '2023-10-20',
      status: 'approved',
      portfolioUrl: 'https://voidarchives.net',
      monthlyRevenue: '$20k+',
      notes: 'Established designer. Approved by Admin.',
      submittedProducts: []
    },
    {
      id: 'APP-004',
      brandName: 'Fast Fashion Hub',
      ownerName: 'Unknown Entity',
      email: 'contact@ffhub spam.com',
      category: 'General',
      appliedDate: '2023-10-19',
      status: 'rejected',
      portfolioUrl: '',
      monthlyRevenue: 'Not specified',
      notes: 'Rejected: Suspicious activity.',
      submittedProducts: []
    }
  ]);

  const filteredApps = useMemo(() => {
    if (filter === 'all') return applications;
    return applications.filter(app => app.status === filter);
  }, [applications, filter]);

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const handleAction = async (id, action) => {
    setIsProcessing(true);
    setTimeout(() => {
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: action } : app
      ));
      setSelectedApp(null);
      setIsProcessing(false);
      
      const message = action === 'approved' 
        ? 'Maker verified! Their products are now live.' 
        : 'Application rejected.';
      
      if (notify) notify(message, action === 'approved' ? 'success' : 'danger');
    }, 800);
  };

  const openModal = (app) => {
    setSelectedApp(app);
    setActiveTabModal('details');
  };

  return (
    <div className={styles.container}>
      
      {/* Header Stats */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Applications</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={`${styles.statItem} ${styles.pending}`}>
          <span className={styles.statLabel}>Pending Review</span>
          <span className={styles.statValue}>{stats.pending}</span>
        </div>
        <div className={`${styles.statItem} ${styles.approved}`}>
          <span className={styles.statLabel}>Active Makers</span>
          <span className={styles.statValue}>{stats.approved}</span>
        </div>
        <div className={`${styles.statItem} ${styles.rejected}`}>
          <span className={styles.statLabel}>Rejected</span>
          <span className={styles.statValue}>{stats.rejected}</span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`} onClick={() => setFilter('pending')}>
            Pending {stats.pending > 0 && <span className={styles.badge}>{stats.pending}</span>}
          </button>
          <button className={`${styles.filterBtn} ${filter === 'approved' ? styles.active : ''}`} onClick={() => setFilter('approved')}>Active Makers</button>
          <button className={`${styles.filterBtn} ${filter === 'rejected' ? styles.active : ''}`} onClick={() => setFilter('rejected')}>Rejected</button>
        </div>
        
        <div className={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search brands..." />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Brand / Owner</th>
              <th>Category</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length > 0 ? (
              filteredApps.map(app => (
                <tr key={app.id} className={app.status === 'pending' ? styles.rowPending : ''}>
                  <td>
                    <div className={styles.brandCell}>
                      <div className={styles.brandName}>{app.brandName}</div>
                      <div className={styles.ownerName}>{app.ownerName}</div>
                    </div>
                  </td>
                  <td>{app.category}</td>
                  <td>{app.appliedDate}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[app.status]}`}>
                      {app.status === 'approved' ? 'Active' : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className={styles.viewBtn} onClick={() => openModal(app)}>
                      {app.status === 'pending' ? 'Review & Verify' : 'View Details'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.emptyState}>No applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className={styles.modalOverlay} onClick={() => setSelectedApp(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>{selectedApp.brandName}</h3>
                <p>ID: {selectedApp.id} • {selectedApp.ownerName}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedApp(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Tabs */}
            <div className={styles.modalTabs}>
              <button 
                className={`${styles.modalTab} ${activeTabModal === 'details' ? styles.active : ''}`}
                onClick={() => setActiveTabModal('details')}
              >
                Application Details
              </button>
              {selectedApp.submittedProducts && selectedApp.submittedProducts.length > 0 && (
                <button 
                  className={`${styles.modalTab} ${activeTabModal === 'products' ? styles.active : ''}`}
                  onClick={() => setActiveTabModal('products')}
                >
                  Pending Products ({selectedApp.submittedProducts.length})
                </button>
              )}
            </div>

            <div className={styles.modalBody}>
              {activeTabModal === 'details' && (
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label>Email Address</label>
                    <span>{selectedApp.email}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Category</label>
                    <span>{selectedApp.category}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Est. Monthly Revenue</label>
                    <span>{selectedApp.monthlyRevenue}</span>
                  </div>
                  <div className={styles.infoItemFull}>
                    <label>Portfolio / Website</label>
                    {selectedApp.portfolioUrl ? (
                      <a href={selectedApp.portfolioUrl} target="_blank" rel="noreferrer" className={styles.link}>
                        {selectedApp.portfolioUrl}
                      </a>
                    ) : (
                      <span style={{opacity: 0.5}}>Not provided</span>
                    )}
                  </div>
                  <div className={styles.infoItemFull}>
                    <label>Admin Notes</label>
                    <p className={styles.notes}>{selectedApp.notes}</p>
                  </div>
                </div>
              )}

              {activeTabModal === 'products' && (
                <div className={styles.productPreviewList}>
                  <p className={styles.previewHint}>These products will go live immediately upon account approval.</p>
                  <div className={styles.productGrid}>
                    {selectedApp.submittedProducts.map(prod => (
                      <div key={prod.id} className={styles.productCard}>
                        <img src={prod.img} alt={prod.name} />
                        <div className={styles.productInfo}>
                          <span className={styles.prodName}>{prod.name}</span>
                          <span className={styles.prodPrice}>{prod.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedApp.status === 'pending' && (
              <div className={styles.modalActions}>
                <button 
                  className={styles.rejectBtn}
                  onClick={() => handleAction(selectedApp.id, 'rejected')}
                  disabled={isProcessing}
                >
                  Reject Application
                </button>
                <button 
                  className={styles.approveBtn}
                  onClick={() => handleAction(selectedApp.id, 'approved')}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Verify Maker & Approve Products'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MakerVerificationTab;