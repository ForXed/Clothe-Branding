import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, Product } from '../../services/ProductService';
import styles from './Products.module.css';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const products = await productAPI.getAllProducts();
      setAllProducts(products);
    } catch (error) { 
      console.error("Failed to load products:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || product.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleEditClick = (product: Product) => {
    navigate(`/studio/add-product?editId=${product.id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try { 
        await productAPI.deleteProduct(id); 
        await fetchProducts(); 
      } catch (error) { 
        alert("Failed to delete product."); 
      }
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    try { 
      await productAPI.updateProduct(id, { status: newStatus }); 
      await fetchProducts(); 
    } catch (error) { 
      console.error("Failed to toggle status", error); 
    }
  };

  // Extract numeric price from formatted string
  const getNumericPrice = (priceStr: string): number => {
    const numeric = priceStr.replace(/[₦,\s]/g, '');
    return parseFloat(numeric) || 0;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Products</h2>
          <p>Manage your inventory and visibility.</p>
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
                type="button" 
                className={`${styles.filterBtn} ${filter === status ? styles.active : ''}`} 
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className={styles.grid}>
          {filteredProducts.map(product => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <img 
                  src={product.img} 
                  alt={product.title} 
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'; 
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
                  <button 
                    type="button" 
                    onClick={() => handleEditClick(product)} 
                    className={styles.iconBtn} 
                    title="Edit"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDelete(product.id)} 
                    className={`${styles.iconBtn} ${styles.danger}`} 
                    title="Delete"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.top}>
                  <h3>{product.title}</h3>
                  <span className={styles.price}>₦{getNumericPrice(product.price).toLocaleString('en-NG')}</span>
                </div>
                <div className={styles.meta}>
                  <span className={styles.stock}>{product.stock} units</span>
                  <span className={styles.category}>{product.category}</span>
                </div>
                <div className={styles.actions}>
                  <button 
                    type="button" 
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
          <h3>No products found</h3>
        </div>
      )}
    </div>
  );
};

export default Products;