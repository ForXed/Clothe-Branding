import React, { useState, useEffect, useRef } from 'react';
import styles from './MasonryFeed.module.css';
import PromoBanner from '../PromoBanner/PromoBanner';
import { productAPI } from '../../services/ProductService';
import { Product, SavedItem } from '../BrutigeContext/BrutigeContext'; 

interface MasonryFeedProps {
  onSelect: (product: Product) => void;
  savedItems?: SavedItem[];
  toggleSaved: (product: Product) => void;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
}

const MasonryFeed: React.FC<MasonryFeedProps> = ({ 
  onSelect, 
  savedItems = [], 
  toggleSaved, 
  addToCart 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | string | null>(null);
  const [cardImageIndexes, setCardImageIndexes] = useState<Record<string | number, number>>({});
  
  // ✅ NEW: Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const swipeThreshold = 50; // Minimum distance for swipe

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [cats, prods] = await Promise.all([
          productAPI.getCategories() as Promise<string[]>,
          productAPI.getAllProducts() as Promise<Product[]>
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error("Failed to load catalog:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loadCategory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const prods = await productAPI.getProductsByCategory(activeCategory) as Product[];
        setProducts(prods);
        setCardImageIndexes({});
      } catch (error) {
        console.error("Failed to filter products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCategory();
  }, [activeCategory]);

  const getCardImageIndex = (productId: string | number): number => {
    return cardImageIndexes[productId] || 0;
  };

  const setCardImageIndex = (productId: string | number, index: number) => {
    setCardImageIndexes(prev => ({ ...prev, [productId]: index }));
  };

  const getProductImages = (product: Product): string[] => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.img];
  };

  const nextImage = (productId: string | number, images: string[]) => {
    const currentIndex = getCardImageIndex(productId);
    const nextIndex = (currentIndex + 1) % images.length;
    setCardImageIndex(productId, nextIndex);
  };

  const prevImage = (productId: string | number, images: string[]) => {
    const currentIndex = getCardImageIndex(productId);
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCardImageIndex(productId, prevIndex);
  };

  // ✅ NEW: Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Detect if user is swiping horizontally
    if (touchStart && touchEnd) {
      const distance = Math.abs(touchStart - touchEnd);
      if (distance > 10) {
        setIsSwiping(true);
      }
    }
  };

  const handleTouchEnd = (productId: string | number, imagesLength: number) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > swipeThreshold;
    const isRightSwipe = distance < -swipeThreshold;
    
    const currentIndex = getCardImageIndex(productId);
    
    if (isLeftSwipe && currentIndex < imagesLength - 1) {
      setCardImageIndex(productId, currentIndex + 1);
      setIsSwiping(true);
    } else if (isRightSwipe && currentIndex > 0) {
      setCardImageIndex(productId, currentIndex - 1);
      setIsSwiping(true);
    }
    
    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
    
    // Reset swiping flag after a short delay
    setTimeout(() => setIsSwiping(false), 100);
  };

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1, 'M');
  };

  const handleToggleSaved = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    e.stopPropagation();
    toggleSaved(product);
  };

  const isSaved = (productId: number | string): boolean => {
    return savedItems?.some(item => item.id === productId) || false;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://via.placeholder.com/500x625?text=No+Image";
  };

  // ✅ NEW: Handle card click (prevent if swiping)
  const handleCardClick = (product: Product) => {
    if (!isSwiping) {
      onSelect(product);
    }
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

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroText}>where makers meet their market,</h1>
        <p className={styles.heroSubtext}>Independent creators. Limited production. Authentic craftsmanship delivered to your door.</p>
      </div>

      <PromoBanner />

      <div className={styles.filterBar}>
        {categories.map(cat => (
          <button 
            key={cat} 
            type="button" 
            className={`${styles.filterPill} ${activeCategory === cat ? styles.active : ''}`} 
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading && products.length > 0 && (
        <div className={styles.filterLoadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      <div className={styles.masonry}>
        {products.length === 0 ? (
          <div className={styles.emptyFilterState}>No items found in this sector.</div>
        ) : (
          products.map(product => {
            const stock = Number(product.stock) || 0;
            const capacity = Number(product.totalCapacity) || 1;
            const stockPercentage = Math.min((stock / capacity) * 100, 100);
            const images = getProductImages(product);
            const currentImageIndex = getCardImageIndex(product.id);
            
            return (
              <div 
                key={product.id} 
                className={styles.card} 
                onMouseEnter={() => setHoveredCard(product.id)} 
                onMouseLeave={() => setHoveredCard(null)} 
                onClick={() => handleCardClick(product)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(product.id, images.length)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCardClick(product)}
              >
                <div className={styles.imageContainer}>
                  <div className={styles.imageInner}>
                    <img 
                      src={images[currentImageIndex]} 
                      alt={product.title}
                      onError={handleImageError}
                      className={styles.cardImage}
                      draggable={false}
                    />
                    
                    {product.category && (
                      <span className={styles.categoryTag}>{product.category}</span>
                    )}

                    {images.length > 1 && hoveredCard === product.id && (
                      <>
                        <button 
                          type="button"
                          className={styles.cardArrowLeft}
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage(product.id, images);
                          }}
                          aria-label="Previous image"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6"/>
                          </svg>
                        </button>
                        <button 
                          type="button"
                          className={styles.cardArrowRight}
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage(product.id, images);
                          }}
                          aria-label="Next image"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </button>
                      </>
                    )}

                    {images.length > 1 && (
                      <div className={styles.cardDots}>
                        {images.map((_, idx) => (
                          <span 
                            key={idx}
                            className={`${styles.cardDot} ${idx === currentImageIndex ? styles.active : ''}`}
                          />
                        ))}
                      </div>
                    )}

                    <div className={`${styles.cardActions} ${hoveredCard === product.id ? styles.visible : ''}`}>
                      <button 
                        type="button" 
                        className={`${styles.actionBtn} ${isSaved(product.id) ? styles.saved : ''}`} 
                        onClick={(e) => handleToggleSaved(e, product)}
                        aria-label={isSaved(product.id) ? "Remove from saved" : "Save item"}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                      </button>
                      <button 
                        type="button" 
                        className={styles.actionBtn} 
                        onClick={(e) => handleQuickAdd(e, product)}
                        aria-label="Quick add to cart"
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
                  {product.description && (
                    <p className={styles.descriptionText}>{product.description}</p>
                  )}
                  <div className={styles.metricsArea}>
                    <div className={styles.stockInfo}>
                      <span>{stock} pieces remaining</span>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ 
                            width: `${stockPercentage}%`, 
                            backgroundColor: stockPercentage < 20 ? '#ff4444' : stockPercentage < 50 ? '#ffa500' : 'var(--brut-text)'
                          }} 
                        />
                      </div>
                    </div>
                    {product.brandsBuilt && (
                      <div className={styles.socialProof}>
                        <strong>{product.brandsBuilt}</strong> brands built
                      </div>
                    )}
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