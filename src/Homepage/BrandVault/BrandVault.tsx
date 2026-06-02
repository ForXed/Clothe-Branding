import React, { useState, useRef } from 'react';
import styles from './BrandVault.module.css';

const BrandVault = () => {
  const [activeTab, setActiveTab] = useState('logos');
  const [isUploading, setIsUploading] = useState(false);
  
  // Mock State for Brand Assets
  const [logos, setLogos] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=200', name: 'Primary Logo' },
    { id: 2, url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200', name: 'Icon Only' }
  ]);
  
  const [colors, setColors] = useState([
    { id: 1, hex: '#000000', name: 'Matte Black' },
    { id: 2, hex: '#F5F5F5', name: 'Off White' },
    { id: 3, hex: '#FF4444', name: 'Accent Red' }
  ]);

  const [fonts, setFonts] = useState([
    { id: 1, family: 'Inter', weight: '400', url: '' },
    { id: 2, family: 'Cormorant Garamond', weight: '600', url: '' }
  ]);

  const [specs, setSpecs] = useState({
    techPackUrl: '',
    measurements: ''
  });

  const fileInputRef = useRef(null);

  // Handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      // Mock upload delay
      setTimeout(() => {
        const newLogo = {
          id: Date.now(),
          url: URL.createObjectURL(file),
          name: file.name.split('.')[0]
        };
        setLogos([...logos, newLogo]);
        setIsUploading(false);
      }, 1000);
    }
  };

  const addColor = () => {
    const newColor = { id: Date.now(), hex: '#000000', name: 'New Color' };
    setColors([...colors, newColor]);
  };

  const updateColor = (id, field, value) => {
    setColors(colors.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deleteItem = (type, id) => {
    if (type === 'logos') setLogos(logos.filter(l => l.id !== id));
    if (type === 'colors') setColors(colors.filter(c => c.id !== id));
    if (type === 'fonts') setFonts(fonts.filter(f => f.id !== id));
  };

  return (
    <div className={styles.vaultContainer}>
      <div className={styles.vaultHeader}>
        <div>
          <h2 className={styles.title}>Brand Vault</h2>
          <p className={styles.subtitle}>Store your assets to quickly attach them to custom order requests.</p>
        </div>
        <button className={styles.saveBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {['logos', 'colors', 'fonts', 'specs'].map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        
        {/* LOGOS TAB */}
        {activeTab === 'logos' && (
          <div className={styles.gridSection}>
            <div className={styles.uploadCard} onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                accept="image/*" 
                onChange={handleLogoUpload} 
              />
              {isUploading ? (
                <div className={styles.spinner}></div>
              ) : (
                <>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Upload Logo</span>
                  <small>PNG, SVG, or AI (Max 5MB)</small>
                </>
              )}
            </div>
            
            {logos.map(logo => (
              <div key={logo.id} className={styles.assetCard}>
                <div className={styles.imagePreview}>
                  <img src={logo.url} alt={logo.name} />
                </div>
                <div className={styles.assetInfo}>
                  <strong>{logo.name}</strong>
                  <button className={styles.deleteBtn} onClick={() => deleteItem('logos', logo.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COLORS TAB */}
        {activeTab === 'colors' && (
          <div className={styles.listSection}>
            <button className={styles.addBtn} onClick={addColor}>+ Add Color Palette</button>
            {colors.map(color => (
              <div key={color.id} className={styles.colorRow}>
                <div className={styles.colorInputWrapper}>
                  <input 
                    type="color" 
                    value={color.hex} 
                    onChange={(e) => updateColor(color.id, 'hex', e.target.value)}
                    className={styles.colorPicker}
                  />
                  <input 
                    type="text" 
                    value={color.hex} 
                    onChange={(e) => updateColor(color.id, 'hex', e.target.value)}
                    className={styles.hexInput}
                  />
                </div>
                <input 
                  type="text" 
                  value={color.name} 
                  onChange={(e) => updateColor(color.id, 'name', e.target.value)}
                  placeholder="Color Name (e.g., Midnight Blue)"
                  className={styles.nameInput}
                />
                <button className={styles.deleteBtn} onClick={() => deleteItem('colors', color.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* FONTS TAB */}
        {activeTab === 'fonts' && (
          <div className={styles.listSection}>
             <button className={styles.addBtn} onClick={() => setFonts([...fonts, { id: Date.now(), family: '', weight: '400' }])}>+ Add Font</button>
             {fonts.map(font => (
              <div key={font.id} className={styles.fontRow}>
                <input 
                  type="text" 
                  value={font.family} 
                  onChange={(e) => setFonts(fonts.map(f => f.id === font.id ? { ...f, family: e.target.value } : f))}
                  placeholder="Font Family (e.g., Inter, Helvetica)"
                  className={styles.inputFull}
                />
                <select 
                  value={font.weight}
                  onChange={(e) => setFonts(fonts.map(f => f.id === font.id ? { ...f, weight: e.target.value } : f))}
                  className={styles.select}
                >
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="600">SemiBold</option>
                  <option value="700">Bold</option>
                </select>
                <button className={styles.deleteBtn} onClick={() => deleteItem('fonts', font.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
             ))}
          </div>
        )}

        {/* SPECS TAB */}
        {activeTab === 'specs' && (
          <div className={styles.specsSection}>
            <div className={styles.formGroup}>
              <label>Tech Pack / Specification Sheet</label>
              <div className={styles.fileDropzone}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p>Drag & drop your Tech Pack (PDF) here or click to browse</p>
                <small>Max 10MB</small>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Standard Measurements Chart</label>
              <textarea 
                rows="8" 
                placeholder="Paste your measurement chart details here...&#10;&#10;Size | Chest | Length | Sleeve&#10;S | 40cm | 65cm | 20cm&#10;M | 42cm | 67cm | 21cm"
                className={styles.textarea}
              ></textarea>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BrandVault;