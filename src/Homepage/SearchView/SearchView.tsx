import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchView.module.css';

// --- TypeScript Interfaces (Backend-ready) ---
export interface Product {
  id: number | string;
  title: string;
  price: string;
  img: string;
  category: string;
  description?: string;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
}

export interface Maker {
  id: string;
  name: string;
  location: string;
  avatar: string;
}

// --- Mock API Service (Replace with real backend calls later) ---
// When connecting to backend, just swap these implementations with fetch() calls
const searchAPI = {
  async searchProducts(query: string, filters: string[]): Promise<Product[]> {
    // TODO: Replace with: return fetch(`/api/products?q=${query}&categories=${filters.join(',')}`).then(r => r.json())
    await new Promise(r => setTimeout(r, 300)); // Simulate network delay
    const allProducts: Product[] = [
      { id: 1, title: "450GSM Heavyweight Tee", price: "$89", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", category: "Tees" },
      { id: 2, title: "Techwear Cargo V2", price: "$145", img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400", category: "Bottoms" },
      { id: 3, title: "Oversized Hoodie - Black", price: "$120", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", category: "Hoodies" },
      { id: 4, title: "Minimalist Shell Jacket", price: "$210", img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", category: "Outerwear" },
      { id: 5, title: "Structured Cap", price: "$45", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", category: "Accessories" },
      { id: 6, title: "Heavyweight Crewneck", price: "$95", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", category: "Hoodies" },
      { id: 7, title: "Wide Leg Trousers", price: "$165", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", category: "Bottoms" },
      { id: 8, title: "Wool Overcoat", price: "$320", img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400", category: "Outerwear" },
    ];
    
    return allProducts.filter(p => {
      const matchesQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filters.length === 0 || filters.includes(p.category);
      return matchesQuery && matchesFilter;
    });
  },

  async getCategories(): Promise<Category[]> {
    // TODO: Replace with real API call
    return [
      { id: 'tees', name: 'Tees', count: 124, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300' },
      { id: 'hoodies', name: 'Hoodies', count: 89, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300' },
      { id: 'outerwear', name: 'Outerwear', count: 56, image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300' },
      { id: 'bottoms', name: 'Bottoms', count: 78, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=300' },
      { id: 'accessories', name: 'Accessories', count: 142, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300' },
    ];
  },

  async getMakers(): Promise<Maker[]> {
    // TODO: Replace with real API call
    return [
      { id: 'm1', name: 'Julian V. Studio', location: 'Berlin, DE', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { id: 'm2', name: 'Tokyo Atelier', location: 'Tokyo, JP', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
      { id: 'm3', name: 'London Cut', location: 'London, UK', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
    ];
  },

  async getRecentSearches(): Promise<string[]> {
    // TODO: Could fetch from backend or use localStorage
    const stored = localStorage.getItem('brut_recent_searches');
    return stored ? JSON.parse(stored) : ['Oversized Hoodie', 'Techwear', 'Cargo Pants', 'Winter Coats'];
  },

  async saveRecentSearch(query: string): Promise<void> {
    // TODO: Save to backend or localStorage
    const current = await searchAPI.getRecentSearches();
    const updated = [query, ...current.filter(s => s !== query)].slice(0, 8);
    localStorage.setItem('brut_recent_searches', JSON.stringify(updated));
  }
};

interface SearchViewProps {
  onSelect?: (product: Product) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  
  // --- State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- Data (will come from backend) ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [makers, setMakers] = useState<Maker[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // --- Refs ---
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Initial Data Load ---
  useEffect(() => {
    const loadInitialData = async () => {
      const [cats, mks, recent] = await Promise.all([
        searchAPI.getCategories(),
        searchAPI.getMakers(),
        searchAPI.getRecentSearches()
      ]);
      setCategories(cats);
      setMakers(mks);
      setRecentSearches(recent);
    };
    loadInitialData();
  }, []);

  // --- Search Effect (debounced) ---
  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);
      const results = await searchAPI.searchProducts(searchQuery, selectedFilters);
      setProducts(results);
      setIsLoading(false);
    };

    const timeoutId = setTimeout(performSearch, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedFilters]);

  // --- Auto-focus & Click Outside ---
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setShowFilterModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Suggestions Logic ---
  const query = searchQuery.toLowerCase().trim();
  const showDropdown = isFocused && query.length > 0;

  const suggestedProducts = query 
    ? products.filter(p => p.title.toLowerCase().includes(query)).slice(0, 3)
    : [];
  
  const suggestedCategories = query
    ? categories.filter(c => c.name.toLowerCase().includes(query)).slice(0, 3)
    : [];
  
  const suggestedMakers = query
    ? makers.filter(m => m.name.toLowerCase().includes(query) || m.location.toLowerCase().includes(query)).slice(0, 3)
    : [];

  // --- Handlers ---
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchAPI.saveRecentSearch(searchQuery.trim());
      setRecentSearches(await searchAPI.getRecentSearches());
      setIsFocused(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setIsFocused(false);
    navigate(`/platform/shop`, { state: { selectedProduct: product } });
  };

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery(categoryName);
    setIsFocused(false);
  };

  const handleToggleFilter = (categoryId: string) => {
    setSelectedFilters(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
  };

  const handleRemoveFilter = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFilters(prev => prev.filter(id => id !== categoryId));
  };

  const handleRemoveRecent = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== search);
    localStorage.setItem('brut_recent_searches', JSON.stringify(updated));
    setRecentSearches(updated);
  };

  // Get category name from ID for filter pills
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;

  const hasActiveFilters = selectedFilters.length > 0;
  const isSearching = query.length > 0 || hasActiveFilters;

  return (
    <div className={styles.container} ref={containerRef}>
      {/* --- SEARCH SECTION --- */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
          <svg className={styles.searchIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>

          {/* Active Filter Pills (inside search bar) */}
          {hasActiveFilters && (
            <div className={styles.filterPills}>
              {selectedFilters.map(filterId => (
                <span key={filterId} className={styles.filterPill}>
                  {getCategoryName(filterId)}
                  <button 
                    type="button" 
                    className={styles.filterPillClose}
                    onClick={(e) => handleRemoveFilter(filterId, e)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search products, categories, makers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            autoComplete="off"
          />

          <div className={styles.searchActions}>
            {searchQuery && (
              <button 
                type="button" 
                className={styles.clearBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}

            {/* Filter Button */}
            <button 
              type="button"
              className={`${styles.filterBtn} ${hasActiveFilters ? styles.filterBtnActive : ''}`}
              onClick={() => setShowFilterModal(true)}
              aria-label="Open filters"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/>
                <line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              {hasActiveFilters && <span className={styles.filterCount}>{selectedFilters.length}</span>}
            </button>
          </div>
        </form>

        {/* --- LIVE SUGGESTIONS DROPDOWN --- */}
        {showDropdown && (suggestedProducts.length > 0 || suggestedCategories.length > 0 || suggestedMakers.length > 0) && (
          <div className={styles.suggestionsDropdown}>
            {suggestedProducts.length > 0 && (
              <div className={styles.suggestionGroup}>
                <div className={styles.suggestionTitle}>Products</div>
                {suggestedProducts.map(product => (
                  <div key={product.id} className={styles.suggestionItem} onClick={() => handleProductClick(product)}>
                    <img src={product.img} alt={product.title} className={styles.suggestionImg} />
                    <div className={styles.suggestionInfo}>
                      <h4>{product.title}</h4>
                      <p>{product.category} · {product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {suggestedCategories.length > 0 && (
              <div className={styles.suggestionGroup}>
                <div className={styles.suggestionTitle}>Categories</div>
                {suggestedCategories.map(category => (
                  <div key={category.id} className={styles.suggestionItem} onClick={() => handleCategoryClick(category.name)}>
                    <img src={category.image} alt={category.name} className={styles.suggestionImg} />
                    <div className={styles.suggestionInfo}>
                      <h4>{category.name}</h4>
                      <p>{category.count} items</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {suggestedMakers.length > 0 && (
              <div className={styles.suggestionGroup}>
                <div className={styles.suggestionTitle}>Makers</div>
                {suggestedMakers.map(maker => (
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

      {/* --- FILTER MODAL --- */}
      {showFilterModal && (
        <div className={styles.modalOverlay} onClick={() => setShowFilterModal(false)}>
          <div className={styles.filterModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Filters</h3>
              <button 
                type="button" 
                className={styles.modalClose}
                onClick={() => setShowFilterModal(false)}
                aria-label="Close filters"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.filterSection}>
                <h4>Categories</h4>
                <div className={styles.filterOptions}>
                  {categories.map(category => (
                    <label key={category.id} className={styles.filterOption}>
                      <input 
                        type="checkbox"
                        checked={selectedFilters.includes(category.id)}
                        onChange={() => handleToggleFilter(category.id)}
                      />
                      <span className={styles.filterCheckbox}></span>
                      <span className={styles.filterLabel}>{category.name}</span>
                      <span className={styles.filterCount}>({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.clearFiltersBtn}
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
              >
                Clear All
              </button>
              <button 
                type="button" 
                className={styles.applyFiltersBtn}
                onClick={() => setShowFilterModal(false)}
              >
                Show {products.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className={styles.mainContent}>
        
        {/* DEFAULT VIEW (No search/filters active) */}
        {!isSearching ? (
          <>
            {recentSearches.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Recent searches</h3>
                <div className={styles.chipList}>
                  {recentSearches.map((search, idx) => (
                    <div key={idx} className={styles.chipWrapper}>
                      <button 
                        type="button"
                        className={styles.chip}
                        onClick={() => setSearchQuery(search)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        <span>{search}</span>
                      </button>
                      <button 
                        type="button"
                        className={styles.chipRemove}
                        onClick={(e) => handleRemoveRecent(search, e)}
                        aria-label={`Remove ${search}`}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Browse by category</h3>
              <div className={styles.masonry}>
                {categories.map(category => (
                  <div key={category.id} className={styles.masonryItem}>
                    <button 
                      type="button" 
                      className={styles.categoryCard} 
                      onClick={() => handleToggleFilter(category.id)}
                    >
                      <div className={styles.categoryImage}>
                        <img src={category.image} alt={category.name} />
                        <div className={styles.categoryOverlay}>
                          <h4>{category.name}</h4>
                          <p>{category.count} items</p>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          
          /* SEARCH RESULTS VIEW (Masonry Layout) */
          <section className={styles.section}>
            <div className={styles.resultsHeader}>
              <h3 className={styles.sectionTitle}>
                {isLoading ? 'Searching...' : `${products.length} ${products.length === 1 ? 'result' : 'results'}`}
                {searchQuery && <span className={styles.resultsQuery}> for "{searchQuery}"</span>}
              </h3>
            </div>

            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Finding the perfect pieces...</p>
              </div>
            ) : products.length > 0 ? (
              <div className={styles.masonry}>
                {products.map(product => (
                  <div key={product.id} className={styles.masonryItem}>
                    <div className={styles.productCard} onClick={() => handleProductClick(product)}>
                      <div className={styles.productImage}>
                        <img src={product.img} alt={product.title} />
                        <span className={styles.productCategory}>{product.category}</span>
                      </div>
                      <div className={styles.productInfo}>
                        <h4>{product.title}</h4>
                        <p className={styles.productPrice}>{product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                <h3>No results found</h3>
                <p>Try adjusting your search or filters</p>
                <button 
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => { setSearchQuery(''); setSelectedFilters([]); }}
                >
                  Clear all
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchView;