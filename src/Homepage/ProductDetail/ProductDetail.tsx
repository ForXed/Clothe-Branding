import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductDetail.module.css';

interface Product {
  id: number | string;
  title: string;
  price: string;
  img: string;
}

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

interface OtherProduct {
  id: number;
  title: string;
  price: string;
  img: string;
}

interface Color {
  name: string;
  hex: string;
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
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, addToCart, isSaved, toggleSaved }) => {
  const navigate = useNavigate();
  
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(2);
  const [sizeSystem, setSizeSystem] = useState<'US' | 'UK'>('US');
  const [selectedColor, setSelectedColor] = useState<string>('Matte Black');
  const [activeImg, setActiveImg] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [deadline, setDeadline] = useState<string>('');
  const [requestNotes, setRequestNotes] = useState<string>('');

  const sizes: SizeOption[] = [
    { us: 'XS', uk: 'XXS' }, { us: 'S', uk: 'XS' }, { us: 'M', uk: 'S' },
    { us: 'L', uk: 'M' }, { us: 'XL', uk: 'L' }, { us: 'XXL', uk: 'XL' }
  ];

  const colors: Color[] = [
    { name: 'Matte Black', hex: '#000000' },
    { name: 'Lunar Grey', hex: '#2A2A2A' },
    { name: 'Paper Bone', hex: '#e1decc' }
  ];

  const maker: Maker = {
    id: 'julian-v-studio', name: 'Julian V.', handle: '@julianv_studio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    location: 'Berlin, DE', rating: 4.9, sales: 48, productionDays: 5, shippingDays: 7
  };

  const otherProducts: OtherProduct[] = [
    { id: 2, title: 'Techwear Cargo V2', price: '$145', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400' },
    { id: 3, title: 'Oversized Hoodie', price: '$120', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' },
    { id: 4, title: 'Structured Cap', price: '$45', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400' }
  ];

  const productImages: string[] = [
    product.img,
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    "https://images.unsplash.com/photo-1574180563860-dc120042f485?w=600"
  ];
  
  const handleAddToCart = () => {
    const currentSize = sizeSystem === 'US' ? sizes[selectedSizeIndex].us : sizes[selectedSizeIndex].uk;
    addToCart(product, quantity, currentSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleRequestOrder = () => {
    console.log('Requesting:', { deadline, notes: requestNotes, product });
    setShowRequestModal(false);
    alert('Request sent to maker! They will confirm timeline and price.');
  };

  const calculateDelivery = (): string => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + maker.productionDays + maker.shippingDays);
    return delivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // 👇 FIXED: Changed HTMLDivElement to HTMLElement so it works on both <div> and <button>
  const handleViewProfile = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    navigate(`/platform/profile/${maker.id}`);
  };

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
          <div className={styles.mainImage}>
            <img src={productImages[activeImg]} alt={product.title} />
          </div>
          <div className={styles.thumbnailGrid}>
            {productImages.map((img, idx) => (
              <div key={idx} className={`${styles.thumb} ${activeImg === idx ? styles.activeThumb : ''}`} onClick={() => setActiveImg(idx)}>
                <img src={img} alt="Shot" />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.productHeader}>
            <div>
              <span className={styles.categoryTag}>NEW INFRASTRUCTURE</span>
              <h1 className={styles.productTitle}>{product.title}</h1>
            </div>
            <button type="button" className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`} onClick={toggleSaved}>
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
              <div className={styles.timelineStep}><div className={styles.stepDot}></div><span>Order Placed</span></div>
              <div className={styles.timelineLine}></div>
              <div className={styles.timelineStep}><div className={styles.stepDot}></div><span>Production ({maker.productionDays} days)</span></div>
              <div className={styles.timelineLine}></div>
              <div className={styles.timelineStep}><div className={styles.stepDot}></div><span>Shipping ({maker.shippingDays} days)</span></div>
            </div>
          </div>

          <div className={styles.selectorSection}>
            <h4 className={styles.selectorTitle}>Color: <span>{selectedColor}</span></h4>
            <div className={styles.colorGrid}>
              {colors.map((color) => (
                <button key={color.name} className={`${styles.colorCircle} ${selectedColor === color.name ? styles.activeColor : ''}`} style={{ backgroundColor: color.hex }} onClick={() => setSelectedColor(color.name)} title={color.name} type="button" />
              ))}
            </div>
          </div>

          <div className={styles.productSpecs}>
            <div className={styles.specItem}><span className={styles.specLabel}>Composition</span><strong>100% Organic Cotton</strong></div>
            <div className={styles.specItem}><span className={styles.specLabel}>Weight</span><strong>Heavyweight (450 GSM)</strong></div>
            <div className={styles.specItem}><span className={styles.specLabel}>Origin</span><strong>Brutige Atelier</strong></div>
            <div className={styles.specItem}><span className={styles.specLabel}>Turnaround</span><strong>{maker.productionDays} Working Days</strong></div>
          </div>

          <div className={styles.sizeSection}>
            <div className={styles.sizeHeader}>
              <h4>Select Size</h4>
              <div className={styles.sizeHeaderRight}>
                <div className={styles.sizeSystemToggle}>
                  <button type="button" className={sizeSystem === 'US' ? styles.activeToggle : ''} onClick={() => setSizeSystem('US')}>US</button>
                  <button type="button" className={sizeSystem === 'UK' ? styles.activeToggle : ''} onClick={() => setSizeSystem('UK')}>UK</button>
                </div>
                <button type="button" className={styles.sizeGuideBtn} onClick={() => setShowSizeGuide(true)}>Size Guide</button>
              </div>
            </div>
            <div className={styles.sizeGrid}>
              {sizes.map((size, idx) => (
                <button key={size.us} type="button" className={`${styles.sizeBtn} ${selectedSizeIndex === idx ? styles.selectedSize : ''}`} onClick={() => setSelectedSizeIndex(idx)}>
                  {sizeSystem === 'US' ? size.us : size.uk}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.utilityRow}>
            <div className={styles.quantitySection}>
              <div className={styles.quantityControl}>
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            <button type="button" className={styles.messageBtn} onClick={() => navigate('/platform/chat')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
              </svg>
              Message Maker
            </button>
          </div>

          <div className={styles.actions}>
            <button type="button" className={`${styles.addToCartBtn} ${addedToCart ? styles.added : ''}`} onClick={handleAddToCart}>
              {addedToCart ? "Added to Loop" : "Add to Cart"}
            </button>
            <button type="button" className={styles.requestBtn} onClick={() => setShowRequestModal(true)}>
              Request Custom Order
            </button>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <div><strong>Infrastructure Shipping</strong><p>Global fulfillment included</p></div>
            </div>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div><strong>Verified Maker</strong><p>Quality checked by Brutige Studio</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.otherProductsSection}>
        <div className={styles.sectionHeader}>
          <h3>More from {maker.name}</h3>
          <button type="button" className={styles.viewAllBtn} onClick={handleViewProfile}>
            View Full Catalog →
          </button>
        </div>
        <div className={styles.otherProductsGrid}>
          {otherProducts.map(item => (
            <div key={item.id} className={styles.otherProductCard}>
              <div className={styles.otherProductImage}><img src={item.img} alt={item.title} /></div>
              <div className={styles.otherProductInfo}>
                <h4>{item.title}</h4>
                <span>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRequestModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRequestModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Request Custom Order</h3>
            <p>Need this customized? Tell {maker.name} your requirements.</p>
            <div className={styles.formGroup}>
              <label>When do you need this by?</label>
              <input type="date" value={deadline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className={styles.formGroup}>
              <label>Customization Notes</label>
              <textarea rows={4} placeholder="Size, color changes, custom measurements, etc..." value={requestNotes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRequestNotes(e.target.value)} />
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.btnSecondary} onClick={() => setShowRequestModal(false)}>Cancel</button>
              <button type="button" className={styles.btnPrimary} onClick={handleRequestOrder}>Send Request</button>
            </div>
          </div>
        </div>
      )}

      {showSizeGuide && (
        <div className={styles.modalOverlay} onClick={() => setShowSizeGuide(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Size Guide</h3>
            <p>Measurements are in inches. Find your perfect fit below.</p>
            <table className={styles.sizeGuideTable}>
              <thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Length</th></tr></thead>
              <tbody>
                <tr><td>S / UK XS</td><td>34-36</td><td>28-30</td><td>27</td></tr>
                <tr><td>M / UK S</td><td>38-40</td><td>32-34</td><td>28</td></tr>
                <tr><td>L / UK M</td><td>42-44</td><td>36-38</td><td>29</td></tr>
                <tr><td>XL / UK L</td><td>46-48</td><td>40-42</td><td>30</td></tr>
              </tbody>
            </table>
            <div className={styles.modalActions}>
              <button type="button" className={styles.btnPrimary} onClick={() => setShowSizeGuide(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;