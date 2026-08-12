// src/MakerStudio/MakerStudio/MakerStudio.tsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Navigation
import StudioSideBar from './StudioSideBar/StudioSideBar';
import StudioHeader from './StudioHeader/StudioHeader';
import StudioMobileNav from './StudioMobileNav/StudioMobileNav';

// ✅ KEEP: Existing Studio Components
import OverView from './OverView/OverView';
import Order from './Order/Order';
import Messages from './Messages/Messages';
import Transaction from './Transaction/Transaction';
import StudioSettings from './StudioSettings/StudioSettings';
import Analytics from './Analytics/Analytics';
import ProModal from './ProModal/ProModal';

// ✅ NEW: Transform Flow Components
import BriefsView from '../../Transform/Briefs/BriefsView';
import QuotesView from '../../Transform/Quotes/QuotesView';

// 🚫 ARCHIVED: Keep imports so TypeScript doesn't complain, but remove routes
import AddProduct from './AddProduct/AddProduct';
import Products from './Products/Products';

// @ts-ignore
import useStudioData from '../../hooks/useStudioData';
import styles from './MakerStudio.module.css';

const MakerStudio: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => 
    document.documentElement.getAttribute('data-theme') === 'dark'
  );
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [hideMobileNav, setHideMobileNav] = useState<boolean>(false);
  
  const pathSegments = location.pathname.split('/');
  const currentTab = pathSegments[2] || 'overview';

  const studioData = useStudioData();

  const showStudioHeader = currentTab !== 'messages';

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleTabChange = (tabId: string) => {
    const proFeatures = ['transactions', 'analytics'];
    
    if (proFeatures.includes(tabId) && !isPro) {
      setShowProModal(true);
      return;
    }
    navigate(`/studio/${tabId}`);
  };

  // ✅ UPDATED: Navigate to discovery instead of shop
  const goToPlatform = () => navigate('/platform/discovery');

  useEffect(() => {
    if (currentTab !== 'messages') {
      setHideMobileNav(false);
    }
  }, [currentTab]);

  return (
    <div className={styles.studioWrapper} data-theme={isDarkMode ? 'dark' : 'light'}>
      <StudioSideBar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        activeTab={currentTab}
        setActiveTab={handleTabChange}
        goToPlatform={goToPlatform}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isPro={isPro}
        onUpgradeClick={() => setShowProModal(true)}
      />

      <main className={`${styles.mainContent} ${isCollapsed ? styles.contentExpanded : styles.contentContracted}`}>
        {showStudioHeader && (
          <StudioHeader 
            activeTab={currentTab}
            goToPlatform={goToPlatform}
            isPro={isPro}
          />
        )}
        
        <div className={styles.viewport}>
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            
            {/* ✅ KEEP: Existing routes */}
            <Route path="overview" element={<OverView {...studioData} />} />
            <Route path="orders" element={<Order {...studioData} />} />
            <Route 
              path="messages" 
              element={
                <Messages 
                  {...studioData} 
                  onMobileNavChange={setHideMobileNav}
                  isCollapsed={isCollapsed}
                /> 
              } 
            />
            <Route path="transactions" element={<Transaction {...studioData} />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<StudioSettings isPro={isPro} onUpgradeClick={() => setShowProModal(true)} />} />
            
            {/* ✅ NEW: Transform Flow Routes */}
            <Route path="briefs" element={<BriefsView />} />
            <Route path="quotes" element={<QuotesView />} />
            
            {/* 🚫 ARCHIVE: Fenced off routes (redirect to overview so old links don't break) */}
            <Route path="add-product" element={<Navigate to="/studio/overview" replace />} />
            <Route path="products" element={<Navigate to="/studio/overview" replace />} />
            
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </div>
      </main>

      {!hideMobileNav && (
        <StudioMobileNav 
          activeTab={currentTab} 
          setActiveTab={handleTabChange}
          goToPlatform={goToPlatform}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          isPro={isPro}
          onUpgradeClick={() => setShowProModal(true)} 
        />
      )}

      {showProModal && (
        <ProModal 
          onClose={() => setShowProModal(false)}
          onUpgrade={(planId) => { 
            setIsPro(true); 
            setShowProModal(false); 
          }}
        />
      )}
    </div>
  );
};

export default MakerStudio;