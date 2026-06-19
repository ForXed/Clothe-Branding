import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SavedView.module.css';

// 👇 IMPORT TYPES FROM CONTEXT TO MATCH BrutigePlatform
import { Product, SavedItem } from '../BrutigeContext/BrutigeContext'; 

// 👇 UPDATED INTERFACE
interface SavedViewProps {
  savedItems: SavedItem[];
  collections: string[]; // Added
  onCreateCollection: (newName: string) => boolean; // Added
  onMoveItem: (itemId: string | number, targetCollection: string) => void; // Added
  onSelect: (item: Product) => void; // Updated
  toggleSaved: (item: Product) => void; // Updated
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void; // Updated
}

const SavedView: React.FC<SavedViewProps> = ({
  savedItems,
  collections, // Use prop instead of local state
  onCreateCollection, // Use prop
  onMoveItem, // Use prop
  onSelect,
  toggleSaved,
  addToCart,
}) => {
  const navigate = useNavigate();
  
  const [activeCollection, setActiveCollection] = useState<string>('All');
  // Removed local collections state

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [movingItemId, setMovingItemId] = useState<string | number | null>(null);

  // Filter Logic
  const filteredItems = activeCollection === 'All'
    ? savedItems
    : savedItems.filter((item) => (item.collection || 'Streetwear') === activeCollection);

  // --- ACTIONS ---
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Wishlist link copied to infrastructure clipboard.');
  };

  const moveAllToCart = () => {
    filteredItems.forEach((item) => addToCart(item, 1, 'M'));
    alert(`${filteredItems.length} items moved to branding loop.`);
  };

  const handleCreateCollectionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    setIsProcessing(true);
    try {
      // 👇 Call the prop function instead of local API
      const success = onCreateCollection(newCollectionName);
      if (success) {
        setActiveCollection(newCollectionName);
        setNewCollectionName('');
        setIsCreateModalOpen(false);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create collection');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMoveItem = (targetCollection: string) => {
    if (!movingItemId) return;

    setIsProcessing(true);
    try {
      // 👇 Call the prop function instead of local API
      onMoveItem(movingItemId, targetCollection);
      setMovingItemId(null); 
    } catch (error) {
      console.error('Failed to move item', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnsave = (item: SavedItem) => {
    if (!window.confirm('Remove this item from your archive?')) return;
    // 👇 Just call the prop function
    toggleSaved(item); 
  };

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
          <button type="button" className={styles.actionBtn} onClick={handleShare}>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13' />
            </svg>
            Share
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
            const itemCollection = item.collection || 'Streetwear';
            const isMovingThisItem = movingItemId === item.id;

            return (
              <div key={item.id} className={styles.card}>
                <div className={styles.imageContainer}>
                  <div className={styles.clickableImg} onClick={() => onSelect(item)}>
                    <img src={item.img} alt={item.title} />
                  </div>

                  <div className={styles.badges}>
                    {Number(item.id) % 2 === 0 && <span className={styles.stockAlert}>Only 2 Left</span>}
                    {Number(item.id) % 3 === 0 && <span className={styles.priceDrop}>Price Dropped</span>}
                  </div>

                  <button type="button" className={styles.unsaveBtn} onClick={(e) => { e.stopPropagation(); handleUnsave(item); }}>
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
                      <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
                    </svg>
                  </button>

                  <button 
                    type="button"
                    className={styles.moveBtn}
                    onClick={(e) => { e.stopPropagation(); setMovingItemId(isMovingThisItem ? null : item.id); }}
                    title='Move to collection'
                  >
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' />
                    </svg>
                  </button>

                  <button type="button" className={styles.quickCartBtn} onClick={(e) => { e.stopPropagation(); addToCart(item, 1, 'M'); }}>
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
                    <span className={styles.timestamp}>Added recently</span>
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
              />
              <div className={styles.modalActions}>
                <button type='button' onClick={() => setIsCreateModalOpen(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type='submit' disabled={isProcessing || !newCollectionName.trim()} className={styles.submitBtn}>
                  {isProcessing ? 'Creating...' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedView;