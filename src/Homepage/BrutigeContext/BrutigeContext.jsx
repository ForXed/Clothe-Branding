import React, { createContext, useState, useContext, useEffect } from 'react';
import styles from './BrutigeContext.module.css';

const BrutigeContext = createContext();

export const BrutigeProvider = ({ children }) => {
  // --- 1. CORE STATE MANAGEMENT ---
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('brut_viewMode') || 'customer');
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('brut_cart')) || []);
  const [savedItems, setSavedItems] = useState(() => JSON.parse(localStorage.getItem('brut_saved')) || []);
  const [notifications, setNotifications] = useState([]);
  
  // --- 2. PRODUCT DATABASE ---
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('brut_products');
    return savedProducts ? JSON.parse(savedProducts) : [
        { 
          id: 1, title: "Oversized 'Brut' Tee", price: "$45.00", category: "Essentials", 
          description: "Heavyweight 300GSM organic cotton with a boxy architectural silhouette.",
          stock: 12, totalCapacity: 50, brandsBuilt: 124, 
          img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500" 
        },
        { 
          id: 2, title: "Infrastructure Hoodie", price: "$85.00", category: "Layering", 
          description: "450GSM French Terry. Double-stitched seams for maximum structural integrity.",
          stock: 5, totalCapacity: 20, brandsBuilt: 89, 
          img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500" 
        },
        { 
          id: 3, title: "Architectural Coat", price: "$210.00", category: "Outerwear", 
          description: "Wool-blend minimalist overcoat featuring hidden hardware and sharp lines.",
          stock: 2, totalCapacity: 10, brandsBuilt: 12, 
          img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500" 
        }
    ];
  });

  // --- 3. PERSISTENCE LAYER ---
  useEffect(() => {
    localStorage.setItem('brut_viewMode', viewMode);
    localStorage.setItem('brut_cart', JSON.stringify(cartItems));
    localStorage.setItem('brut_saved', JSON.stringify(savedItems));
    localStorage.setItem('brut_products', JSON.stringify(products));
  }, [viewMode, cartItems, savedItems, products]);

  // --- 4. MAKER ACTIONS ---
  const addProduct = (newProduct) => {
    const productWithMeta = {
      ...newProduct,
      id: Date.now(),
      brandsBuilt: 0,
      totalCapacity: newProduct.stock || 100,
      dateCreated: new Date().toISOString()
    };
    setProducts(prev => [productWithMeta, ...prev]);
    addNotification("New infrastructure template published.");
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addNotification("Template removed from catalog.");
  };

  // --- 5. CUSTOMER ACTIONS ---
  const toggleViewMode = () => {
    const newMode = viewMode === 'customer' ? 'maker' : 'customer';
    setViewMode(newMode);
    addNotification(`Switched to ${newMode} mode.`);
  };

  const addToCart = (product, quantity = 1, size = 'M', color = 'Black') => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id && item.size === size && item.color === color);
      if (exists) {
        return prev.map(item => item === exists ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity, size, color }];
    });
    addNotification(`${product.title} added to loop.`);
  };

  const toggleSaved = (product) => {
    setSavedItems(prev => {
      const isSaved = prev.some(item => item.id === product.id);
      if (isSaved) {
        addNotification("Removed from archive.");
        return prev.filter(item => item.id !== product.id);
      }
      addNotification("Template archived.");
      return [...prev, product];
    });
  };

  // --- 6. UTILITY: NOTIFICATIONS ---
  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <BrutigeContext.Provider value={{
      viewMode, toggleViewMode,
      products, addProduct, deleteProduct,
      cartItems, setCartItems, addToCart,
      savedItems, toggleSaved,
      notifications
    }}>
      {children}

      {/* GLOBAL TOAST CONTAINER */}
      <div className={styles.toastContainer}>
        {notifications.map(n => (
          <div key={n.id} className={styles.toast}>
            <div className={styles.dot} />
            {n.message}
          </div>
        ))}
      </div>
    </BrutigeContext.Provider>
  );
};

export const useBrutige = () => useContext(BrutigeContext);