import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './SearchView.module.css';
import { productAPI } from '../../services/ProductService';
import { Product } from '../BrutigeContext/BrutigeContext';

// --- TypeScript Interfaces ---
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

interface SearchAnalytics {
  query: string;
  timestamp: string;
  resultCount: number;
  clicked: boolean;
}

// --- Helper Functions ---
const getCategories = async (): Promise<Category[]> => {
  const allProducts = await productAPI.getAllProducts();
  const categoryMap = new Map<string, number>();
  
  allProducts.forEach(product => {
    const category = product.category || 'Uncategorized';
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });
  
  const categoryImages: Record<string, string> = {
    'Tops': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    'Bottoms': 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=300',
    'Outerwear': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300',
    'Accessories': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300',
    'Footwear': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300'
  };
  
  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    id: name.toLowerCase(),
    name,
    count,
    image: categoryImages[name] || 'https://via.placeholder.com/300x200?text=Category'
  }));
};

const getMakers = async (): Promise<Maker[]> => {
  return [
    { id: 'lagos-atelier', name: 'Lagos Atelier', location: 'Lagos, NG', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { id: 'abuja-studio', name: 'Abuja Studio', location: 'Abuja, NG', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
    { id: 'kano-craft', name: 'Kano Craft Co.', location: 'Kano, NG', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  ];
};

const getRecentSearches = async (): Promise<string[]> => {
  const stored = localStorage.getItem('brut_recent_searches');
  return stored ? JSON.parse(stored) : [];
};

const saveRecentSearch = async (query: string): Promise<void> => {
  const current = await getRecentSearches();
  const updated = [query, ...current.filter(s => s !== query)].slice(0, 8);
  localStorage.setItem('brut_recent_searches', JSON.stringify(updated));
};

const saveSearchAnalytics = (query: string, resultCount: number, clicked: boolean = false): void => {
  const stored = localStorage.getItem('brut_search_analytics');
  const analytics: SearchAnalytics[] = stored ? JSON.parse(stored) : [];
  
  const newEntry: SearchAnalytics = {
    query,
    timestamp: new Date().toISOString(),
    resultCount,
    clicked
  };
  
  const updated = [newEntry, ...analytics].slice(0, 50);
  localStorage.setItem('brut_search_analytics', JSON.stringify(updated));
};

export const getPopularSearches = (): { query: string; count: number }[] => {
  const stored = localStorage.getItem('brut_search_analytics');
  const analytics: SearchAnalytics[] = stored ? JSON.parse(stored) : [];
  
  const queryMap = new Map<string, number>();
  analytics.forEach(entry => {
    queryMap.set(entry.query, (queryMap.get(entry.query) || 0) + 1);
  });
  
  return Array.from(queryMap.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

interface SearchViewProps {
  onSelect: (product: Product) => void; // ✅ Now required
}

const SearchView: React.FC<SearchViewProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // ✅ Read initial search query from URL
  const initialQuery = searchParams.get('q') || '';
  
  // --- State ---
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [filterSearchQuery, setFilterSearchQuery] = useState('');
  
  // --- Data ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [makers, setMakers] = useState<Maker[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // --- Refs ---
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Update URL when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [searchQuery, setSearchParams]);

  // --- Initial Data Load ---
  useEffect(() => {
    const loadInitialData = async () => {
      const [cats, mks, recent] = await Promise.all([
        getCategories(),
        getMakers(),
        getRecentSearches()
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
      
      try {
        let results: Product[];
        
        if (selectedFilters.length > 0) {
          const allResults = await Promise.all(
            selectedFilters.map(filter => 
              productAPI.getProductsByCategory(filter)
            )
          );
          results = allResults.flat();
          
          results = results.filter((product, index, self) =>
            index === self.findIndex(p => p.id === product.id)
          );
        } else {
          results = await productAPI.getAllProducts();
        }
        
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          results = results.filter(p => 
            p.title.toLowerCase().includes(query) || 
            (p.category && p.category.toLowerCase().includes(query)) ||
            (p.description && p.description.toLowerCase().includes(query))
          );
        }
        
        setProducts(results);
      } catch (error) {
        console.error('Search failed:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedFilters]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

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

  const flattenedSuggestions = useMemo(() => {
    const items: Array<{
      type: 'product' | 'category' | 'maker';
      data: Product | Category | Maker;
      id: string;
    }> = [];
    
    suggestedProducts.forEach(p => items.push({ type: 'product', data: p, id: `p-${p.id}` }));
    suggestedCategories.forEach(c => items.push({ type: 'category', data: c, id: `c-${c.id}` }));
    suggestedMakers.forEach(m => items.push({ type: 'maker', data: m, id: `m-${m.id}` }));
    
    return items;
  }, [suggestedProducts, suggestedCategories, suggestedMakers]);

  const filteredCategories = useMemo(() => {
    if (!filterSearchQuery.trim()) return categories;
    const q = filterSearchQuery.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(q));
  }, [categories, filterSearchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsFocused(false);
      setHighlightedIndex(-1);
      if (inputRef.current) {
        inputRef.current.blur();
      }
      return;
    }
    
    if (!showDropdown || flattenedSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < flattenedSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : flattenedSuggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < flattenedSuggestions.length) {
          const item = flattenedSuggestions[highlightedIndex];
          handleSuggestionClick(item);
        } else {
          handleSearchSubmit(e as any);
        }
        break;
    }
  };

  // ✅ FIXED: Use onSelect prop instead of navigate
  const handleSuggestionClick = (item: { type: string; data: any }) => {
    setIsFocused(false);
    setHighlightedIndex(-1);
    
    if (item.type === 'product') {
      saveSearchAnalytics(searchQuery, products.length, true);
      onSelect(item.data); // ✅ Call parent's onSelect
    } else if (item.type === 'category') {
      setSearchQuery(item.data.name);
    } else if (item.type === 'maker') {
      navigate(`/platform/profile/${item.data.id}`);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await saveRecentSearch(searchQuery.trim());
      setRecentSearches(await getRecentSearches());
      saveSearchAnalytics(searchQuery.trim(), products.length);
      setIsFocused(false);
      setHighlightedIndex(-1);
    }
  };

  // ✅ FIXED: Use onSelect prop instead of navigate
  const handleProductClick = (product: Product) => {
    setIsFocused(false);
    setHighlightedIndex(-1);
    saveSearchAnalytics(searchQuery, products.length, true);
    onSelect(product); // ✅ Call parent's onSelect
  };

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery(categoryName);
    setIsFocused(false);
    setHighlightedIndex(-1);
  };

  const handleToggleFilter = (categoryId: string) => {
    setSelectedFilters(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAllFilters = () => {
    setSelectedFilters(categories.map(c => c.id));
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

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;

  const hasActiveFilters = selectedFilters.length > 0;
  const isSearching = query.length > 0 || hasActiveFilters;

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.searchSection}>
        <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
          <svg className={styles.searchIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>

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
            onKeyDown={handleKeyDown}
            autoComplete="off"
            aria-label="Search products"
            role="combobox"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
          />

          <div className={styles.searchActions}>
            {searchQuery && (
              <button 
                type="button" 
                className={styles.clearBtn}
                onClick={() => { setSearchQuery(''); setHighlightedIndex(-1); }}
                aria-label="Clear search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}

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

        {showDropdown && flattenedSuggestions.length > 0 && (
          <div className={styles.suggestionsDropdown} role="listbox">
            {suggestedProducts.length > 0 && (
              <div className={styles.suggestionGroup}>
                <div className={styles.suggestionTitle}>Products</div>
                {suggestedProducts.map(product => {
                  const flatIndex = flattenedSuggestions.findIndex(s => s.id === `p-${product.id}`);
                  return (
                    <div 
                      key={product.id} 
                      className={`${styles.suggestionItem} ${flatIndex === highlightedIndex ? styles.suggestionItemHighlighted : ''}`}
                      onClick={() => handleSuggestionClick({ type: 'product', data: product })}
                      onMouseEnter={() => setHighlightedIndex(flatIndex)}
                      role="option"
                      aria-selected={flatIndex === highlightedIndex}
                    >
                      <img src={product.img} alt={product.title} className={styles.suggestionImg} />
                      <div className={styles.suggestionInfo}>
                        <h4>{product.title}</h4>
                        <p>{product.category} · {product.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {suggestedCategories.length > 0 && (
              <div className={styles.suggestionGroup}>
                <div className={styles.suggestionTitle}>Categories</div>
                {suggestedCategories.map(category => {
                  const flatIndex = flattenedSuggestions.findIndex(s => s.id === `c-${category.id}`);
                  return (
                    <div 
                      key={category.id} 
                      className={`${styles.suggestionItem} ${flatIndex === highlightedIndex ? styles.suggestionItemHighlighted : ''}`}
                      onClick={() => handleSuggestionClick({ type: 'category', data: category })}
                      onMouseEnter={() => setHighlightedIndex(flatIndex)}
                      role="option"
                      aria-selected={flatIndex === highlightedIndex}
                    >
                      <img src={category.image} alt={category.name} className={styles.suggestionImg} />
                      <div className={styles.suggestionInfo}>
                        <h4>{category.name}</h4>
                        <p>{category.count} items</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {suggestedMakers.length > 0 && (
              <div className={styles.suggestionGroup}>
                <div className={styles.suggestionTitle}>Makers</div>
                {suggestedMakers.map(maker => {
                  const flatIndex = flattenedSuggestions.findIndex(s => s.id === `m-${maker.id}`);
                  return (
                    <div 
                      key={maker.id} 
                      className={`${styles.suggestionItem} ${flatIndex === highlightedIndex ? styles.suggestionItemHighlighted : ''}`}
                      onClick={() => handleSuggestionClick({ type: 'maker', data: maker })}
                      onMouseEnter={() => setHighlightedIndex(flatIndex)}
                      role="option"
                      aria-selected={flatIndex === highlightedIndex}
                    >
                      <img src={maker.avatar} alt={maker.name} className={styles.suggestionImg} style={{ borderRadius: '50%' }} />
                      <div className={styles.suggestionInfo}>
                        <h4>{maker.name}</h4>
                        <p>{maker.location}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={styles.keyboardHint}>
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
          </div>
        )}
      </div>

      {showFilterModal && (
        <div className={styles.modalOverlay} onClick={() => setShowFilterModal(false)}>
          <div className={styles.filterModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderContent}>
                <h3>Filters</h3>
                {hasActiveFilters && (
                  <span className={styles.modalFilterCount}>
                    {selectedFilters.length} selected
                  </span>
                )}
              </div>
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
              <div className={styles.filterSearchWrapper}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={filterSearchQuery}
                  onChange={(e) => setFilterSearchQuery(e.target.value)}
                  className={styles.filterSearchInput}
                />
                {filterSearchQuery && (
                  <button
                    type="button"
                    className={styles.filterSearchClear}
                    onClick={() => setFilterSearchQuery('')}
                    aria-label="Clear filter search"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>

              <div className={styles.filterQuickActions}>
                <button
                  type="button"
                  className={styles.filterQuickBtn}
                  onClick={handleSelectAllFilters}
                >
                  Select All
                </button>
                <button
                  type="button"
                  className={styles.filterQuickBtn}
                  onClick={handleClearFilters}
                  disabled={!hasActiveFilters}
                >
                  Clear All
                </button>
              </div>

              <div className={styles.filterSection}>
                <h4>Categories</h4>
                <div className={styles.filterOptions}>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map(category => (
                      <label key={category.id} className={styles.filterOption}>
                        <input 
                          type="checkbox"
                          checked={selectedFilters.includes(category.id)}
                          onChange={() => handleToggleFilter(category.id)}
                        />
                        <span className={styles.filterCheckbox}></span>
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className={styles.filterCategoryImage}
                        />
                        <span className={styles.filterLabel}>{category.name}</span>
                        <span className={styles.filterCount}>({category.count})</span>
                      </label>
                    ))
                  ) : (
                    <div className={styles.filterEmptyState}>
                      <p>No categories match "{filterSearchQuery}"</p>
                    </div>
                  )}
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
                Show {products.length} {products.length === 1 ? 'Result' : 'Results'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.mainContent}>
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
                        {product.category && (
                          <span className={styles.productCategory}>{product.category}</span>
                        )}
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