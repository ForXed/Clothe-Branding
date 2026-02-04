import React, { useState } from 'react';
import styles from './MasonryFeed.module.css';

const MasonryFeed = ({ onSelect, savedItems, toggleSaved, addToCart }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const products = [
    { 
      id: 1, 
      title: "Oversized 'Brut' Tee", 
      price: "$45.00", 
      category: "Essentials",
      img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500" 
    },
    { 
      id: 2, 
      title: "Infrastructure Hoodie", 
      price: "$85.00", 
      category: "Layering",
      img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500" 
    },
    { 
      id: 3, 
      title: "Architectural Coat", 
      price: "$210.00", 
      category: "Outerwear",
      img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500" 
    },
    { 
      id: 4, 
      title: "Minimalist Shell", 
      price: "$120.00", 
      category: "Layering",
      img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500" 
    },
    { 
      id: 5, 
      title: "Essential Cargo Pants", 
      price: "$95.00", 
      category: "Bottoms",
      img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500" 
    },
    { 
      id: 6, 
      title: "Technical Vest", 
      price: "$135.00", 
      category: "Layering",
      img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500" 
    },
    { 
      id: 7, 
      title: "Structured Button-Up", 
      price: "$75.00", 
      category: "Essentials",
      img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500" 
    },
    { 
      id: 8, 
      title: "Heavyweight Sweatpants", 
      price: "$65.00", 
      category: "Bottoms",
      img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500" 
    },
  ];

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1, 'M');
  };

  const handleToggleSaved = (e, product) => {
    e.stopPropagation();
    toggleSaved(product);
  };

  const isSaved = (productId) => {
    return savedItems.some(item => item.id === productId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroText}>
          something comfy, large and modest,
        </h1>
        <p className={styles.heroSubtext}>
          Discover timeless pieces that blend comfort with refined aesthetics
        </p>
      </div>

      <div className={styles.masonry}>
        {products.map(product => (
          <div 
            key={product.id} 
            className={styles.card}
            onMouseEnter={() => setHoveredCard(product.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelect(product)}
          >
            <div className={styles.imageBox}>
              <img src={product.img} alt={product.title} />
              
              {/* Category Tag */}
              <span className={styles.categoryTag}>{product.category}</span>

              {/* Action Buttons */}
              <div className={`${styles.cardActions} ${hoveredCard === product.id ? styles.visible : ''}`}>
                <button 
                  className={`${styles.saveBtn} ${isSaved(product.id) ? styles.saved : ''}`}
                  onClick={(e) => handleToggleSaved(e, product)}
                  aria-label={isSaved(product.id) ? "Remove from saved" : "Save item"}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
                <button 
                  className={styles.quickAddBtn}
                  onClick={(e) => handleQuickAdd(e, product)}
                  aria-label="Quick add to cart"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.cardDetails}>
              <div className={styles.cardInfo}>
                <h4>{product.title}</h4>
                <span className={styles.price}>{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryFeed;