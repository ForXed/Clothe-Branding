import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import navigate
import { productAPI } from '../../../services/ProductService';
import styles from './Products.module.css';

const Products = () => {
  const navigate = useNavigate(); // 2. Initialize navigate
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Fetch Products on Mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const products = await productAPI.getAllProducts();
      
      // Map API data to ensure consistent field names for the UI
      const formatted = products.map(p => ({
        ...p,
        name: p.name || p.title || "Untitled Product",
        price: typeof p.price === 'string' ? parseFloat(p.price.replace('$', '')) : (p.price || 0),
        status: p.status || 'active',
        stock: p.stock || 0,
        tags: p.tags || []
      }));
      
      setAllProducts(formatted);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = allProducts.filter(product => {
    const productName = (product.name || "").toLowerCase();
    const searchLower = (searchQuery || "").toLowerCase();
    
    const matchesSearch = productName.includes(searchLower);
    const matchesFilter = filter === 'all' || product.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  // 3. CHANGED: Navigate to AddProduct page with editId query param
  const handleEditClick = (product) => {
    navigate(`/studio/add-product?editId=${product.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await productAPI.deleteProduct(id);
        await fetchProducts();
      } catch (error) {
        console.error("Failed to delete", error);
        alert("Failed to delete product.");
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    try {
      await productAPI.updateProduct(id, { status: newStatus });
      await fetchProducts();
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Inventory</h2>
          <p>Manage your products, stock, and visibility.</p>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={styles.filters}>
            {['all', 'active', 'draft'].map(status => (
              <button 
                key={status}
                className={`${styles.filterBtn} ${filter === status ? styles.active : ''}`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading Inventory...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className={styles.grid}>
          {filteredProducts.map(product => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <img 
                  src={product.image || product.img} 
                  alt={product.name} 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60';
                  }}
                />
                <div className={styles.badgeGroup}>
                  <span className={`${styles.badge} ${styles[product.status]}`}>
                    {product.status}
                  </span>
                  {product.stock < 10 && product.stock > 0 && (
                    <span className={`${styles.badge} ${styles.lowStock}`}>Low Stock</span>
                  )}
                  {product.stock === 0 && (
                    <span className={`${styles.badge} ${styles.outOfStock}`}>Out of Stock</span>
                  )}
                </div>
                
                <div className={styles.overlay}>
                  <button onClick={() => handleEditClick(product)} className={styles.iconBtn} title="Edit">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(product.id)} className={`${styles.iconBtn} ${styles.danger}`} title="Delete">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className={styles.info}>
                <div className={styles.top}>
                  <h3>{product.name}</h3>
                  <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
                </div>
                
                <div className={styles.meta}>
                  <span className={styles.stock}>{product.stock} units</span>
                  <span className={styles.category}>{product.category}</span>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className={styles.tags}>
                    {product.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                    {product.tags.length > 3 && <span className={styles.tagMore}>+{product.tags.length - 3}</span>}
                  </div>
                )}

                <div className={styles.actions}>
                  <button 
                    className={styles.toggleStatusBtn}
                    onClick={() => handleStatusToggle(product.id, product.status)}
                  >
                    {product.status === 'active' ? 'Set to Draft' : 'Set to Active'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Modal Removed: Editing now happens on the AddProduct page */}
    </div>
  );
};

export default Products;