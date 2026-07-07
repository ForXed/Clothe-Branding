import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductDetail.module.css';
import { productAPI } from '../../services/ProductService';
import { Product, ColorVariant, ColorVariantImage } from '../BrutigeContext/BrutigeContext';

interface Maker {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  rating: number;
  sales: number;
  productionDays: number;
  shippingDays: number;
}

interface SizeOption {
  us: string;
  uk: string;
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  isSaved: boolean;
  toggleSaved: () => void;
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  addToCart, 
  isSaved, 
  toggleSaved,
  notify 
}) => {
  const navigate = useNavigate();
  
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(2);
  const [sizeSystem, setSizeSystem] = useState<'US' | 'UK'>('US');
  const [selectedColor, setSelectedColor] = useState<string>('Matte Black');
  const [activeImg, setActiveImg] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [showZoomModal, setShowZoomModal] = useState<boolean>(false);
  const [zoomImageIndex, setZoomImageIndex] = useState<number>(0);
  
  const [deadline, setDeadline] = useState<string>('');
  const [requestNotes, setRequestNotes] = useState<string>('');
  
  const [maker] = useState<Maker>({
    id: 'lagos-atelier',
    name: 'Lagos Atelier',
    handle: '@lagos_atelier',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    location: 'Lagos, NG',
    rating: 4.8,
    sales: 124,
    productionDays: 5,
    shippingDays: 3
  });

  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);

  const sizes: SizeOption[] = [
    { us: 'XS', uk: 'XXS' }, { us: 'S', uk: 'XS' }, { us: 'M', uk: 'S' },
    { us: 'L', uk: 'M' }, { us: 'XL', uk: 'L' }, { us: 'XXL', uk: 'XL' }
  ];

  // ✅ Calculate stock percentage
  const stock = Number(product.stock) || 0;
  const capacity = Number(product.totalCapacity) || 1;
  const stockPercentage = Math.min((stock / capacity) * 100, 100);

  // ✅ Load color variants from product data
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const variants: ColorVariant[] = product.variants.map((v: ColorVariant) => ({
        id: v.id,
        name: v.name,
        hex: v.hex,
        images: v.images || []
      }));
      
      setColorVariants(variants);
      
      if (variants.length > 0) {
        setSelectedColor(variants[0].name);
      }
    } else {
      const defaultVariants: ColorVariant[] = [
        { id: 1, name: 'Matte Black', hex: '#000000', images: [] },
        { id: 2, name: 'Lunar Grey', hex: '#2A2A2A', images: [] },
        { id: 3, name: 'Paper Bone', hex: '#e1decc', images: [] }
      ];
      setColorVariants(defaultVariants);
      setSelectedColor('Matte Black');
    }
  }, [product.variants]);

  // ✅ Get images for selected color
  const getCurrentImages = (): string[] => {
    const selectedVariant = colorVariants.find(v => v.name === selectedColor);
    
    if (selectedVariant && selectedVariant.images.length > 0) {
      return selectedVariant.images.map((img: ColorVariantImage) => {
        return img.url || img.preview || '';
      }).filter(url => url !== '');
    }
    
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    
    return [product.img];
  };

  const currentImages = getCurrentImages();

  // ✅ Reset active image when color changes
  useEffect(() => {
    setActiveImg(0);
  }, [selectedColor]);

  // ✅ Load other products
  useEffect(() => {
    const loadOtherProducts = async () => {
      try {
        const allProducts = await productAPI.getAllProducts();
        const similar = allProducts
          .filter(p => p.id !== product.id && p.category === product.category)
          .slice(0, 4);
        setOtherProducts(similar);
      } catch (error) {
        console.error('Failed to load similar products:', error);
      }
    };
    
    loadOtherProducts();
  }, [product.id, product.category]);

  const handleAddToCart = () => {
    const currentSize = sizeSystem === 'US' ? sizes[selectedSizeIndex].us : sizes[selectedSizeIndex].uk;
    addToCart(product, quantity, currentSize, selectedColor);
    setAddedToCart(true);
    if (notify) notify('Added to cart!', 'success');
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleRequestOrder = () => {
    if (!deadline.trim()) {
      if (notify) notify('Please specify a deadline', 'error');
      return;
    }

    const customRequestMessage = `Hi ${maker.name}! 👋

I'd like to request a custom order for "${product.title}".

📅 Deadline: ${new Date(deadline).toLocaleDateString('en-NG', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

📝 Requirements:
${requestNotes || 'No additional notes provided.'}

Looking forward to your quote!`;

    navigate('/platform/chat', { 
      state: { 
        makerId: maker.id,
        makerName: maker.name,
        prefillMessage: customRequestMessage
      } 
    });

    if (notify) notify('Opening chat with maker...', 'success');
    setShowRequestModal(false);
    setDeadline('');
    setRequestNotes('');
  };

  const calculateDelivery = (): string => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + maker.productionDays + maker.shippingDays);
    return delivery.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
  };

  const handleViewProfile = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    navigate(`/platform/profile/${maker.id}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://via.placeholder.com/600x750?text=No+Image";
  };

  const openZoom = (index: number) => {
    setZoomImageIndex(index);
    setShowZoomModal(true);
  };

  const zoomNext = () => {
    setZoomImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const zoomPrev = () => {
    setZoomImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  // ✅ Keyboard navigation for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showZoomModal) return;
      
      if (e.key === 'Escape') {
        setShowZoomModal(false);
      } else if (e.key === 'ArrowRight') {
        zoomNext();
      } else if (e.key === 'ArrowLeft') {
        zoomPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showZoomModal, currentImages.length]);

  return (
    <div className={styles.container}>
      <button type="button" onClick={onBack} className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Catalog
      </button>

      <div className={styles.productLayout}>
        <div className={styles.imageSection}>
          <div 
            className={styles.mainImage}
            onClick={() => openZoom(activeImg)}
          >
            <img 
              src={currentImages[activeImg]} 
              alt={product.title} 
              onError={handleImageError}
            />
            <div className={styles.zoomHint}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
              Click to zoom
            </div>
          </div>
          
          {currentImages.length > 1 && (
            <div className={styles.thumbnailGrid}>
              {currentImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.thumb} ${activeImg === idx ? styles.activeThumb : ''}`} 
                  onClick={() => setActiveImg(idx)}
                >
                  <img src={img} alt={`${product.title} view ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.productHeader}>
            <div>
              <span className={styles.categoryTag}>{product.category || 'NEW'}</span>
              <h1 className={styles.productTitle}>{product.title}</h1>
            </div>
            <button 
              type="button" 
              className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`} 
              onClick={toggleSaved}
              aria-label={isSaved ? "Remove from saved" : "Save item"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          <p className={styles.productPrice}>{product.price}</p>

          <div className={styles.makerSection} onClick={handleViewProfile}>
            <div className={styles.makerInfo}>
              <img src={maker.avatar} alt={maker.name} className={styles.makerAvatar} />
              <div className={styles.makerMeta}>
                <div className={styles.makerNameRow}>
                  <strong>{maker.name}</strong>
                  <span className={styles.verifiedBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </span>
                </div>
                <span className={styles.makerHandle}>{maker.handle}</span>
                <div className={styles.makerStats}>
                  <span>★ {maker.rating}</span>
                  <span>•</span>
                  <span>{maker.sales} sales</span>
                  <span>•</span>
                  <span>{maker.location}</span>
                </div>
              </div>
            </div>
            <div className={styles.viewProfileBtn}>View Profile →</div>
          </div>

          <div className={styles.timelineSection}>
            <div className={styles.timelineHeader}>
              <h4>Production & Delivery</h4>
              <span className={styles.deliveryDate}>Est. Delivery: {calculateDelivery()}</span>
            </div>
            <div className={styles.timelineBar}>
              <div className={styles.timelineStep}>
                <div className={styles.stepDot}></div>
                <span>Order Placed</span>
              </div>
              <div className={styles.timelineLine}></div>
              <div className={styles.timelineStep}>
                <div className={styles.stepDot}></div>
                <span>Production ({maker.productionDays} days)</span>
              </div>
              <div className={styles.timelineLine}></div>
              <div className={styles.timelineStep}>
                <div className={styles.stepDot}></div>
                <span>Shipping ({maker.shippingDays} days)</span>
              </div>
            </div>
          </div>

          <div className={styles.selectorSection}>
            <h4 className={styles.selectorTitle}>Color: <span>{selectedColor}</span></h4>
            <div className={styles.colorGrid}>
              {colorVariants.map((variant) => (
                <button 
                  key={variant.id} 
                  className={`${styles.colorCircle} ${selectedColor === variant.name ? styles.activeColor : ''}`} 
                  style={{ backgroundColor: variant.hex }} 
                  onClick={() => setSelectedColor(variant.name)} 
                  title={variant.name} 
                  type="button" 
                  aria-label={`Select ${variant.name} color`}
                />
              ))}
            </div>
          </div>

          {/* ✅ DYNAMIC STOCK SECTION */}
          <div className={styles.stockSection}>
            <div className={styles.stockHeader}>
              <h4>Availability</h4>
              <span className={styles.stockCount}>
                {stock} pieces in stock
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${stockPercentage}%`,
                  backgroundColor: stock < 10 ? '#ff4444' : stock < 20 ? '#ffa500' : 'var(--brut-text)'
                }}
              />
            </div>
            {product.brandsBuilt && product.brandsBuilt > 0 && (
              <div className={styles.socialProof}>
                <strong>{product.brandsBuilt}</strong> brands built with this template
              </div>
            )}
          </div>

          {/* ✅ DYNAMIC PRODUCT SPECS */}
          <div className={styles.productSpecs}>
            {product.composition && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Composition</span>
                <strong>{product.composition}</strong>
              </div>
            )}
            {product.weight && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Weight</span>
                <strong>{product.weight}</strong>
              </div>
            )}
            {product.origin && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Origin</span>
                <strong>{product.origin}</strong>
              </div>
            )}
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Turnaround</span>
              <strong>{maker.productionDays} Working Days</strong>
            </div>
          </div>

          <div className={styles.sizeSection}>
            <div className={styles.sizeHeader}>
              <h4>Select Size</h4>
              <div className={styles.sizeHeaderRight}>
                <div className={styles.sizeSystemToggle}>
                  <button 
                    type="button" 
                    className={sizeSystem === 'US' ? styles.activeToggle : ''} 
                    onClick={() => setSizeSystem('US')}
                  >
                    US
                  </button>
                  <button 
                    type="button" 
                    className={sizeSystem === 'UK' ? styles.activeToggle : ''} 
                    onClick={() => setSizeSystem('UK')}
                  >
                    UK
                  </button>
                </div>
                <button 
                  type="button" 
                  className={styles.sizeGuideBtn} 
                  onClick={() => setShowSizeGuide(true)}
                >
                  Size Guide
                </button>
              </div>
            </div>
            <div className={styles.sizeGrid}>
              {sizes.map((size, idx) => (
                <button 
                  key={size.us} 
                  type="button" 
                  className={`${styles.sizeBtn} ${selectedSizeIndex === idx ? styles.selectedSize : ''}`} 
                  onClick={() => setSelectedSizeIndex(idx)}
                  aria-label={`Size ${sizeSystem === 'US' ? size.us : size.uk}`}
                >
                  {sizeSystem === 'US' ? size.us : size.uk}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.utilityRow}>
            <div className={styles.quantitySection}>
              <div className={styles.quantityControl}>
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button>
              </div>
            </div>
            <button 
              type="button" 
              className={styles.messageBtn} 
              onClick={() => navigate('/platform/chat', { state: { makerId: maker.id, makerName: maker.name } })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
              </svg>
              Message Maker
            </button>
          </div>

          <div className={styles.actions}>
            <button 
              type="button" 
              className={`${styles.addToCartBtn} ${addedToCart ? styles.added : ''}`} 
              onClick={handleAddToCart}
            >
              {addedToCart ? "Added to Loop" : "Add to Cart"}
            </button>
            <button 
              type="button" 
              className={styles.requestBtn} 
              onClick={() => setShowRequestModal(true)}
            >
              Request Custom Order
            </button>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <div>
                <strong>Infrastructure Shipping</strong>
                <p>Nationwide delivery included</p>
              </div>
            </div>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <strong>Verified Maker</strong>
                <p>Quality checked by Brutige Studio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {otherProducts.length > 0 && (
        <div className={styles.otherProductsSection}>
          <div className={styles.sectionHeader}>
            <h3>Similar Products</h3>
            <button 
              type="button" 
              className={styles.viewAllBtn} 
              onClick={() => navigate('/platform/shop')}
            >
              View All →
            </button>
          </div>
          <div className={styles.otherProductsGrid}>
            {otherProducts.map(item => (
              <div 
                key={item.id} 
                className={styles.otherProductCard}
                onClick={() => {
                  window.location.href = `/platform/product/${item.id}`;
                }}
              >
                <div className={styles.otherProductImage}>
                  <img src={item.img} alt={item.title} onError={handleImageError} />
                </div>
                <div className={styles.otherProductInfo}>
                  <h4>{item.title}</h4>
                  <span>{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ZOOM MODAL */}
      {showZoomModal && (
        <div 
          className={styles.zoomOverlay}
          onClick={() => setShowZoomModal(false)}
        >
          <div className={styles.zoomContent} onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              className={styles.zoomClose}
              onClick={() => setShowZoomModal(false)}
              aria-label="Close zoom"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {currentImages.length > 1 && (
              <>
                <button 
                  type="button"
                  className={styles.zoomArrowLeft}
                  onClick={zoomPrev}
                  aria-label="Previous image"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <button 
                  type="button"
                  className={styles.zoomArrowRight}
                  onClick={zoomNext}
                  aria-label="Next image"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </>
            )}

            <img 
              src={currentImages[zoomImageIndex]} 
              alt={`${product.title} - zoomed view`}
              className={styles.zoomImage}
              onError={handleImageError}
            />

            {currentImages.length > 1 && (
              <div className={styles.zoomCounter}>
                {zoomImageIndex + 1} / {currentImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Request Custom Order Modal */}
      {showRequestModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRequestModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Request Custom Order</h3>
            <p>Need this customized? Tell {maker.name} your requirements.</p>
            <div className={styles.formGroup}>
              <label>When do you need this by?</label>
              <input 
                type="date" 
                value={deadline} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)} 
                min={new Date().toISOString().split('T')[0]} 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Customization Notes</label>
              <textarea 
                rows={4} 
                placeholder="Size, color changes, custom measurements, etc..." 
                value={requestNotes} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRequestNotes(e.target.value)} 
              />
            </div>
            <div className={styles.modalActions}>
              <button 
                type="button" 
                className={styles.btnSecondary} 
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={styles.btnPrimary} 
                onClick={handleRequestOrder}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className={styles.modalOverlay} onClick={() => setShowSizeGuide(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Size Guide</h3>
            <p>Measurements are in inches. Find your perfect fit below.</p>
            <table className={styles.sizeGuideTable}>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Length</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>S / UK XS</td><td>34-36</td><td>28-30</td><td>27</td></tr>
                <tr><td>M / UK S</td><td>38-40</td><td>32-34</td><td>28</td></tr>
                <tr><td>L / UK M</td><td>42-44</td><td>36-38</td><td>29</td></tr>
                <tr><td>XL / UK L</td><td>46-48</td><td>40-42</td><td>30</td></tr>
              </tbody>
            </table>
            <div className={styles.modalActions}>
              <button 
                type="button" 
                className={styles.btnPrimary} 
                onClick={() => setShowSizeGuide(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;