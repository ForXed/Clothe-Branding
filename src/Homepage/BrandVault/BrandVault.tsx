import React, { useState, useRef } from 'react';
import styles from './BrandVault.module.css';
import ForwardModal from './ForwardModal';

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

interface Design {
  id: number;
  name: string;
  thumbnail?: string;
  techPack?: TechPack;
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: Logo[];
  measurements: string;
  notes?: string;
  createdAt: string;
}

interface BrandVaultProps {
  showHeader?: boolean; // 👈 NEW: Control header visibility
}

const BrandVault: React.FC<BrandVaultProps> = ({ showHeader = false }) => {
  const [designs, setDesigns] = useState<Design[]>([
    {
      id: 1,
      name: 'Summer Hoodie Collection',
      thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      techPack: { name: 'hoodie-specs.pdf', url: '', size: '2.4 MB' },
      colors: [
        { id: 1, hex: '#000000', name: 'Matte Black' },
        { id: 2, hex: '#F5F5F5', name: 'Off White' }
      ],
      fonts: [
        { id: 1, family: 'Inter', weight: '700' }
      ],
      logos: [
        { id: 1, url: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=200', name: 'Primary Logo' }
      ],
      measurements: 'Size | Chest | Length\nM | 42cm | 67cm\nL | 45cm | 70cm',
      createdAt: '2026-01-15'
    },
    {
      id: 2,
      name: 'Techwear Cargo V2',
      thumbnail: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400',
      techPack: { name: 'cargo-v2.pdf', url: '', size: '3.1 MB' },
      colors: [
        { id: 1, hex: '#2A2A2A', name: 'Charcoal' },
        { id: 2, hex: '#4A5F3A', name: 'Olive' }
      ],
      fonts: [],
      logos: [],
      measurements: '',
      createdAt: '2026-01-20'
    }
  ]);

  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showForwardModal, setShowForwardModal] = useState<boolean>(false);
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Design>>({
    name: '',
    colors: [],
    fonts: [],
    logos: [],
    measurements: '',
    notes: ''
  });

  // Color picker state
  const [newColor, setNewColor] = useState<{ hex: string; name: string }>({ hex: '#000000', name: '' });
  
  // Font input state
  const [newFont, setNewFont] = useState<{ family: string; weight: string }>({ family: '', weight: '400' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNew = () => {
    setEditingDesign(null);
    setFormData({
      name: '',
      colors: [],
      fonts: [],
      logos: [],
      measurements: '',
      notes: ''
    });
    setNewColor({ hex: '#000000', name: '' });
    setNewFont({ family: '', weight: '400' });
    setShowCreateModal(true);
  };

  const handleEdit = (design: Design) => {
    setEditingDesign(design);
    setFormData(design);
    setNewColor({ hex: '#000000', name: '' });
    setNewFont({ family: '', weight: '400' });
    setShowCreateModal(true);
  };

  const handleSaveDesign = () => {
    if (!formData.name?.trim()) return;

    if (editingDesign) {
      setDesigns(prev => prev.map(d => 
        d.id === editingDesign.id 
          ? { ...d, ...formData, id: editingDesign.id, createdAt: editingDesign.createdAt }
          : d
      ));
    } else {
      const newDesign: Design = {
        id: Date.now(),
        name: formData.name || '',
        thumbnail: formData.thumbnail,
        techPack: formData.techPack,
        colors: formData.colors || [],
        fonts: formData.fonts || [],
        logos: formData.logos || [],
        measurements: formData.measurements || '',
        notes: formData.notes,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setDesigns(prev => [newDesign, ...prev]);
    }

    setShowCreateModal(false);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this design?')) {
      setDesigns(prev => prev.filter(d => d.id !== id));
      if (selectedDesign?.id === id) setSelectedDesign(null);
    }
  };

  const handleShare = (design: Design, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDesign(design);
    setShowForwardModal(true);
  };

  const handleForward = (chatId: number, chatName: string) => {
    if (!selectedDesign) return;
    console.log(`Forwarding design "${selectedDesign.name}" to chat ${chatId} (${chatName})`);
    setShowForwardModal(false);
    setSelectedDesign(null);
    alert(`Design shared with ${chatName}`);
  };

  // Color handlers
  const handleAddColor = () => {
    if (!newColor.name.trim()) return;
    const color: BrandColor = {
      id: Date.now(),
      hex: newColor.hex,
      name: newColor.name
    };
    setFormData(prev => ({
      ...prev,
      colors: [...(prev.colors || []), color]
    }));
    setNewColor({ hex: '#000000', name: '' });
  };

  const handleRemoveColor = (id: number) => {
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).filter(c => c.id !== id)
    }));
  };

  // Font handlers
  const handleAddFont = () => {
    if (!newFont.family.trim()) return;
    const font: BrandFont = {
      id: Date.now(),
      family: newFont.family,
      weight: newFont.weight
    };
    setFormData(prev => ({
      ...prev,
      fonts: [...(prev.fonts || []), font]
    }));
    setNewFont({ family: '', weight: '400' });
  };

  const handleRemoveFont = (id: number) => {
    setFormData(prev => ({
      ...prev,
      fonts: (prev.fonts || []).filter(f => f.id !== id)
    }));
  };

  return (
    <div className={styles.vaultContainer}>
      {/* 👇 Header only shows if showHeader prop is true */}
      {showHeader && (
        <div className={styles.vaultHeader}>
          <div>
            <h2 className={styles.title}>Brand Vault</h2>
            <p className={styles.subtitle}>Organize your designs and share them with makers instantly.</p>
          </div>
          <button className={styles.createBtn} type="button" onClick={handleCreateNew}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Design
          </button>
        </div>
      )}

      {/* Quick action bar when no header */}
      {!showHeader && (
        <div className={styles.quickActions}>
          <button className={styles.createBtn} type="button" onClick={handleCreateNew}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Design
          </button>
        </div>
      )}

      {/* Designs Grid */}
      <div className={styles.designsGrid}>
        {designs.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <h3>No designs yet</h3>
            <p>Create your first design to get started</p>
            <button className={styles.emptyCreateBtn} onClick={handleCreateNew}>
              Create Design
            </button>
          </div>
        ) : (
          designs.map(design => (
            <div 
              key={design.id} 
              className={styles.designCard}
              onClick={() => setSelectedDesign(design)}
            >
              <div className={styles.designThumbnail}>
                {design.thumbnail ? (
                  <img src={design.thumbnail} alt={design.name} />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                  </div>
                )}
                <div className={styles.designActions}>
                  <button 
                    type="button" 
                    className={styles.iconAction}
                    onClick={(e) => handleShare(design, e)}
                    title="Share with maker"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16 6 12 2 8 6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    className={styles.iconAction}
                    onClick={(e) => { handleEdit(design); e.stopPropagation(); }}
                    title="Edit design"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    className={styles.iconAction}
                    onClick={(e) => handleDelete(design.id, e)}
                    title="Delete design"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className={styles.designInfo}>
                <h3 className={styles.designName}>{design.name}</h3>
                <div className={styles.designMeta}>
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
                <div className={styles.designDate}>
                  {new Date(design.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Design Detail Modal */}
      {selectedDesign && !showForwardModal && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDesign(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className={styles.modalClose}
              onClick={() => setSelectedDesign(null)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalThumbnail}>
                {selectedDesign.thumbnail ? (
                  <img src={selectedDesign.thumbnail} alt={selectedDesign.name} />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className={styles.modalTitleArea}>
                <h2>{selectedDesign.name}</h2>
                <p>Created {new Date(selectedDesign.createdAt).toLocaleDateString()}</p>
                <div className={styles.modalActions}>
                  <button 
                    type="button" 
                    className={styles.primaryBtn}
                    onClick={() => setShowForwardModal(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16 6 12 2 8 6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    Share with Maker
                  </button>
                  <button 
                    type="button" 
                    className={styles.secondaryBtn}
                    onClick={() => { handleEdit(selectedDesign); setSelectedDesign(null); }}
                  >
                    Edit Design
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.modalContent}>
              {selectedDesign.techPack && (
                <div className={styles.detailSection}>
                  <h4>Tech Pack</h4>
                  <div className={styles.fileCard}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <div className={styles.fileInfo}>
                      <strong>{selectedDesign.techPack.name}</strong>
                      <span>{selectedDesign.techPack.size}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedDesign.colors.length > 0 && (
                <div className={styles.detailSection}>
                  <h4>Colors ({selectedDesign.colors.length})</h4>
                  <div className={styles.colorGrid}>
                    {selectedDesign.colors.map(color => (
                      <div key={color.id} className={styles.colorChip}>
                        <div className={styles.colorSwatch} style={{ background: color.hex }}></div>
                        <span>{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDesign.fonts.length > 0 && (
                <div className={styles.detailSection}>
                  <h4>Fonts ({selectedDesign.fonts.length})</h4>
                  <div className={styles.fontList}>
                    {selectedDesign.fonts.map(font => (
                      <div key={font.id} className={styles.fontItem}>
                        <strong>{font.family}</strong>
                        <span>{font.weight === '300' ? 'Light' : font.weight === '400' ? 'Regular' : font.weight === '600' ? 'SemiBold' : 'Bold'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDesign.logos.length > 0 && (
                <div className={styles.detailSection}>
                  <h4>Logos ({selectedDesign.logos.length})</h4>
                  <div className={styles.logoGrid}>
                    {selectedDesign.logos.map(logo => (
                      <div key={logo.id} className={styles.logoItem}>
                        <img src={logo.url} alt={logo.name} />
                        <span>{logo.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDesign.measurements && (
                <div className={styles.detailSection}>
                  <h4>Measurements</h4>
                  <pre className={styles.measurementsText}>{selectedDesign.measurements}</pre>
                </div>
              )}

              {selectedDesign.notes && (
                <div className={styles.detailSection}>
                  <h4>Notes</h4>
                  <p className={styles.notesText}>{selectedDesign.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Design Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className={styles.modalClose}
              onClick={() => setShowCreateModal(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div className={styles.createForm}>
              <h2>{editingDesign ? 'Edit Design' : 'Create New Design'}</h2>
              <p>Bundle all your design assets together</p>

              <div className={styles.formGroup}>
                <label>Design Name *</label>
                <input 
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Summer Hoodie Collection"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Thumbnail</label>
                <div 
                  className={styles.thumbnailUpload}
                  onClick={() => thumbnailInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={thumbnailInputRef} 
                    hidden 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData(prev => ({ ...prev, thumbnail: URL.createObjectURL(file) }));
                      }
                    }}
                  />
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Thumbnail" />
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span>Upload thumbnail</span>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Tech Pack (PDF)</label>
                <div 
                  className={styles.fileDropzone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData(prev => ({
                          ...prev,
                          techPack: {
                            name: file.name,
                            url: URL.createObjectURL(file),
                            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
                          }
                        }));
                      }
                    }}
                  />
                  {formData.techPack ? (
                    <div className={styles.fileCard}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <div className={styles.fileInfo}>
                        <strong>{formData.techPack.name}</strong>
                        <span>{formData.techPack.size}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>Upload Tech Pack</span>
                      <small>PDF, DOC, DOCX (Max 10MB)</small>
                    </>
                  )}
                </div>
              </div>

              {/* 👇 NEW: Colors Section */}
              <div className={styles.formGroup}>
                <label>Colors ({(formData.colors || []).length})</label>
                <div className={styles.colorAdder}>
                  <input 
                    type="color" 
                    value={newColor.hex}
                    onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                    className={styles.colorPickerInput}
                  />
                  <input 
                    type="text"
                    value={newColor.name}
                    onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Color name (e.g., Matte Black)"
                    className={styles.colorNameInput}
                  />
                  <button 
                    type="button" 
                    className={styles.addSmallBtn}
                    onClick={handleAddColor}
                    disabled={!newColor.name.trim()}
                  >
                    Add
                  </button>
                </div>
                {(formData.colors || []).length > 0 && (
                  <div className={styles.addedItemsList}>
                    {(formData.colors || []).map(color => (
                      <div key={color.id} className={styles.addedItem}>
                        <div className={styles.colorSwatch} style={{ background: color.hex }}></div>
                        <span>{color.name}</span>
                        <button 
                          type="button" 
                          className={styles.removeSmallBtn}
                          onClick={() => handleRemoveColor(color.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 👇 NEW: Fonts Section */}
              <div className={styles.formGroup}>
                <label>Fonts ({(formData.fonts || []).length})</label>
                <div className={styles.fontAdder}>
                  <input 
                    type="text"
                    value={newFont.family}
                    onChange={(e) => setNewFont(prev => ({ ...prev, family: e.target.value }))}
                    placeholder="Font family (e.g., Inter)"
                    className={styles.fontFamilyInput}
                  />
                  <select 
                    value={newFont.weight}
                    onChange={(e) => setNewFont(prev => ({ ...prev, weight: e.target.value }))}
                    className={styles.fontWeightSelect}
                  >
                    <option value="300">Light</option>
                    <option value="400">Regular</option>
                    <option value="600">SemiBold</option>
                    <option value="700">Bold</option>
                  </select>
                  <button 
                    type="button" 
                    className={styles.addSmallBtn}
                    onClick={handleAddFont}
                    disabled={!newFont.family.trim()}
                  >
                    Add
                  </button>
                </div>
                {(formData.fonts || []).length > 0 && (
                  <div className={styles.addedItemsList}>
                    {(formData.fonts || []).map(font => (
                      <div key={font.id} className={styles.addedItem}>
                        <span className={styles.fontFamily}>{font.family}</span>
                        <span className={styles.fontWeight}>
                          {font.weight === '300' ? 'Light' : font.weight === '400' ? 'Regular' : font.weight === '600' ? 'SemiBold' : 'Bold'}
                        </span>
                        <button 
                          type="button" 
                          className={styles.removeSmallBtn}
                          onClick={() => handleRemoveFont(font.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Measurements</label>
                <textarea 
                  rows={4}
                  value={formData.measurements || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, measurements: e.target.value }))}
                  placeholder="Size | Chest | Length&#10;M | 42cm | 67cm&#10;L | 45cm | 70cm"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea 
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this design..."
                />
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={styles.saveBtn}
                  onClick={handleSaveDesign}
                  disabled={!formData.name?.trim()}
                >
                  {editingDesign ? 'Update Design' : 'Create Design'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {showForwardModal && selectedDesign && (
        <ForwardModal
          design={selectedDesign}
          onClose={() => { setShowForwardModal(false); setSelectedDesign(null); }}
          onForward={handleForward}
        />
      )}
    </div>
  );
};

export default BrandVault;