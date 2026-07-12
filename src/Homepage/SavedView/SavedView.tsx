import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SavedView.module.css';
import { Product, SavedItem } from '../BrutigeContext/BrutigeContext';

interface SavedViewProps {
  savedItems: SavedItem[];
  collections: string[];
  onCreateCollection: (newName: string) => boolean;
  onMoveItem: (itemId: string | number, targetCollection: string) => void;
  onSelect: (item: Product) => void;
  toggleSaved: (item: Product) => void;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const SavedView: React.FC<SavedViewProps> = ({
  savedItems,
  collections,
  onCreateCollection,
  onMoveItem,
  onSelect,
  toggleSaved,
  addToCart,
  notify,
}) => {
  const navigate = useNavigate();
  
  const [activeCollection, setActiveCollection] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [movingItemId, setMovingItemId] = useState<string | number | null>(null);
  
  // ✅ NEW: Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  
  // ✅ NEW: Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportText, setExportText] = useState<string>('');
  
  // ✅ NEW: Track when items were saved (since SavedItem doesn't have savedAt)
  const [savedDates, setSavedDates] = useState<Map<string | number, Date>>(new Map());
  
  // ✅ NEW: Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (notify) {
      notify(message, type);
    }
  };

  // ✅ Track new saves
  useEffect(() => {
    const newMap = new Map(savedDates);
    savedItems.forEach(item => {
      if (!newMap.has(item.id)) {
        newMap.set(item.id, new Date());
      }
    });
    setSavedDates(newMap);
  }, [savedItems]);

  // Filter Logic
  const filteredItems = activeCollection === 'All'
    ? savedItems
    : savedItems.filter((item) => (item.collection || 'Uncategorized') === activeCollection);

  // ✅ FIXED: Export wishlist as formatted text
  const handleExportWishlist = () => {
    const itemsList = filteredItems.map((item, idx) => 
      `${idx + 1}. ${item.title} - ${item.price}${item.collection ? ` [${item.collection}]` : ''}`
    ).join('\n');
    
    const text = `My Brutige Wishlist (${filteredItems.length} items)\n${'='.repeat(40)}\n\n${itemsList}\n\nExported on ${new Date().toLocaleDateString()}`;
    
    setExportText(text);
    setIsExportModalOpen(true);
  };

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      showToast('Wishlist copied to clipboard!', 'success');
      setIsExportModalOpen(false);
    } catch (error) {
      showToast('Failed to copy. Please try again.', 'error');
    }
  };

  // ✅ FIXED: Move all to cart with proper feedback
  const moveAllToCart = () => {
    if (filteredItems.length === 0) {
      showToast('No items to move', 'error');
      return;
    }
    
    filteredItems.forEach((item) => addToCart(item, 1, 'M', 'Default'));
    showToast(`${filteredItems.length} item${filteredItems.length > 1 ? 's' : ''} added to cart!`, 'success');
  };

  // ✅ FIXED: Create collection with proper error handling
  const handleCreateCollectionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      showToast('Please enter a collection name', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const success = onCreateCollection(newCollectionName.trim());
      if (success) {
        setActiveCollection(newCollectionName.trim());
        setNewCollectionName('');
        setIsCreateModalOpen(false);
        showToast(`Collection "${newCollectionName.trim()}" created!`, 'success');
      } else {
        showToast('Collection already exists or invalid name', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to create collection', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ FIXED: Move item with proper feedback
  const handleMoveItem = (targetCollection: string) => {
    if (!movingItemId) return;

    setIsProcessing(true);
    try {
      onMoveItem(movingItemId, targetCollection);
      setMovingItemId(null);
      showToast(`Item moved to ${targetCollection}`, 'success');
    } catch (error) {
      showToast('Failed to move item. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ FIXED: Unsave with custom confirmation modal
  const handleUnsave = (item: SavedItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove from Archive?',
      message: `Are you sure you want to remove "${item.title}" from your saved items?`,
      onConfirm: () => {
        toggleSaved(item);
        showToast('Item removed from archive', 'success');
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
      }
    });
  };

  // ✅ Helper: Format time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Empty State
  if (savedItems.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.illustrationWrapper}>
          <svg width='120' height='120' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1'>
            <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
            <path d='M12 7v6M9 10h6' opacity='0.3' />
          </svg>
        </div>
        <h2>Your Archive is Empty</h2>
        <p>Start saving premium templates to build your personal brand collection.</p>
        <button type="button" className={styles.browseBtn} onClick={() => navigate('/platform/shop')}>
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Saved Infrastructure</h1>
          <span className={styles.count}>{filteredItems.length} templates archived</span>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.actionBtn} onClick={handleExportWishlist}>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/>
              <polyline points='7 10 12 15 17 10'/>
              <line x1='12' y1='15' x2='12' y2='3'/>
            </svg>
            Export
          </button>
          <button type="button" className={styles.btnPrimary} onClick={moveAllToCart}>
            Move All to Cart
          </button>
        </div>
      </div>

      {/* COLLECTIONS BAR */}
      <div className={styles.collectionsBar}>
        {collections.map((col) => (
          <button
            key={col}
            type="button"
            className={`${styles.colPill} ${activeCollection === col ? styles.activeCol : ''}`}
            onClick={() => setActiveCollection(col)}
          >
            {col}
            {col !== 'All' && (
              <span className={styles.colCount}>
                {savedItems.filter(item => (item.collection || 'Uncategorized') === col).length}
              </span>
            )}
          </button>
        ))}
        <button type="button" className={styles.addColBtn} onClick={() => setIsCreateModalOpen(true)}>
          + New Collection
        </button>
      </div>

      {/* GRID */}
      {filteredItems.length === 0 ? (
        <div className={styles.emptyState} style={{ minHeight: '40vh' }}>
          <p>No items in this collection yet.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredItems.map((item) => {
            const itemCollection = item.collection || 'Uncategorized';
            const isMovingThisItem = movingItemId === item.id;
            const savedDate = savedDates.get(item.id);

            return (
              <div key={item.id} className={styles.card}>
                <div className={styles.imageContainer}>
                  <div className={styles.clickableImg} onClick={() => onSelect(item)}>
                    <img src={item.img} alt={item.title} />
                  </div>

                  {/* ✅ FIXED: Use real data for badges */}
                  <div className={styles.badges}>
                    {item.stock !== undefined && item.stock < 5 && item.stock > 0 && (
                      <span className={styles.stockAlert}>Only {item.stock} Left</span>
                    )}
                    {item.stock === 0 && (
                      <span className={styles.soldOut}>Sold Out</span>
                    )}
                  </div>

                  <button 
                    type="button" 
                    className={styles.unsaveBtn} 
                    onClick={(e) => { e.stopPropagation(); handleUnsave(item); }}
                    aria-label="Remove from saved"
                  >
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
                      <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
                    </svg>
                  </button>

                  <button 
                    type="button"
                    className={styles.moveBtn}
                    onClick={(e) => { e.stopPropagation(); setMovingItemId(isMovingThisItem ? null : item.id); }}
                    title='Move to collection'
                    aria-label="Move to collection"
                  >
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' />
                    </svg>
                  </button>

                  <button 
                    type="button" 
                    className={styles.quickCartBtn} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      addToCart(item, 1, 'M', 'Default');
                      showToast('Added to cart!', 'success');
                    }}
                    aria-label="Add to cart"
                  >
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                      <path d='M12 5v14M5 12h14' />
                    </svg>
                  </button>

                  {isMovingThisItem && (
                    <div className={styles.moveDropdown}>
                      <div className={styles.dropdownHeader}>Move to...</div>
                      {collections.filter((c) => c !== 'All').map((col) => (
                        <button
                          key={col}
                          type="button"
                          className={`${styles.dropdownItem} ${col === itemCollection ? styles.activeItem : ''}`}
                          onClick={() => handleMoveItem(col)}
                          disabled={isProcessing}
                        >
                          {col} {col === itemCollection && '✓'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.cardInfo}>
                  <div className={styles.itemMain}>
                    <h3>{item.title}</h3>
                    <p className={styles.price}>{item.price}</p>
                  </div>
                  <div className={styles.metaRow}>
                    {/* ✅ FIXED: Show actual time since saved */}
                    <span className={styles.timestamp}>
                      {savedDate ? getTimeAgo(savedDate) : 'Saved'}
                    </span>
                    <span className={styles.dot}>•</span>
                    <span className={styles.category}>{itemCollection}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- CREATE COLLECTION MODAL --- */}
      {isCreateModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCreateModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Create New Collection</h3>
            <form onSubmit={handleCreateCollectionSubmit}>
              <input
                type='text'
                placeholder='e.g., Winter Essentials'
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                autoFocus
                className={styles.modalInput}
                disabled={isProcessing}
              />
              <div className={styles.modalActions}>
                <button 
                  type='button' 
                  onClick={() => setIsCreateModalOpen(false)} 
                  className={styles.cancelBtn}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button 
                  type='submit' 
                  disabled={isProcessing || !newCollectionName.trim()} 
                  className={styles.submitBtn}
                >
                  {isProcessing ? 'Creating...' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ NEW: EXPORT WISHLIST MODAL */}
      {isExportModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsExportModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Export Wishlist</h3>
            <p className={styles.exportHint}>
              Copy your wishlist to share or save for later
            </p>
            <textarea
              value={exportText}
              readOnly
              className={styles.exportTextarea}
              rows={10}
            />
            <div className={styles.modalActions}>
              <button 
                type='button' 
                onClick={() => setIsExportModalOpen(false)} 
                className={styles.cancelBtn}
              >
                Close
              </button>
              <button 
                type='button' 
                onClick={handleCopyExport}
                className={styles.submitBtn}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className={styles.modalOverlay} onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmHeader}>
              <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <h3>{confirmModal.title}</h3>
            </div>
            <p className={styles.confirmMessage}>{confirmModal.message}</p>
            <div className={styles.modalActions}>
              <button 
                type='button' 
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button 
                type='button' 
                onClick={confirmModal.onConfirm}
                className={styles.dangerBtn}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedView;