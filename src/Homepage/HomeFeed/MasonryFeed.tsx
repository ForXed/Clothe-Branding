import React, { useState, useEffect } from 'react';
import styles from './MasonryFeed.module.css';
import PromoBanner from '../PromoBanner/PromoBanner';
import { productAPI } from '../../services/ProductService';

const MasonryFeed = ({ onSelect, savedItems = [], toggleSaved, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Load Categories and Products on Mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories first to build the filter bar
        const cats = await productAPI.getCategories();
        setCategories(cats);

        // Fetch initial products
        const prods = await productAPI.getAllProducts();
        setProducts(prods);
      } catch (error) {
        console.error("Failed to load catalog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Category Change
  useEffect(() => {
    const loadCategory = async () => {
      setIsLoading(true);
      try {
        const prods = await productAPI.getProductsByCategory(activeCategory);
        setProducts(prods);
      } catch (error) {
        console.error("Failed to filter products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [activeCategory]);

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1, 'M');
  };

  const handleToggleSaved = (e, product) => {
    e.stopPropagation();
    toggleSaved(product);
  };

  const isSaved = (productId) => {
    return savedItems?.some(item => item.id === productId);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Initializing Infrastructure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroText}>
          something comfy, large and modest,
        </h1>
        <p className={styles.heroSubtext}>
          Global infrastructure for independent makers. Real-time atelier stock.
        </p>
      </div>

      <PromoBanner />

      {/* Dynamic Filter Bar */}
      <div className={styles.filterBar}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.filterPill} ${activeCategory === cat ? styles.active : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.masonry}>
        {products.length === 0 ? (
          <div className={styles.emptyFilterState}>No items found in this sector.</div>
        ) : (
          products.map(product => {
            const stockPercentage = (product.stock / product.totalCapacity) * 100;
            
            return (
              <div 
                key={product.id} 
                className={styles.card}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onSelect(product)}
              >
                <div className={styles.imageContainer}>
                  <div className={styles.imageInner}>
                    <img src={product.img} alt={product.title} />
                    
                    <span className={styles.categoryTag}>{product.category}</span>

                    <div className={`${styles.cardActions} ${hoveredCard === product.id ? styles.visible : ''}`}>
                      <button 
                        className={`${styles.actionBtn} ${isSaved(product.id) ? styles.saved : ''}`}
                        onClick={(e) => handleToggleSaved(e, product)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                      </button>
                      <button 
                        className={styles.actionBtn}
                        onClick={(e) => handleQuickAdd(e, product)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.cardDetails}>
                  <div className={styles.productHeader}>
                    <h4>{product.title}</h4>
                    <div className={styles.pricePill}>{product.price}</div>
                  </div>
                  
                  <p className={styles.descriptionText}>{product.description}</p>

                  <div className={styles.metricsArea}>
                    <div className={styles.stockInfo}>
                      <span>{product.stock} pieces remaining</span>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${stockPercentage}%`, backgroundColor: product.stock < 10 ? '#ff4444' : 'var(--brut-text)' }}
                        />
                      </div>
                    </div>
                    <div className={styles.socialProof}>
                      <strong>{product.brandsBuilt}</strong> brands built
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MasonryFeed;