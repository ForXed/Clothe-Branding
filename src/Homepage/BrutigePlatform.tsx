import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import Sidebar from './DesktopSidebar/Sidebar';
import MobileNav from './MobileNav/MobileNav';
import HomeHeader from './HomeHeader/HomeHeader';
import MasonryFeed from './HomeFeed/MasonryFeed';
import ProductDetail from './ProductDetail/ProductDetail';
import ChatRoom from './ChatRoom/ChatRoom';
import ProfileView from './ProfileView/ProfileView';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import CartView from './CartView/CartView';
import CheckoutView from './CheckoutView/CheckoutView';
import OrdersView from './OrdersView/OrdersView';
import OrderTracker from './OrderTracker/OrderTracker';
import SavedView from './SavedView/SavedView';
import SearchView from './SearchView/SearchView';
import styles from './BrutigePlatform.module.css';

// Wrapper component to handle URL params for Profile
const ProfileWrapper = ({ userAvatar, setUserAvatar, setActiveTab }) => {
  const { makerId } = useParams();
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/platform/shop`, { state: { selectedProduct: product } });
  };

  const handleMessageMaker = () => {
    navigate('/platform/chat');
  };

  return (
    <ProfileView 
      makerId={makerId}
      userAvatar={userAvatar}
      setUserAvatar={setUserAvatar}
      onProductClick={handleProductClick}
      onMessageMaker={handleMessageMaker}
    />
  );
};

const BrutigePlatform = ({ isDarkMode, toggleTheme, notify }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const pathSegments = location.pathname.split('/');
  const currentTab = pathSegments[2] || 'shop';

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [userAvatar, setUserAvatar] = useState(null);
  
  // --- STATE: Control Mobile Nav Visibility ---
  // Default to false (visible). ChatRoom will set this to true (hidden) when a chat is open.
  const [hideMobileNav, setHideMobileNav] = useState(false);

  // --- COLLECTIONS STATE ---
  const [collections, setCollections] = useState(['All', 'Streetwear', 'Minimalist', 'Summer Drop', 'Blueprints']);

  // Handle product selection from navigation state
  useEffect(() => {
    if (location.state?.selectedProduct) {
      setSelectedProduct(location.state.selectedProduct);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Load avatar from local storage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('brut_avatar');
    if (savedAvatar) setUserAvatar(savedAvatar);
  }, []);

  // Save avatar to local storage
  useEffect(() => {
    if (userAvatar) localStorage.setItem('brut_avatar', userAvatar);
  }, [userAvatar]);

  // --- SAFEGUARD: Reset Mobile Nav when leaving Chat Tab ---
  // If the user navigates away from 'chat' entirely, ensure the nav bar comes back.
  useEffect(() => {
    if (currentTab !== 'chat') {
      setHideMobileNav(false);
    }
  }, [currentTab]);

  const handleTabChange = (tabId) => {
    setSelectedProduct(null);
    setHideMobileNav(false); // Reset nav visibility on manual tab change
    navigate(`/platform/${tabId}`);
  };

  const goToStudio = () => {
    navigate('/studio');
  };

  // --- CART LOGIC ---
  const addToCart = (product, quantity = 1, size = 'M', color = 'Default') => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.size === size);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prev, { ...product, quantity, size, color }];
      }
    });
    if (notify) notify('Added to Loop', 'success');
  };

  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      (item.id === id && item.size === size) 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const removeItem = (id, size) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === id && item.size === size)
    ));
  };

  const toggleSaved = (product) => {
    setSavedItems(prev => {
      const isSaved = prev.some(item => item.id === product.id);
      if (!isSaved && notify) notify('Saved to Archive', 'success');
      return isSaved ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // --- COLLECTION HANDLERS ---
  const handleCreateCollection = (newName) => {
    if (newName && !collections.includes(newName)) {
      setCollections([...collections, newName]);
      if (notify) notify(`Collection "${newName}" created`, 'success');
      return true;
    }
    return false;
  };

  const handleMoveItem = (itemId, targetCollection) => {
    setSavedItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, collection: targetCollection } 
        : item
    ));
    if (notify) notify(`Item moved to ${targetCollection}`, 'success');
  };

  // Determine if we should show header
  // Hides header for 'chat' because ChatRoom has its own internal header
  const showHeader = !selectedProduct && 
                     currentTab !== 'search' && 
                     currentTab !== 'chat' &&
                     !location.pathname.includes('/profile') &&
                     !location.pathname.includes('/settings') &&
                     !location.pathname.includes('/orders/track') &&
                     !location.pathname.includes('/checkout');

  return (
    <div className={styles.platformWrapper}>
      <Sidebar 
        activeTab={currentTab} 
        setActiveTab={handleTabChange}
        goToStudio={goToStudio}
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
      />

      <main className={styles.mainContent}>
        {showHeader && (
          <HomeHeader 
            activeTab={currentTab} 
            setActiveTab={handleTabChange} 
            cartCount={cartItems.length}
            userAvatar={userAvatar}
            userName="User"
          />
        )}
        
        <div className={styles.viewport}>
          <Routes location={location}>
            <Route path="/" element={<Navigate to="shop" replace />} />
            
            <Route path="shop" element={
               selectedProduct ? (
                 <ProductDetail 
                    product={selectedProduct} 
                    onBack={() => setSelectedProduct(null)} 
                    addToCart={addToCart} 
                    isSaved={savedItems.some(i => i.id === selectedProduct.id)} 
                    toggleSaved={() => toggleSaved(selectedProduct)}
                 />
               ) : (
                 <MasonryFeed 
                   onSelect={setSelectedProduct} 
                   savedItems={savedItems} 
                   toggleSaved={toggleSaved} 
                   addToCart={addToCart} 
                 />
               )
            } />
            
            <Route path="search" element={<SearchView onSelect={setSelectedProduct} />} />
            
            {/* Pass the state setter to ChatRoom */}
            <Route 
              path="chat" 
              element={
                <ChatRoom 
                  initialData={location.state} 
                  onMobileNavChange={setHideMobileNav} 
                /> 
              } 
            />
            
            <Route 
              path="profile/:makerId" 
              element={
                <ProfileWrapper 
                  userAvatar={userAvatar}
                  setUserAvatar={setUserAvatar}
                  setActiveTab={handleTabChange}
                />
              } 
            />
            
            <Route 
              path="profile" 
              element={
                <ProfileView 
                  makerId="me" 
                  userAvatar={userAvatar}
                  setUserAvatar={setUserAvatar}
                  onProductClick={(p) => console.log(p)}
                  onMessageMaker={() => navigate('/platform/chat')}
                />
              } 
            />
            
            <Route 
              path="settings" 
              element={
                <ProfileSettings 
                  userProfile={{ avatar: userAvatar }}
                  setUserProfile={(data) => setUserAvatar(data.avatar)}
                />
              } 
            />
            
            <Route 
              path="cart" 
              element={
                <CartView 
                  cartItems={cartItems} 
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  toggleSaved={toggleSaved}
                /> 
              } 
            />

            <Route 
              path="checkout" 
              element={
                <CheckoutView 
                  cartItems={cartItems}
                  clearCart={clearCart}
                  notify={notify}
                  onComplete={() => navigate('/orders')}
                /> 
              } 
            />
            
            <Route path="orders" element={<OrdersView />} />
            
            <Route path="orders/track/:orderId" element={<OrderTracker notify={notify} />} />
            
            <Route path="saved" element={
              <SavedView 
                savedItems={savedItems} 
                collections={collections}
                onCreateCollection={handleCreateCollection}
                onMoveItem={handleMoveItem}
                onSelect={setSelectedProduct} 
                toggleSaved={toggleSaved} 
                addToCart={addToCart}
              />
            } />
          </Routes>
        </div>
      </main>

      {/* Conditionally render MobileNav based on hideMobileNav state */}
      {!hideMobileNav && (
        <MobileNav 
          activeTab={currentTab} 
          setActiveTab={handleTabChange}
          goToStudio={goToStudio}
          cartCount={cartItems.length} 
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  );
};

export default BrutigePlatform;