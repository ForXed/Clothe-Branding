import React, { useState, useEffect } from 'react';
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

const BrutigePlatform = () => {
  const [activeTab, setActiveTab] = useState('shop');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [user, setUser] = useState({
    name: 'Brutige User',
    email: 'user@brutige.com',
    avatar: null
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('brutige_cart');
    const savedItemsList = localStorage.getItem('brutige_saved');
    const savedUser = localStorage.getItem('brutige_user');

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedItemsList) setSavedItems(JSON.parse(savedItemsList));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('brutige_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save saved items to localStorage
  useEffect(() => {
    localStorage.setItem('brutige_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  // Add to cart
  const addToCart = (product, quantity = 1, size = 'M') => {
    const existingItem = cartItems.find(
      item => item.id === product.id && item.size === size
    );

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity, size }]);
    }
  };

  // Remove from cart
  const removeFromCart = (productId, size) => {
    setCartItems(cartItems.filter(
      item => !(item.id === productId && item.size === size)
    ));
  };

  // Update cart quantity
  const updateCartQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      ));
    }
  };

  // Toggle saved item
  const toggleSaved = (product) => {
    const isSaved = savedItems.some(item => item.id === product.id);
    if (isSaved) {
      setSavedItems(savedItems.filter(item => item.id !== product.id));
    } else {
      setSavedItems([...savedItems, product]);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedProduct(null);
  };

  return (
    <div className={styles.platformWrapper}>
      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header - hide on product detail view */}
        {!selectedProduct && (
          <HomeHeader 
            activeTab={activeTab} 
            setActiveTab={handleTabChange}
            user={user}
          />
        )}
        
        <div className={styles.viewport}>
          {selectedProduct ? (
            <ProductDetail 
              product={selectedProduct} 
              onBack={() => setSelectedProduct(null)}
              addToCart={addToCart}
              isSaved={savedItems.some(item => item.id === selectedProduct.id)}
              toggleSaved={() => toggleSaved(selectedProduct)}
            />
          ) : (
            <>
              {activeTab === 'shop' && (
                <MasonryFeed 
                  onSelect={setSelectedProduct}
                  savedItems={savedItems}
                  toggleSaved={toggleSaved}
                  addToCart={addToCart}
                />
              )}
              {activeTab === 'chat' && <ChatRoom user={user} />}
              {activeTab === 'studio' && <MakerStudio user={user} />}
              {activeTab === 'cart' && (
                <CartView 
                  cartItems={cartItems}
                  updateQuantity={updateCartQuantity}
                  removeItem={removeFromCart}
                />
              )}
              {activeTab === 'profile' && <ProfileSettings user={user} setUser={setUser} />}
              {activeTab === 'settings' && <ProfileSettings user={user} setUser={setUser} />}
              {activeTab === 'orders' && <OrdersView />}
              {activeTab === 'saved' && (
                <SavedView 
                  savedItems={savedItems}
                  onSelect={setSelectedProduct}
                  toggleSaved={toggleSaved}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        cartCount={cartCount}
      />
    </div>
  );
};

export default BrutigePlatform;