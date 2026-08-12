import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';

// Sidebar & Nav
import Sidebar from './DesktopSidebar/Sidebar';
import MobileNav from './MobileNav/MobileNav';
import HomeHeader from './HomeHeader/HomeHeader';

// ✅ NEW: Transform Flow Components
import MakerDiscoveryView from '../Transform/MakerDiscovery/MakerDiscoveryView';
import BriefsView from '../Transform/Briefs/BriefsView'

// Keep Components
import ChatRoom from './ChatRoom/ChatRoom';
import ProfileView from './ProfileView/ProfileView';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import OrdersView from './OrdersView/OrdersView';
import OrderTracker from './OrderTracker/OrderTracker';
import SearchView from './SearchView/SearchView';

// 🚫 ARCHIVED: We keep the imports so TypeScript doesn't complain, 
// but we remove their routes below so they are unreachable.
import CartView from './CartView/CartView';
import CheckoutView from '../Checkout/RegularCheckout/CheckoutView/CheckoutView';
import SavedView from './SavedView/SavedView';
import MasonryFeed from './HomeFeed/MasonryFeed';
import ProductDetail from './ProductDetail/ProductDetail';

import styles from './BrutigePlatform.module.css';
import { Product, CartItem, SavedItem } from './BrutigeContext/BrutigeContext';

interface BrutigePlatformProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  notify: (message: string, type?: 'success' | 'error' | 'info' | string) => void;
}

interface ProfileWrapperProps {
  userAvatar: string | null;
  setUserAvatar: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveTab: (tab: string) => void;
  onProductSelect: (product: Product) => void;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  avatar?: string | null;
}

const ProfileWrapper: React.FC<ProfileWrapperProps> = ({ 
  userAvatar, 
  setUserAvatar, 
  setActiveTab,
  onProductSelect 
}) => {
  const { makerId } = useParams<{ makerId: string }>();
  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    onProductSelect(product);
  };

  const handleMessageMaker = () => {
    navigate('/platform/chat');
  };

  return (
    <ProfileView 
      makerId={makerId || 'me'}
      userAvatar={userAvatar}
      setUserAvatar={setUserAvatar}
      onProductClick={handleProductClick}
      onMessageMaker={handleMessageMaker}
    />
  );
};

