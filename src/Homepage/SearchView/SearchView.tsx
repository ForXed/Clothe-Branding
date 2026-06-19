import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchView.module.css';

// --- TypeScript Interfaces ---
interface Product {
  id: number | string;
  title: string;
  price: string;
  img: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  count: string;
  image: string;
}

interface Maker {
  id: string;
  name: string;
  location: string;
  avatar: string;
}

type FilterType = 'all' | 'infrastructure' | 'categories' | 'ateliers';

interface SearchViewProps {
  onSelect?: (product: Product) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- MOCK DATABASE ---
  const allProducts: Product[] = [
    { id: 1, title: "450GSM Heavyweight Tee", price: "$89", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300", category: "Tees" },
    { id: 2, title: "Techwear Cargo V2", price: "$145", img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=300", category: "Bottoms" },
    { id: 3, title: "Oversized Hoodie - Black", price: "$120", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300", category: "Layering" },
    { id: 4, title: "Minimalist Shell Jacket", price: "$210", img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300", category: "Outerwear" },
  ];

  const allCategories: Category[] = [
    { id: 'c1', name: 'Heavyweight Blanks', count: '1.2k items', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300' },
    { id: 'c2', name: 'Techwear Architecture', count: '890 items', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300' },
    { id: 'c3', name: 'Minimalist Layering', count: '1.5k items', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300' },
    { id: 'c4', name: 'Urban Utility', count: '670 items', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300' },
  ];

  const allMakers: Maker[] = [
    { id: 'm1', name: 'Julian V. Studio', location: 'Berlin, DE', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { id: 'm2', name: 'Tokyo Atelier', location: 'Tokyo, JP', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
    { id: 'm3', name: 'London Cut', location: 'London, UK', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  ];

  const recentSearches = ['Oversized Hoodie', 'Minimalist Tee', 'Techwear', 'Cargo Pants', 'Winter Coats'];

  // --- FILTER LOGIC ---
  const query = searchQuery.toLowerCase().trim();
  
  const filteredProducts = query 
    ? allProducts.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
    : allProducts;

  const filteredCategories = query
    ? allCategories.filter(c => c.name.toLowerCase().includes(query))
    : allCategories;

  const filteredMakers = query
    ? allMakers.filter(m => m.name.toLowerCase().includes(query) || m.location.toLowerCase().includes(query))
    : allMakers;

  // Show dropdown only if focused AND typing
  const showDropdown = isFocused && query.length > 0;

  // --- HANDLERS ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // When pressing Enter, close the dropdown to show the full grid results below
    setIsFocused(false); 
  };

  const handleProductClick = (product: Product) => {
    setIsFocused(false); // Close the dropdown
    
    // FIX: Force navigation to the main shop page and pass the product state
    // This triggers the ProductDetail view in BrutigePlatform.tsx
    navigate(`/platform/shop`, { 
      state: { selectedProduct: product } 
    });
  };

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery(categoryName);
    setActiveFilter('categories');
    setIsFocused(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* --- SEARCH SECTION --- */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search infrastructure, ateliers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            autoComplete="off"
          />
          {searchQuery && (
            <button 
              type="button" 
              className={styles.clearBtn}
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </form>

        {/* Filter Tabs */}
        <div className={styles.filterBar}>
          {(['all', 'infrastructure', 'categories', 'ateliers'] as FilterType[]).map(filter => (
            <button
              key={filter}
              type="button"
              className={`${styles.filterTab} ${activeFilter === filter ? styles.active : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* --- LIVE SUGGESTIONS DROPDOWN --- */}
        {showDropdown && (
          <div className={styles.suggestionsDropdown}>
            {/* Products Suggestions */}
            {(activeFilter === 'all' || activeFilter === 'infrastructure') && filteredProducts.length > 0 && (
              <div className={styles.suggestionGroup}>
                <div className={styles.suggestionTitle}>Infrastructure</div>
                {filteredProducts.slice(0, 3).map(product => (
                  <div key={product.id} className={styles.suggestionItem} onClick={() => handleProductClick(product)}>
                    <img src={product.img} alt={product.title} className={styles.suggestionImg} />
                    <div className={styles.suggestionInfo}>
                      <h4>{product.title}</h4>
                      <p>{product.category} • {product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Categories Suggestions */}
            {(activeFilter === 'all' || activeFilter === 'categories') && filteredCategories.length > 0 && (
              <div className={styles.suggestionGroup}>
                <div className={styles.suggestionTitle}>Categories</div>
                {filteredCategories.slice(0, 3).map(category => (
                  <div key={category.id} className={styles.suggestionItem} onClick={() => handleCategoryClick(category.name)}>
                    <img src={category.image} alt={category.name} className={styles.suggestionImg} />
                    <div className={styles.suggestionInfo}>
                      <h4>{category.name}</h4>
                      <p>{category.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Makers Suggestions */}
            {(activeFilter === 'all' || activeFilter === 'ateliers') && filteredMakers.length > 0 && (
              <div className={styles.suggestionGroup}>
                <div className={styles.suggestionTitle}>Ateliers</div>
                {filteredMakers.slice(0, 3).map(maker => (
                  <div key={maker.id} className={styles.suggestionItem} onClick={() => navigate(`/platform/profile/${maker.id}`)}>
                    <img src={maker.avatar} alt={maker.name} className={styles.suggestionImg} style={{ borderRadius: '50%' }} />
                    <div className={styles.suggestionInfo}>
                      <h4>{maker.name}</h4>
                      <p>{maker.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className={styles.mainContent}>
        
        {/* STATE 1: USER IS SEARCHING (Show Filtered Results) */}
        {query ? (
          <>
            {(activeFilter === 'all' || activeFilter === 'infrastructure') && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Infrastructure ({filteredProducts.length})</h3>
                {filteredProducts.length > 0 ? (
                  <div className={styles.grid3}>
                    {filteredProducts.map(product => (
                      <div key={product.id} className={styles.productCard} onClick={() => handleProductClick(product)}>
                        <div className={styles.productImage}><img src={product.img} alt={product.title} /></div>
                        <div className={styles.productInfo}>
                          <h4>{product.title}</h4>
                          <p className={styles.productPrice}>{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>No infrastructure found for "{searchQuery}"</div>
                )}
              </section>
            )}

            {(activeFilter === 'all' || activeFilter === 'categories') && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Categories ({filteredCategories.length})</h3>
                {filteredCategories.length > 0 ? (
                  <div className={styles.grid3}>
                    {filteredCategories.map(category => (
                      <button key={category.id} type="button" className={styles.categoryCard} onClick={() => handleCategoryClick(category.name)}>
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
                ) : (
                  <div className={styles.emptyState}>No categories found for "{searchQuery}"</div>
                )}
              </section>
            )}

            {(activeFilter === 'all' || activeFilter === 'ateliers') && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Ateliers ({filteredMakers.length})</h3>
                {filteredMakers.length > 0 ? (
                  <div className={styles.grid3}>
                    {filteredMakers.map(maker => (
                      <div key={maker.id} className={styles.productCard} onClick={() => navigate(`/platform/profile/${maker.id}`)} style={{ display: 'flex', alignItems: 'center', padding: '16px', gap: '16px' }}>
                        <img src={maker.avatar} alt={maker.name} className={styles.suggestionImg} style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                        <div className={styles.productInfo} style={{ border: 'none', padding: 0 }}>
                          <h4>{maker.name}</h4>
                          <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>{maker.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>No ateliers found for "{searchQuery}"</div>
                )}
              </section>
            )}
          </>
        ) : (
          
          /* STATE 2: DEFAULT VIEW (Show Recent, Trending, Popular) */
          <>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Recent Searches</h3>
              <div className={styles.chipList}>
                {recentSearches.map((search, idx) => (
                  <button 
                    key={idx} 
                    type="button"
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

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Trending Categories</h3>
              <div className={styles.grid3}>
                {allCategories.map(category => (
                  <button key={category.id} type="button" className={styles.categoryCard} onClick={() => handleCategoryClick(category.name)}>
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

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Popular Infrastructure</h3>
              <div className={styles.grid3}>
                {allProducts.slice(0, 4).map(product => (
                  <div key={product.id} className={styles.productCard} onClick={() => handleProductClick(product)}>
                    <div className={styles.productImage}><img src={product.img} alt={product.title} /></div>
                    <div className={styles.productInfo}>
                      <h4>{product.title}</h4>
                      <p className={styles.productPrice}>{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchView;