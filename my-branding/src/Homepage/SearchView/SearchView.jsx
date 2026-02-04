import React, { useState } from 'react';
import styles from './SearchView.module.css';

const SearchView = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const recentSearches = [
    'Oversized Hoodie', 
    'Minimalist Tee', 
    'Techwear', 
    'Cargo Pants',
    'Winter Coats'
  ];

  const trendingCategories = [
    { name: 'Streetwear', count: '2.4k items', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=150' },
    { name: 'Couture', count: '1.8k items', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=150' },
    { name: 'Minimalist', count: '3.1k items', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=150' },
    { name: 'Techwear', count: '890 items', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=150' },
    { name: 'Urban', count: '1.5k items', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=150' },
    { name: 'Goth', count: '670 items', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=150' }
  ];

  const popularProducts = [
    { 
      id: 1, 
      title: "Oversized 'Brut' Tee", 
      price: "$45.00", 
      img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300" 
    },
    { 
      id: 2, 
      title: "Infrastructure Hoodie", 
      price: "$85.00", 
      img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300" 
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement actual search here
    }
  };

  return (
    <div className={styles.container}>
      {/* Search Bar */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search for styles, aesthetics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button 
              type="button" 
              className={styles.clearBtn}
              onClick={() => setSearchQuery('')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* Recent Searches */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Recent Searches</h3>
        <div className={styles.chipList}>
          {recentSearches.map((search, idx) => (
            <button 
              key={idx} 
              className={styles.chip}
              onClick={() => setSearchQuery(search)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>{search}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Categories */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Trending Categories</h3>
        <div className={styles.categoryGrid}>
          {trendingCategories.map((category, idx) => (
            <button 
              key={idx} 
              className={styles.categoryCard}
            >
              <div className={styles.categoryImage}>
                <img src={category.image} alt={category.name} />
                <div className={styles.categoryOverlay}>
                  <h4>{category.name}</h4>
                  <p>{category.count}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Popular Right Now</h3>
        <div className={styles.productGrid}>
          {popularProducts.map(product => (
            <div 
              key={product.id} 
              className={styles.productCard}
              onClick={() => onSelect(product)}
            >
              <div className={styles.productImage}>
                <img src={product.img} alt={product.title} />
              </div>
              <div className={styles.productInfo}>
                <h4>{product.title}</h4>
                <p>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SearchView;