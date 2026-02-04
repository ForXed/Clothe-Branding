import React, { useState } from 'react';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ product, onBack, addToCart, isSaved, toggleSaved }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Catalog
      </button>

      <div className={styles.productLayout}>
        {/* Image Section */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img src={product.img} alt={product.title} />
          </div>
        </div>

        {/* Details Section */}
        <div className={styles.detailsSection}>
          <div className={styles.productHeader}>
            <div>
              <span className={styles.categoryTag}>NEW INFRASTRUCTURE</span>
              <h1 className={styles.productTitle}>{product.title}</h1>
            </div>
            <button 
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

          {/* Product Details */}
          <div className={styles.productSpecs}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Composition</span>
              <strong>100% Organic Cotton</strong>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Weight</span>
              <strong>Heavyweight (300 GSM)</strong>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Care</span>
              <strong>Machine wash cold</strong>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Origin</span>
              <strong>Made in Portugal</strong>
            </div>
          </div>

          {/* Size Selection */}
          <div className={styles.sizeSection}>
            <div className={styles.sizeHeader}>
              <h4>Select Size</h4>
              <button className={styles.sizeGuideBtn}>Size Guide</button>
            </div>
            <div className={styles.sizeGrid}>
              {sizes.map(size => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className={styles.quantitySection}>
            <h4>Quantity</h4>
            <div className={styles.quantityControl}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button 
              className={`${styles.addToCartBtn} ${addedToCart ? styles.added : ''}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Added to Cart
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
            <button className={styles.brandBtn}>
              Brand This Item
            </button>
          </div>

          {/* Features */}
          <div className={styles.features}>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <div>
                <strong>Free Shipping</strong>
                <p>On orders over $100</p>
              </div>
            </div>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <div>
                <strong>Easy Returns</strong>
                <p>30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;