import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productAPI } from '../../../services/ProductService'; 
import styles from './AddProduct.module.css';

const AddProduct = ({ refreshProducts }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId'); // Check if we are in Edit Mode
  const isEditMode = !!editId;

  const fileInputRef = useRef(null);
  
  // State
  const [images, setImages] = useState([]);
  const [colorVariants, setColorVariants] = useState([
    { id: 1, name: 'Black', hex: '#1a1a1a', images: [] },
    { id: 2, name: 'White', hex: '#ffffff', images: [] }
  ]);
  const [activeColorId, setActiveColorId] = useState(1);
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL']);
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [error, setError] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    sku: '',
    category: 'T-Shirts',
    tags: '',
    inventory: '10',
    status: 'draft'
  });

  const categories = [
    'T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets', 
    'Pants', 'Accessories', 'Footwear', 'Other'
  ];

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  // --- LOAD DATA IF EDITING ---
  useEffect(() => {
    if (isEditMode) {
      loadProductForEdit();
    }
  }, [editId]);

  const loadProductForEdit = async () => {
    setIsLoadingData(true);
    try {
      const allProducts = await productAPI.getAllProducts();
      const productToEdit = allProducts.find(p => p.id === parseInt(editId));

      if (productToEdit) {
        // Populate Form Data
        setFormData({
          name: productToEdit.title || productToEdit.name || '',
          description: productToEdit.description || '',
          price: typeof productToEdit.price === 'string' ? productToEdit.price.replace('$', '') : productToEdit.price,
          comparePrice: '', 
          sku: productToEdit.sku || '',
          category: productToEdit.category || 'T-Shirts',
          tags: Array.isArray(productToEdit.tags) ? productToEdit.tags.join(', ') : (productToEdit.tags || ''),
          inventory: productToEdit.stock?.toString() || '0',
          status: productToEdit.status || 'draft'
        });

        // Populate Images (Mocking base64 from URL for editing context)
        if (productToEdit.img) {
          setImages([{
            id: Date.now(),
            preview: productToEdit.img,
            url: productToEdit.img
          }]);
        }

        // Populate Variants/Sizes if available
        if (productToEdit.variants && productToEdit.variants.length > 0) {
          setColorVariants(productToEdit.variants);
        }
        if (productToEdit.sizes && productToEdit.sizes.length > 0) {
          setSelectedSizes(productToEdit.sizes);
        }

        setActiveTab('details');
      } else {
        setError("Product not found.");
      }
    } catch (err) {
      console.error("Failed to load product for edit", err);
      setError("Failed to load product data.");
    } finally {
      setIsLoadingData(false);
    }
  };

  // --- HELPER: Convert File to Base64 ---
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle main image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        newImages.push({
          id: Date.now() + Math.random(),
          file, 
          preview: base64, 
          url: base64 
        });
      } catch (err) {
        console.error("Error converting image", err);
      }
    }

    setImages(prev => [...prev, ...newImages].slice(0, 10));
  };

  // Handle color variant image upload
  const handleColorImageUpload = async (e, colorId) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        newImages.push({ id: Date.now() + Math.random(), preview: base64, url: base64 });
      } catch (err) {
        console.error("Error converting image", err);
      }
    }
    
    setColorVariants(prev => prev.map(color => 
      color.id === colorId 
        ? { ...color, images: [...color.images, ...newImages].slice(0, 5) }
        : color
    ));
  };

  const removeImage = (imageId) => setImages(prev => prev.filter(img => img.id !== imageId));

  const removeColorImage = (colorId, imageId) => {
    setColorVariants(prev => prev.map(color => 
      color.id === colorId 
        ? { ...color, images: color.images.filter(img => img.id !== imageId) }
        : color
    ));
  };

  const addColorVariant = () => {
    const newId = Math.max(...colorVariants.map(c => c.id)) + 1;
    setColorVariants(prev => [...prev, { id: newId, name: 'New Color', hex: '#888888', images: [] }]);
    setActiveColorId(newId);
  };

  const updateColorVariant = (id, field, value) => {
    setColorVariants(prev => prev.map(color => color.id === id ? { ...color, [field]: value } : color));
  };

  const removeColorVariant = (id) => {
    if (colorVariants.length <= 1) return;
    setColorVariants(prev => prev.filter(color => color.id !== id));
    if (activeColorId === id) setActiveColorId(colorVariants[0].id);
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // --- VALIDATION LOGIC ---
  const validateForm = (isDraft) => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push("Product Name is required");
    if (!isDraft && !formData.price) errors.push("Price is required to publish");
    if (!isDraft && (!formData.inventory || parseInt(formData.inventory) < 0)) errors.push("Valid Stock quantity is required");
    if (!isDraft && images.length === 0) errors.push("At least one product image is required to publish");
    if (!formData.category) errors.push("Category is required");

    if (errors.length > 0) {
      setError(errors.join(". "));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (status = 'active') => {
    setIsSubmitting(true);
    setError(null);

    // 1. Validate
    // If it's a draft, we are lenient. If publishing, we are strict.
    const isValid = validateForm(status === 'draft');
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    // 2. Map Form Data
    const productPayload = {
      title: formData.name,
      description: formData.description,
      price: `$${parseFloat(formData.price || 0).toFixed(2)}`,
      category: formData.category,
      stock: parseInt(formData.inventory) || 0,
      totalCapacity: (parseInt(formData.inventory) || 0) + 50, 
      brandsBuilt: 0,
      status: status,
      sizes: selectedSizes,
      variants: colorVariants,
      img: images.length > 0 ? images[0].url : "https://via.placeholder.com/500",
      images: images.map(i => i.url),
      makerName: "Aura Studio",
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    try {
      if (isEditMode) {
        // UPDATE EXISTING
        await productAPI.updateProduct(parseInt(editId), productPayload);
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/studio/products'); // Go back to inventory list
        }, 1500);
      } else {
        // CREATE NEW
        await productAPI.addProduct(productPayload);
        setShowSuccess(true);
        
        // Reset form only if creating new
        setFormData({
          name: '', description: '', price: '', comparePrice: '', sku: '',
          category: 'T-Shirts', tags: '', inventory: '10', status: 'draft'
        });
        setImages([]);
        
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/studio/products');
        }, 1500);
      }

      if (refreshProducts) refreshProducts();

    } catch (err) {
      console.error("Failed to save product", err);
      setError("Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading Product Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showSuccess && (
        <div className={styles.successToast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {isEditMode ? 'Product Updated Successfully!' : 'Product Published Successfully!'}
        </div>
      )}

      {error && (
        <div className={styles.errorToast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`} onClick={() => setActiveTab('details')}>Details</button>
        <button className={`${styles.tab} ${activeTab === 'media' ? styles.active : ''}`} onClick={() => setActiveTab('media')}>Media</button>
        <button className={`${styles.tab} ${activeTab === 'variants' ? styles.active : ''}`} onClick={() => setActiveTab('variants')}>Variants</button>
      </div>

      <div className={styles.form}>
        <div className={styles.leftColumn}>
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Product Information</h3>
                <p className={styles.sectionDesc}>Basic details about your product</p>
              </div>

              <div className={styles.inputGroup}>
                <label>Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., 450GSM Heavyweight Tee" />
              </div>

              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe fabric weight, fit, and origin..." rows={4} />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>Price *</label>
                  <div className={styles.inputWithPrefix}>
                    <span className={styles.prefix}>$</span>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" step="0.01" />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Compare Price</label>
                  <div className={styles.inputWithPrefix}>
                    <span className={styles.prefix}>$</span>
                    <input type="number" name="comparePrice" value={formData.comparePrice} onChange={handleInputChange} placeholder="0.00" step="0.01" />
                  </div>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="e.g., TEE-001" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Tags</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Comma separated tags" />
              </div>

              <div className={styles.inputGroup}>
                <label>Inventory Stock *</label>
                <input type="number" name="inventory" value={formData.inventory} onChange={handleInputChange} placeholder="10" />
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Product Images</h3>
                <p className={styles.sectionDesc}>Add up to 10 images</p>
              </div>

              <div className={styles.imageUpload} onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple hidden />
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <p>Click to upload images</p>
              </div>

              {images.length > 0 && (
                <div className={styles.imageGrid}>
                  {images.map(img => (
                    <div key={img.id} className={styles.imagePreview}>
                      <img src={img.preview} alt="Product" />
                      <button className={styles.removeImage} onClick={() => removeImage(img.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Color Variants</h3>
                  <button className={styles.addBtn} onClick={addColorVariant}>Add Color</button>
                </div>
                <div className={styles.colorTabs}>
                  {colorVariants.map(color => (
                    <button key={color.id} className={`${styles.colorTab} ${activeColorId === color.id ? styles.active : ''}`} onClick={() => setActiveColorId(color.id)} style={{ '--color': color.hex }}>
                      <span className={styles.colorSwatch} style={{ background: color.hex }} />
                      <input type="text" value={color.name} onChange={(e) => updateColorVariant(color.id, 'name', e.target.value)} className={styles.colorName} onClick={(e) => e.stopPropagation()} />
                      {colorVariants.length > 1 && (<button className={styles.removeColor} onClick={(e) => { e.stopPropagation(); removeColorVariant(color.id); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>)}
                    </button>
                  ))}
                </div>
                {colorVariants.map(color => (
                  <div key={color.id} className={`${styles.colorSection} ${activeColorId === color.id ? styles.active : ''}`}>
                    <div className={styles.colorHeader}>
                      <input type="color" value={color.hex} onChange={(e) => updateColorVariant(color.id, 'hex', e.target.value)} className={styles.colorPicker} />
                      <span>{color.name}</span>
                    </div>
                    <div className={styles.colorImageUpload} onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.multiple = true; input.onchange = (e) => handleColorImageUpload(e, color.id); input.click(); }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span>Add images for {color.name}</span>
                    </div>
                    {color.images.length > 0 && (
                      <div className={styles.imageGrid}>
                        {color.images.map(img => (
                          <div key={img.id} className={styles.imagePreview}>
                            <img src={img.preview} alt={color.name} />
                            <button className={styles.removeImage} onClick={() => removeColorImage(color.id, img.id)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.section}>
                <div className={styles.sectionHeader}><h3 className={styles.sectionTitle}>Size Options</h3></div>
                <div className={styles.sizeGrid}>
                  {allSizes.map(size => (
                    <button key={size} className={`${styles.sizeBtn} ${selectedSizes.includes(size) ? styles.active : ''}`} onClick={() => toggleSize(size)}>{size}</button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Live Preview</h3>
            <div className={styles.previewCard}>
              {images.length > 0 ? (<img src={images[0].preview} alt="Preview" className={styles.previewImage} />) : (
                <div className={styles.previewPlaceholder}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
              )}
              <div className={styles.previewInfo}>
                <h4>{formData.name || 'Product Name'}</h4>
                <p className={styles.previewPrice}>${formData.price || '0'} {formData.comparePrice && <span className={styles.comparePrice}>${formData.comparePrice}</span>}</p>
                <div className={styles.previewMeta}><span>{formData.category || 'Category'}</span><span>•</span><span>{formData.inventory || 0} in stock</span></div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Visibility</h3>
            <div className={styles.statusOptions}>
              <label className={styles.statusOption}>
                <input type="radio" name="status" value="active" checked={formData.status === 'active'} onChange={handleInputChange} />
                <span className={styles.statusDot} style={{ background: 'var(--brut-success)' }} /> Active
              </label>
              <label className={styles.statusOption}>
                <input type="radio" name="status" value="draft" checked={formData.status === 'draft'} onChange={handleInputChange} />
                <span className={styles.statusDot} style={{ background: '#666' }} /> Draft
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.saveDraft} onClick={() => handleSubmit('draft')} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Draft Changes' : 'Save as Draft')}
            </button>
            <button className={styles.publish} onClick={() => handleSubmit('active')} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : (isEditMode ? 'Update Product' : 'Publish Product')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;