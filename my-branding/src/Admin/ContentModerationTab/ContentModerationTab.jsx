import React, { useState, useMemo } from 'react';
import styles from './ContentModerationTab.module.css';

const ContentModerationTab = ({ notify }) => {
  const [filter, setFilter] = useState('pending'); // Default to pending to show work queue
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modal States
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'remove'
  const [removalReason, setRemovalReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  // Mock Data: Products submitted by Makers awaiting approval or already managed
  const [contentList, setContentList] = useState([
    {
      id: 'PROD-101',
      type: 'product',
      title: 'Heavyweight Oversized Tee - Black',
      maker: 'Urban Thread Co.',
      makerId: 'M-001',
      price: '$45.00',
      status: 'pending', // Awaiting your approval
      reportedCount: 0,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'
      ],
      description: '450GSM cotton, oversized fit. Made in Portugal.',
      category: 'T-Shirts',
      date: '2023-10-25'
    },
    {
      id: 'PROD-102',
      type: 'product',
      title: 'Distressed Cargo Pants',
      maker: 'Void Archives',
      makerId: 'M-003',
      price: '$120.00',
      status: 'pending',
      reportedCount: 0,
      images: [
        'https://images.unsplash.com/photo-1552160753-f16781e7a45e?w=800'
      ],
      description: 'Vintage wash cargo pants with multiple pockets.',
      category: 'Pants',
      date: '2023-10-24'
    },
    {
      id: 'PROD-103',
      type: 'product',
      title: 'Fake Designer Hoodie',
      maker: 'Fast Fashion Hub',
      makerId: 'M-004',
      price: '$30.00',
      status: 'rejected',
      reportedCount: 0,
      images: ['https://via.placeholder.com/800?text=Rejected+Item'],
      description: 'High quality replica.',
      category: 'Hoodies',
      date: '2023-10-20',
      removalReason: 'Intellectual Property Violation',
      customReason: 'Item appears to be a counterfeit of a major brand.'
    },
    {
      id: 'PROD-104',
      type: 'product',
      title: 'Neon Running Shorts',
      maker: 'Neon Athletics',
      makerId: 'M-002',
      price: '$35.00',
      status: 'approved', // Already live
      reportedCount: 2, // Maybe users reported it after going live
      images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800'],
      description: 'Lightweight running shorts.',
      category: 'Activewear',
      date: '2023-10-22'
    }
  ]);

  const filteredContent = useMemo(() => {
    if (filter === 'all') return contentList;
    return contentList.filter(item => item.status === filter);
  }, [contentList, filter]);

  const stats = {
    total: contentList.length,
    pending: contentList.filter(c => c.status === 'pending').length,
    approved: contentList.filter(c => c.status === 'approved').length,
    rejected: contentList.filter(c => c.status === 'rejected').length,
  };

  const handleOpenView = (item) => {
    setSelectedItem(item);
    setModalMode('view');
    setRemovalReason('');
    setCustomReason('');
  };

  const handleOpenRemove = () => {
    setModalMode('remove');
  };

  const confirmApproval = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setContentList(prev => prev.map(item => 
        item.id === selectedItem.id ? { ...item, status: 'approved' } : item
      ));
      setSelectedItem(null);
      setIsProcessing(false);
      if (notify) notify('Product approved and published!', 'success');
    }, 800);
  };

  const confirmRemoval = async () => {
    if (!removalReason) {
      alert("Please select a reason.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setContentList(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, status: 'rejected', removalReason, customReason } 
          : item
      ));
      setSelectedItem(null);
      setModalMode('view');
      setIsProcessing(false);
      if (notify) notify('Product rejected and hidden.', 'danger');
    }, 800);
  };

  const handleRestore = async (id) => {
    if(!window.confirm("Restore this product to pending review?")) return;
    setIsProcessing(true);
    setTimeout(() => {
      setContentList(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'pending', removalReason: undefined, customReason: undefined } : item
      ));
      if (notify) notify('Product restored to pending queue.', 'success');
      setIsProcessing(false);
    }, 600);
  };

  const commonReasons = [
    "Intellectual Property Violation",
    "Prohibited Items",
    "Inappropriate Imagery",
    "Misleading Description",
    "Poor Quality Images",
    "Violation of Terms of Service"
  ];

  return (
    <div className={styles.container}>
      
      {/* Header Stats */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Submissions</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={`${styles.statItem} ${styles.pending}`}>
          <span className={styles.statLabel}>Pending Approval</span>
          <span className={styles.statValue}>{stats.pending}</span>
        </div>
        <div className={`${styles.statItem} ${styles.approved}`}>
          <span className={styles.statLabel}>Live Products</span>
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
          <button className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`} onClick={() => setFilter('pending')}>
            Pending Review
            {stats.pending > 0 && <span className={styles.badge}>{stats.pending}</span>}
          </button>
          <button className={`${styles.filterBtn} ${filter === 'approved' ? styles.active : ''}`} onClick={() => setFilter('approved')}>Live Products</button>
          <button className={`${styles.filterBtn} ${filter === 'rejected' ? styles.active : ''}`} onClick={() => setFilter('rejected')}>Rejected</button>
          <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All</button>
        </div>
        
        <div className={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search products..." />
        </div>
      </div>

      {/* Grid Layout */}
      <div className={styles.contentGrid}>
        {filteredContent.length > 0 ? (
          filteredContent.map(item => (
            <div key={item.id} className={`${styles.card} ${item.status === 'pending' ? styles.cardPending : ''} ${item.status === 'rejected' ? styles.cardRejected : ''}`}>
              <div className={styles.cardImageWrapper}>
                <img src={item.images[0]} alt={item.title} className={styles.cardImage} />
                <div className={styles.typeBadge}>Product</div>
                
                {item.status === 'pending' && (
                  <div className={styles.overlayPending}>Awaiting Review</div>
                )}
                {item.status === 'rejected' && (
                  <div className={styles.overlayRejected}>Rejected</div>
                )}
                {item.status === 'approved' && item.reportedCount > 0 && (
                  <div className={styles.overlayFlagged}>{item.reportedCount} User Reports</div>
                )}
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                  <span className={styles.cardMaker}>{item.maker}</span>
                </div>
                
                <div className={styles.cardMeta}>
                  <span className={styles.price}>{item.price}</span>
                  <span className={styles.category}>{item.category}</span>
                </div>

                {item.status === 'rejected' && (
                  <div className={styles.removalNote}>
                    <strong>Reason:</strong> {item.removalReason}
                  </div>
                )}

                <div className={styles.cardActions}>
                  <button className={styles.viewBtn} onClick={() => handleOpenView(item)}>
                    {item.status === 'pending' ? 'Review & Decide' : 'View Details'}
                  </button>
                  
                  {item.status === 'rejected' && (
                    <button className={styles.restoreBtn} onClick={() => handleRestore(item.id)}>Restore</button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>No products found for this filter.</div>
        )}
      </div>

      {/* Action Modal */}
      {selectedItem && (
        <div className={styles.modalOverlay} onClick={() => setModalMode('view') || setSelectedItem(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            
            {modalMode === 'view' ? (
              // VIEW / DECIDE MODE
              <>
                <div className={styles.modalHeader}>
                  <div>
                    <h3>{selectedItem.title}</h3>
                    <p>ID: {selectedItem.id} • By {selectedItem.maker}</p>
                  </div>
                  <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                
                <div className={styles.modalBody}>
                  {/* Image Gallery */}
                  <div className={styles.imageGallery}>
                    {selectedItem.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`View ${idx}`} className={styles.galleryImage} />
                    ))}
                  </div>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <label>Price</label>
                      <span>{selectedItem.price}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Category</label>
                      <span>{selectedItem.category}</span>
                    </div>
                    <div className={styles.detailItemFull}>
                      <label>Description</label>
                      <p className={styles.descriptionText}>{selectedItem.description}</p>
                    </div>
                    
                    {selectedItem.removalReason && (
                      <div className={styles.detailItemFull}>
                        <label>Rejection Reason</label>
                        <div className={styles.reasonBox}>
                          <strong>{selectedItem.removalReason}</strong>
                          <p>{selectedItem.customReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.modalActions}>
                  {selectedItem.status === 'pending' ? (
                    <>
                      <button className={styles.rejectBtn} onClick={handleOpenRemove}>
                        Reject Product
                      </button>
                      <button className={styles.approveBtn} onClick={confirmApproval} disabled={isProcessing}>
                        {isProcessing ? 'Publishing...' : 'Approve & Publish'}
                      </button>
                    </>
                  ) : (
                    <button className={styles.closeActionBtn} onClick={() => setSelectedItem(null)}>Close</button>
                  )}
                </div>
              </>
            ) : (
              // REMOVE CONFIRMATION MODE
              <>
                <div className={styles.modalHeader}>
                  <h3>Reject Product</h3>
                  <button className={styles.closeBtn} onClick={() => setModalMode('view')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <p className={styles.warningText}>This will hide the product from the marketplace and notify the maker.</p>
                  
                  <div className={styles.reasonSection}>
                    <label>Select Primary Reason *</label>
                    <select 
                      value={removalReason} 
                      onChange={(e) => setRemovalReason(e.target.value)} 
                      className={styles.reasonSelect}
                    >
                      <option value="">-- Choose a reason --</option>
                      {commonReasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    
                    <label>Additional Details (Optional)</label>
                    <textarea 
                      placeholder="Provide specific feedback for the maker..." 
                      rows={4}
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className={styles.reasonInput}
                    />
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setModalMode('view')}>Cancel</button>
                  <button className={styles.confirmRemoveBtn} onClick={confirmRemoval} disabled={isProcessing || !removalReason}>
                    {isProcessing ? 'Processing...' : 'Confirm Rejection'}
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

export default ContentModerationTab;