const BrutigePlatform: React.FC<BrutigePlatformProps> = ({ isDarkMode, toggleTheme, notify }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const pathSegments = location.pathname.split('/');
  // ✅ UPDATED: Default tab is now 'discovery' instead of 'shop'
  const currentTab: string = pathSegments[2] || 'discovery';

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [hideMobileNav, setHideMobileNav] = useState<boolean>(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // ✅ UPDATED: Default previous route is now discovery
  const [previousRoute, setPreviousRoute] = useState<string>('/platform/discovery');

  const [collections, setCollections] = useState<string[]>(['All', 'Streetwear', 'Minimalist', 'Summer Drop', 'Blueprints']);

  useEffect(() => {
    const savedProfile = localStorage.getItem('brutige_user_profile');
    if (savedProfile) {
      try { setUserProfile(JSON.parse(savedProfile)); } 
      catch (error) { console.error('Failed to parse user profile:', error); }
    }
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      const savedProfile = localStorage.getItem('brutige_user_profile');
      if (savedProfile) {
        try { setUserProfile(JSON.parse(savedProfile)); } 
        catch (error) { console.error('Failed to parse user profile:', error); }
      }
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  useEffect(() => {
    const state = location.state as { selectedProduct?: Product } | null;
    if (state?.selectedProduct) {
      setSelectedProduct(state.selectedProduct);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('brut_avatar');
    if (savedAvatar) setUserAvatar(savedAvatar);
  }, []);

  useEffect(() => {
    if (userAvatar) localStorage.setItem('brut_avatar', userAvatar);
  }, [userAvatar]);

  useEffect(() => {
    if (currentTab !== 'chat') {
      setHideMobileNav(false);
    }
  }, [currentTab]);

  const handleTabChange = (tabId: string) => {
    setSelectedProduct(null);
    setHideMobileNav(false); 
    navigate(`/platform/${tabId}`);
  };

  const goToStudio = () => {
    navigate('/studio');
  };

  const handleProductBack = () => {
    setSelectedProduct(null);
    if (previousRoute && previousRoute !== '/platform/discovery') {
      navigate(previousRoute);
    }
  };

  const handleProductSelect = (product: Product) => {
    setPreviousRoute(location.pathname + location.search);
    setSelectedProduct(product);
    // ✅ UPDATED: Navigate to discovery instead of shop
    if (location.pathname !== '/platform/discovery') {
      navigate('/platform/discovery');
    }
  };

  const addToCart = (product: Product, quantity: number = 1, size: string = 'M', color: string = 'Default') => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.size === size);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
        return updated;
      } else {
        return [...prev, { ...product, quantity, size, color }];
      }
    });
    if (notify) notify('Added to Loop', 'success');
  };

  const updateQuantity = (id: string | number, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      (item.id === id && item.size === size) ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: string | number, size: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const toggleSaved = (product: Product) => {
    setSavedItems(prev => {
      const isSaved = prev.some(item => item.id === product.id);
      if (!isSaved && notify) notify('Saved to Archive', 'success');
      return isSaved ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  };

  const clearCart = () => setCartItems([]);

  const handleCreateCollection = (newName: string): boolean => {
    if (newName && !collections.includes(newName)) {
      setCollections([...collections, newName]);
      if (notify) notify(`Collection "${newName}" created`, 'success');
      return true;
    }
    return false;
  };

  const handleMoveItem = (itemId: string | number, targetCollection: string) => {
    setSavedItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, collection: targetCollection } : item
    ));
    if (notify) notify(`Item moved to ${targetCollection}`, 'success');
  };

  const handleSetUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('brutige_user_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const showHeader = !selectedProduct && 
                     currentTab !== 'search' && 
                     currentTab !== 'chat' &&
                     !location.pathname.includes('/profile') &&
                     !location.pathname.includes('/settings') &&
                     !location.pathname.includes('/orders/track');

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
            userName={userProfile?.firstName || 'User'}
          />
        )}
        
        <div className={styles.viewport}>
          <Routes location={location}>
            {/* ✅ NEW: Default route is now discovery */}
            <Route path="/" element={<Navigate to="discovery" replace />} />
            
            {/* ✅ NEW: TRANSFORM Flow Routes */}
            <Route path="discovery" element={<MakerDiscoveryView />} />
            <Route path="briefs" element={<BriefsView />} />
            
            {/* ✅ KEEP: Untouched for now */}
            <Route path="search" element={<SearchView onSelect={handleProductSelect} />} />
            <Route path="chat" element={<ChatRoom initialData={location.state as any} onMobileNavChange={setHideMobileNav} />} />
            <Route path="profile/:makerId" element={<ProfileWrapper userAvatar={userAvatar} setUserAvatar={setUserAvatar} setActiveTab={handleTabChange} onProductSelect={handleProductSelect} />} />
            <Route path="profile" element={<ProfileView makerId="me" userAvatar={userAvatar} setUserAvatar={setUserAvatar} onProductClick={handleProductSelect} onMessageMaker={() => navigate('/platform/chat')} />} />
            <Route path="settings" element={<ProfileSettings userProfile={userProfile} setUserProfile={handleSetUserProfile} notify={notify} />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="orders/track/:orderId" element={<OrderTracker notify={notify} />} />
            
            {/* 🚫 ARCHIVE: Fenced off routes (redirect to discovery so old links don't break) */}
            <Route path="shop" element={<Navigate to="/platform/discovery" replace />} />
            <Route path="cart" element={<Navigate to="/platform/discovery" replace />} />
            <Route path="checkout" element={<Navigate to="/platform/discovery" replace />} />
            <Route path="saved" element={<Navigate to="/platform/discovery" replace />} />
            
            <Route path="*" element={<Navigate to="discovery" replace />} />
          </Routes>
        </div>
      </main>

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