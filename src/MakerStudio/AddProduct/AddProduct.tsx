import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productAPI } from '../../services/ProductService';
import CustomSelect from '../../Checkout/shared/CustomSelect';
import styles from './AddProduct.module.css';

interface ImageItem {
  id: number;
  preview: string;
  url: string;
  file?: File;
}

interface ColorVariant {
  id: number;
  name: string;
  hex: string;
  images: ImageItem[];
}

interface SizeOption {
  us: string;
  uk: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  comparePrice: string;
  sku: string;
  category: string;
  tags: string;
  inventory: string;
  status: string;
}

interface AddProductProps {
  refreshProducts?: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ refreshProducts }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');
  const isEditMode = !!editId;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([
    { id: 1, name: 'Black', hex: '#1a1a1a', images: [] },
    { id: 2, name: 'White', hex: '#ffffff', images: [] }
  ]);
  const [activeColorId, setActiveColorId] = useState<number>(1);
  
  const [sizeSystem, setSizeSystem] = useState<'US' | 'UK'>('US');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L']);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'variants'>('details');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '', description: '', price: '', comparePrice: '', sku: '',
    category: 'Tops', tags: '', inventory: '10', status: 'draft'
  });

  const categories = [
    { value: 'Tops', label: 'Tops' },
    { value: 'Bottoms', label: 'Bottoms' },
    { value: 'Outerwear', label: 'Outerwear' },
    { value: 'Accessories', label: 'Accessories' },
    { value: 'Footwear', label: 'Footwear' }
  ];
  
  const sizeOptions: SizeOption[] = [
    { us: 'XS', uk: 'XXS' },
    { us: 'S', uk: 'XS' },
    { us: 'M', uk: 'S' },
    { us: 'L', uk: 'M' },
    { us: 'XL', uk: 'L' },
    { us: 'XXL', uk: 'XL' },
    { us: '3XL', uk: 'XXL' }
  ];

  const ukToUs = (ukSize: string): string => {
    const mapping = sizeOptions.find(s => s.uk === ukSize);
    return mapping ? mapping.us : ukSize;
  };

  const usToUk = (usSize: string): string => {
    const mapping = sizeOptions.find(s => s.us === usSize);
    return mapping ? mapping.uk : usSize;
  };

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    if (isEditMode) loadProductForEdit();
  }, [editId]);

  const loadProductForEdit = async () => {
    setIsLoadingData(true);
    try {
      const allProducts = await productAPI.getAllProducts();
      const productId = parseInt(editId!, 10);
      const productToEdit = allProducts.find(p => p.id === productId);

      if (productToEdit) {
        const numericPrice = productToEdit.price.replace(/[₦,\s]/g, '');
        
        setFormData({
          name: productToEdit.title,
          description: productToEdit.description || '',
          price: numericPrice,
          comparePrice: '', 
          sku: productToEdit.sku || '',
          category: productToEdit.category || 'Tops',
          tags: productToEdit.tags?.join(', ') || '',
          inventory: productToEdit.stock?.toString() || '0',
          status: productToEdit.status || 'draft'
        });

        if (productToEdit.images && productToEdit.images.length > 0) {
          const mainImages: ImageItem[] = productToEdit.images.map((img, idx) => ({
            id: Date.now() + idx,
            preview: img,
            url: img
          }));
          setImages(mainImages);
          setCurrentImageIndex(0);
        } else if (productToEdit.img) {
          setImages([{ 
            id: Date.now(), 
            preview: productToEdit.img, 
            url: productToEdit.img 
          }]);
          setCurrentImageIndex(0);
        }

        if (productToEdit.variants && productToEdit.variants.length > 0) {
          setColorVariants(productToEdit.variants);
        }
        
        if (productToEdit.sizes && productToEdit.sizes.length > 0) {
          const usSizes = productToEdit.sizes.map(size => ukToUs(size));
          setSelectedSizes(usSizes);
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImages: ImageItem[] = [];

    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        newImages.push({ id: Date.now() + Math.random(), file, preview: base64, url: base64 });
      } catch (err) { console.error("Error converting image", err); }
    }
    
    const updatedImages = [...images, ...newImages].slice(0, 10);
    setImages(updatedImages);
    
    if (images.length === 0 && updatedImages.length > 0) {
      setCurrentImageIndex(0);
    }
  };

  // ✅ FIXED: Accept FileList directly instead of React event
  const handleColorImageUpload = async (files: FileList, colorId: number) => {
    const fileArray = Array.from(files);
    const newImages: ImageItem[] = [];

    for (const file of fileArray) {
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

  const removeImage = (imageId: number) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      if (currentImageIndex >= filtered.length) {
        setCurrentImageIndex(Math.max(0, filtered.length - 1));
      }
      return filtered;
    });
  };

  const removeColorImage = (colorId: number, imageId: number) => {
    setColorVariants(prev => prev.map(color => 
      color.id === colorId ? { ...color, images: color.images.filter(img => img.id !== imageId) } : color
    ));
  };

  const addColorVariant = () => {
    const newId = Math.max(...colorVariants.map(c => c.id)) + 1;
    setColorVariants(prev => [...prev, { id: newId, name: 'New Color', hex: '#888888', images: [] }]);
    setActiveColorId(newId);
  };

  const updateColorVariant = (id: number, field: keyof ColorVariant, value: any) => {
    setColorVariants(prev => prev.map(color => color.id === id ? { ...color, [field]: value } : color));
  };

  const removeColorVariant = (id: number) => {
    if (colorVariants.length <= 1) return;
    setColorVariants(prev => prev.filter(color => color.id !== id));
    if (activeColorId === id) setActiveColorId(colorVariants[0].id);
  };

  const toggleSize = (size: SizeOption) => {
    const usSize = size.us;
    setSelectedSizes(prev => 
      prev.includes(usSize) 
        ? prev.filter(s => s !== usSize) 
        : [...prev, usSize]
    );
  };

  const isSizeSelected = (size: SizeOption): boolean => {
    return selectedSizes.includes(size.us);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = (isDraft: boolean) => {
    const errors: string[] = [];
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
    const isValid = validateForm(status === 'draft');
    if (!isValid) { 
      setIsSubmitting(false); 
      return; 
    }

    const formattedPrice = `₦${parseFloat(formData.price || '0').toLocaleString('en-NG')}`;
    
    const productPayload = {
      title: formData.name, 
      description: formData.description,
      price: formattedPrice,
      category: formData.category, 
      stock: parseInt(formData.inventory) || 0,
      totalCapacity: (parseInt(formData.inventory) || 0) + 50, 
      status: status as 'active' | 'draft',
      sizes: selectedSizes,
      variants: colorVariants,
      img: images.length > 0 ? images[0].url : "https://via.placeholder.com/500",
      images: images.map(i => i.url), 
      makerName: "Aura Studio",
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      sku: formData.sku
    };

    try {
      if (isEditMode && editId) {
        const productId = parseInt(editId, 10);
        await productAPI.updateProduct(productId, productPayload);
        setShowSuccess(true);
        setTimeout(() => navigate('/studio/products'), 1500);
      } else {
        await productAPI.addProduct(productPayload);
        setShowSuccess(true);
        setFormData({ 
          name: '', description: '', price: '', comparePrice: '', sku: '', 
          category: 'Tops', tags: '', inventory: '10', status: 'draft' 
        });
        setImages([]);
        setCurrentImageIndex(0);
        setSelectedSizes(['M', 'L']);
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
      {/* ✅ FIXED: Success toast with close button */}
      {showSuccess && (
        <div className={styles.successToast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>{isEditMode ? 'Product Updated Successfully!' : 'Product Published Successfully!'}</span>
          <button 
            type="button" 
            className={styles.toastClose}
            onClick={() => setShowSuccess(false)}
            aria-label="Close notification"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
      
      {/* ✅ FIXED: Error toast with close button */}
      {error && (
        <div className={styles.errorToast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
          <button 
            type="button" 
            className={styles.toastClose}
            onClick={() => setError(null)}
            aria-label="Close notification"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      <div className={styles.tabs}>
        <button type="button" className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`} onClick={() => setActiveTab('details')}>Details</button>
        <button type="button" className={`${styles.tab} ${activeTab === 'media' ? styles.active : ''}`} onClick={() => setActiveTab('media')}>Media</button>
        <button type="button" className={`${styles.tab} ${activeTab === 'variants' ? styles.active : ''}`} onClick={() => setActiveTab('variants')}>Variants</button>
      </div>

      <div className={styles.form}>
        <div className={styles.leftColumn}>
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
                    <span className={styles.prefix}>₦</span>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" step="0.01" />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Compare Price</label>
                  <div className={styles.inputWithPrefix}>
                    <span className={styles.prefix}>₦</span>
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
                  <label>Category *</label>
                  <CustomSelect
                    options={categories}
                    value={formData.category}
                    onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    placeholder="Select category"
                  />
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

          {activeTab === 'media' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Product Images</h3>
                <p className={styles.sectionDesc}>Add up to 10 images</p>
              </div>
              
              <div className={styles.imageUpload} onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple hidden />
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p>Click to upload images</p>
              </div>

              {images.length > 0 && (
                <div className={styles.carouselContainer}>
                  <div 
                    className={styles.carousel}
                    ref={carouselRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <img 
                      src={images[currentImageIndex].preview} 
                      alt={`Product image ${currentImageIndex + 1}`}
                      className={styles.carouselImage}
                    />
                    
                    <button 
                      type="button" 
                      className={styles.carouselRemoveBtn}
                      onClick={() => removeImage(images[currentImageIndex].id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>

                    {images.length > 1 && (
                      <>
                        <button 
                          type="button" 
                          className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                          onClick={goToPreviousImage}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6"/>
                          </svg>
                        </button>
                        <button 
                          type="button" 
                          className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                          onClick={goToNextImage}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className={styles.carouselDots}>
                      {images.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`${styles.carouselDot} ${index === currentImageIndex ? styles.active : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  <div className={styles.carouselCounter}>
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'variants' && (
            <>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Color Variants</h3>
                  <button type="button" className={styles.addBtn} onClick={addColorVariant}>Add Color</button>
                </div>
                <div className={styles.colorTabs}>
                  {colorVariants.map(color => (
                    <button 
                      key={color.id} 
                      type="button" 
                      className={`${styles.colorTab} ${activeColorId === color.id ? styles.active : ''}`} 
                      onClick={() => setActiveColorId(color.id)} 
                      style={{ '--color': color.hex } as React.CSSProperties}
                    >
                      <span className={styles.colorSwatch} style={{ background: color.hex }} />
                      <input 
                        type="text" 
                        value={color.name} 
                        onChange={(e) => updateColorVariant(color.id, 'name', e.target.value)} 
                        className={styles.colorName} 
                        onClick={(e) => e.stopPropagation()} 
                      />
                      {colorVariants.length > 1 && (
                        <button 
                          type="button" 
                          className={styles.removeColor} 
                          onClick={(e) => { e.stopPropagation(); removeColorVariant(color.id); }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      )}
                    </button>
                  ))}
                </div>
                {colorVariants.map(color => (
                  <div key={color.id} className={`${styles.colorSection} ${activeColorId === color.id ? styles.active : ''}`}>
                    <div className={styles.colorHeader}>
                      <input 
                        type="color" 
                        value={color.hex} 
                        onChange={(e) => updateColorVariant(color.id, 'hex', e.target.value)} 
                        className={styles.colorPicker} 
                      />
                      <span>{color.name}</span>
                    </div>
                    <div 
                      className={styles.colorImageUpload} 
                      onClick={() => { 
                        const input = document.createElement('input'); 
                        input.type = 'file'; 
                        input.accept = 'image/*'; 
                        input.multiple = true; 
                        // ✅ FIXED: Properly handle native event and pass FileList
                        input.onchange = (e: Event) => {
                          const target = e.target as HTMLInputElement;
                          if (target.files && target.files.length > 0) {
                            handleColorImageUpload(target.files, color.id);
                          }
                        };
                        input.click(); 
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span>Add images for {color.name}</span>
                    </div>
                    {color.images.length > 0 && (
                      <div className={styles.imageGrid}>
                        {color.images.map(img => (
                          <div key={img.id} className={styles.imagePreview}>
                            <img src={img.preview} alt={color.name} />
                            <button 
                              type="button" 
                              className={styles.removeImage} 
                              onClick={() => removeColorImage(color.id, img.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Size Options</h3>
                  <div className={styles.sizeSystemToggle}>
                    <button 
                      type="button" 
                      className={`${styles.toggleBtn} ${sizeSystem === 'US' ? styles.activeToggle : ''}`} 
                      onClick={() => setSizeSystem('US')}
                    >
                      US
                    </button>
                    <button 
                      type="button" 
                      className={`${styles.toggleBtn} ${sizeSystem === 'UK' ? styles.activeToggle : ''}`} 
                      onClick={() => setSizeSystem('UK')}
                    >
                      UK
                    </button>
                  </div>
                </div>
                <p className={styles.sectionDesc}>
                  Select available sizes (showing {sizeSystem} sizing)
                </p>
                <div className={styles.sizeGrid}>
                  {sizeOptions.map((size, idx) => (
                    <button 
                      key={idx} 
                      type="button" 
                      className={`${styles.sizeBtn} ${isSizeSelected(size) ? styles.active : ''}`} 
                      onClick={() => toggleSize(size)}
                    >
                      {sizeSystem === 'US' ? size.us : size.uk}
                      <span className={styles.sizeEquivalent}>
                        {sizeSystem === 'US' ? size.uk : size.us}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedSizes.length > 0 && (
                  <p className={styles.selectedSizesInfo}>
                    Selected ({selectedSizes.length}): {selectedSizes.map(s => sizeSystem === 'US' ? s : usToUk(s)).join(', ')}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Live Preview</h3>
            <div className={styles.previewCard}>
              {images.length > 0 ? (
                <img src={images[currentImageIndex].preview} alt="Preview" className={styles.previewImage} />
              ) : (
                <div className={styles.previewPlaceholder}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
              <div className={styles.previewInfo}>
                <h4>{formData.name || 'Product Name'}</h4>
                <p className={styles.previewPrice}>
                  ₦{formData.price ? parseFloat(formData.price).toLocaleString('en-NG') : '0'}
                  {formData.comparePrice && (
                    <span className={styles.comparePrice}>
                      ₦{parseFloat(formData.comparePrice).toLocaleString('en-NG')}
                    </span>
                  )}
                </p>
                <div className={styles.previewMeta}>
                  <span>{formData.category || 'Category'}</span>
                  <span>•</span>
                  <span>{formData.inventory || 0} in stock</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Visibility</h3>
            <div className={styles.statusOptions}>
              <label className={styles.statusOption}>
                <input type="radio" name="status" value="active" checked={formData.status === 'active'} onChange={handleInputChange} />
                <span className={styles.statusDot} style={{ background: 'var(--brut-success)' }} /> 
                Active
              </label>
              <label className={styles.statusOption}>
                <input type="radio" name="status" value="draft" checked={formData.status === 'draft'} onChange={handleInputChange} />
                <span className={styles.statusDot} style={{ background: '#666' }} /> 
                Draft
              </label>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button 
              type="button" 
              className={styles.saveDraft} 
              onClick={() => handleSubmit('draft')} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Draft Changes' : 'Save as Draft')}
            </button>
            <button 
              type="button" 
              className={styles.publish} 
              onClick={() => handleSubmit('active')} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : (isEditMode ? 'Update Product' : 'Publish Product')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;