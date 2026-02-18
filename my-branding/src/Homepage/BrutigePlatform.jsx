import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './DesktopSidebar/Sidebar';
import MobileNav from './MobileNav/MobileNav';
import HomeHeader from './HomeHeader/HomeHeader';
import MasonryFeed from './HomeFeed/MasonryFeed';
import ProductDetail from './ProductDetail/ProductDetail';
import MakerStudio from './MakerStudio/MakerStudio';
import ChatRoom from './ChatRoom/ChatRoom';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import CartView from './CartView/CartView';
import OrdersView from './OrdersView/OrdersView';
import SavedView from './SavedView/SavedView';
import styles from './BrutigePlatform.module.css';

const BrutigePlatform = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'shop';

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);

  // Navigation logic
  const handleTabChange = (tabId) => {
    setSelectedProduct(null);
    navigate(`/platform/${tabId}`);
  };

  // Cart Functions
  const addToCart = (product, quantity = 1, size = 'M') => {
    setCartItems(prev => [...prev, { ...product, quantity, size }]);
    alert("Added to branding loop.");
  };

  const removeItem = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, delta) => {
    setCartItems(prev => prev.map(item => 
      (item.id === id && item.size === size) ? { ...item, quantity: Math.max(1, delta) } : item
    ));
  };

  const toggleSaved = (product) => {
    setSavedItems(prev => {
      const isSaved = prev.some(item => item.id === product.id);
      return isSaved ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  };

  return (
    <div className={styles.platformWrapper}>
      <Sidebar activeTab={currentTab} setActiveTab={handleTabChange} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className={styles.mainContent}>
        {!selectedProduct && <HomeHeader activeTab={currentTab} setActiveTab={handleTabChange} />}
        
        <div className={styles.viewport}>
          <Routes>
            <Route path="/" element={<Navigate to="shop" replace />} />
            <Route path="shop" element={
               selectedProduct ? (
                 <ProductDetail 
                    product={selectedProduct} onBack={() => setSelectedProduct(null)} 
                    addToCart={addToCart} isSaved={savedItems.some(i => i.id === selectedProduct.id)} toggleSaved={() => toggleSaved(selectedProduct)}
                 />
               ) : (
                 <MasonryFeed onSelect={setSelectedProduct} savedItems={savedItems} toggleSaved={toggleSaved} addToCart={addToCart} />
               )
            } />
            <Route path="chat" element={<ChatRoom />} />
            <Route path="studio" element={<MakerStudio />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="cart" element={<CartView cartItems={cartItems} removeItem={removeItem} updateQuantity={updateQuantity} />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="saved" element={<SavedView savedItems={savedItems} onSelect={setSelectedProduct} toggleSaved={toggleSaved} />} />
          </Routes>
        </div>
      </main>

      <MobileNav activeTab={currentTab} setActiveTab={handleTabChange} cartCount={cartItems.length} />
    </div>
  );
};

export default BrutigePlatform;