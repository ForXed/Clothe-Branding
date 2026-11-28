import React, { useState } from 'react';
import styles from './VaultPicker.module.css';

// --- TypeScript Interfaces ---
interface Logo {
  id: number;
  url: string;
  name: string;
}

interface BrandColor {
  id: number;
  hex: string;
  name: string;
}

interface BrandFont {
  id: number;
  family: string;
  weight: string;
}

interface TechPack {
  name: string;
  url: string;
  size: string;
}

export interface Design {
  id: number;
  name: string;
  thumbnail?: string;
  techPack?: TechPack;
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: Logo[];
  measurements?: string;
  notes?: string;
}

interface VaultPickerProps {
  onClose: () => void;
  onSelect: (designs: Design[]) => void;
}

const VaultPicker: React.FC<VaultPickerProps> = ({ onClose, onSelect }) => {
  const [selectedDesigns, setSelectedDesigns] = useState<Design[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mock data - replace with real vault data from backend
  const designs: Design[] = [
    {
      id: 1,
      name: 'Summer Hoodie Collection',
      thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      techPack: { name: 'hoodie-specs.pdf', url: '#', size: '2.4 MB' },
      colors: [
        { id: 1, hex: '#000000', name: 'Matte Black' },
        { id: 2, hex: '#F5F5F5', name: 'Off White' }
      ],
      fonts: [{ id: 1, family: 'Inter', weight: '700' }],
      logos: [{ id: 1, url: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=200', name: 'Primary Logo' }],
      measurements: 'Size | Chest | Length\nM | 42cm | 67cm'
    },
    {
      id: 2,
      name: 'Techwear Cargo V2',
      thumbnail: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400',
      techPack: { name: 'cargo-v2.pdf', url: '#', size: '3.1 MB' },
      colors: [
        { id: 1, hex: '#2A2A2A', name: 'Charcoal' },
        { id: 2, hex: '#4A5F3A', name: 'Olive' }
      ],
      fonts: [],
      logos: []
    },
    {
      id: 3,
      name: 'Minimalist Tee',
      thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      techPack: { name: 'tee-specs.pdf', url: '#', size: '1.8 MB' },
      colors: [{ id: 1, hex: '#FFFFFF', name: 'Pure White' }],
      fonts: [{ id: 1, family: 'Helvetica', weight: '400' }],
      logos: [{ id: 1, url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200', name: 'Icon' }]
    }
  ];

  const filteredDesigns = designs.filter(design =>
    design.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDesign = (design: Design) => {
    setSelectedDesigns(prev => {
      const exists = prev.find(d => d.id === design.id);
      if (exists) {
        return prev.filter(d => d.id !== design.id);
      } else {
        return [...prev, design];
      }
    });
  };

  const handleSend = () => {
    if (selectedDesigns.length > 0) {
      onSelect(selectedDesigns);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Share from Brand Vault</h2>
            <p>Select designs to share with the maker</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className={styles.searchWrapper}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Design Grid */}
        <div className={styles.designGrid}>
          {filteredDesigns.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <p>No designs found</p>
            </div>
          ) : (
            filteredDesigns.map(design => {
              const isSelected = selectedDesigns.some(d => d.id === design.id);
              return (
                <div
                  key={design.id}
                  className={`${styles.designCard} ${isSelected ? styles.selected : ''}`}
                  onClick={() => toggleDesign(design)}
                >
                  {/* Selection Checkbox */}
                  <div className={styles.checkbox}>
                    {isSelected && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className={styles.thumbnail}>
                    {design.thumbnail ? (
                      <img src={design.thumbnail} alt={design.name} />
                    ) : (
                      <div className={styles.thumbnailPlaceholder}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className={styles.designInfo}>
                    <h4>{design.name}</h4>
                    <div className={styles.meta}>
                      {design.techPack && (
                        <span className={styles.metaItem} title="Tech Pack">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          PDF
                        </span>
                      )}
                      {design.colors.length > 0 && (
                        <span className={styles.metaItem} title={`${design.colors.length} colors`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="13.5" cy="6.5" r=".5"/>
                            <circle cx="17.5" cy="10.5" r=".5"/>
                            <circle cx="8.5" cy="7.5" r=".5"/>
                            <circle cx="6.5" cy="12.5" r=".5"/>
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                          </svg>
                          {design.colors.length}
                        </span>
                      )}
                      {design.fonts.length > 0 && (
                        <span className={styles.metaItem} title={`${design.fonts.length} fonts`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="4 7 4 4 20 4 20 7"/>
                            <line x1="9" y1="20" x2="15" y2="20"/>
                            <line x1="12" y1="4" x2="12" y2="20"/>
                          </svg>
                          {design.fonts.length}
                        </span>
                      )}
                      {design.logos.length > 0 && (
                        <span className={styles.metaItem} title={`${design.logos.length} logos`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          {design.logos.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.selectionInfo}>
            {selectedDesigns.length > 0 ? (
              <span>{selectedDesigns.length} design{selectedDesigns.length !== 1 ? 's' : ''} selected</span>
            ) : (
              <span>Select designs to share</span>
            )}
          </div>
          <div className={styles.footerActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={selectedDesigns.length === 0}
            >
              Share {selectedDesigns.length > 0 && `(${selectedDesigns.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultPicker;