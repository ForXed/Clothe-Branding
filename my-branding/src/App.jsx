import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LandingPage from './LandingPage/LandingPage';
import BrutigePlatform from './Homepage/BrutigePlatform';
import SignInPage from './Form/SignInPage';
import SignUpPage from './Form/SignUpPage';
import MakerSignUp from './Form/MakerSignUp';
import ForgottenPassword from './Form/ForgottenPassword';
import VerifyPassword from './Form/VerifyPassword';
import MakerStudio from './MakerStudio/MakerStudio/MakerStudio';

// New Form Components
import ChangePasswordForm from './Form/ChangePasswordForm';
import TwoStepSetup from './Form/TwoFactorSetup';

// Hub Pages (Clean Names)
import HubLayout from './Hub/HubLayout';
import Collections from './Hub/Collections/Collections';
import Process from './Hub/Process/Process';
import Showcase from './Hub/ShowCase/ShowCase';
import FAQ from './Hub/FAQ/FAQ';
import Blog from './Hub/Blog/Blog';
import BlogPost from './Hub/Blog/BlogPost';
import Guides from './Hub/Guides/Guides';
import GuideDetail from './Hub/Guides/GuidesDetail';
import Support from './Hub/Support/Support';
import Privacy from './Hub/Legal/Privacy';
import Terms from './Hub/Legal/Terms';
import Cookies from './Hub/Legal/Cookies';

// Pricing Page (NEW IMPORT)
import Pricing from './Pricing/Pricing';

// Global Infrastructure Components
import Preloader from './Homepage/Preloader/Preloader';
import FloatingMessage from './Notification/FloatingMessage';

// Global Validation Helper
export const validateEmail = (email) => {
  return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

function App() {
  // --- GLOBAL STATE ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('brutige_theme') === 'dark';
  });
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: 'success', visible: false });

  // --- THEME SYNC ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('brutige_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // --- NOTIFICATION HANDLER ---
  const notify = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    // Auto-hide after 4 seconds
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000);
  };

  return (
    <Router>
      {/* 1. Global Notification Layer (Floats at bottom) */}
      <FloatingMessage 
        message={notification.message} 
        type={notification.type} 
        isVisible={notification.visible} 
      />

      <Routes>
        {/* 2. Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 3. Pricing Page (NEW ROUTE) */}
        <Route path="/pricing" element={<Pricing />} />

        {/* 4. Auth Flow - Passing 'notify' to every page */}
        <Route path="/login" element={<SignInPage notify={notify} />} />
        <Route path="/signup" element={<SignUpPage notify={notify} />} />
        <Route path="/maker-signup" element={<MakerSignUp notify={notify} />} />
        <Route path="/forgot-password" element={<ForgottenPassword notify={notify} />} />
        <Route path="/verify" element={<VerifyPassword notify={notify} />} />
        
        {/* 5. Account Management Forms (Modal Routes) */}
        <Route path="/change-password" element={<ChangePasswordForm notify={notify} />} />
        <Route path="/2fa-setup" element={<TwoStepSetup notify={notify} />} />

        {/* 6. MAKER STUDIO (Standalone Sub-Routes) */}
        <Route 
          path="/studio/*" 
          element={
            isAppLoading ? (
              <Preloader onComplete={() => setIsAppLoading(false)} />
            ) : (
              <MakerStudio isDarkMode={isDarkMode} toggleTheme={toggleTheme} notify={notify} />
            )
          } 
        />

        {/* 7. THE PLATFORM HUB (Shop, Chat, Profile) */}
        <Route 
          path="/platform/*" 
          element={
            isAppLoading ? (
              <Preloader onComplete={() => setIsAppLoading(false)} />
            ) : (
              <BrutigePlatform isDarkMode={isDarkMode} toggleTheme={toggleTheme} notify={notify} />
            )
          } 
        />

        {/* 8. THE RESOURCE HUB (Collections, Guides, Support, etc.) */}
        <Route 
          path="/hub" 
          element={
            isAppLoading ? (
              <Preloader onComplete={() => setIsAppLoading(false)} />
            ) : (
              <HubLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme} notify={notify} />
            )
          }
        >
          <Route index element={<Navigate to="collections" replace />} />
          <Route path="collections" element={<Collections />} />
          <Route path="process" element={<Process />} />
          <Route path="showcase" element={<Showcase />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="guides" element={<Guides />} />
          <Route path="guides/:slug" element={<GuideDetail />} />
          <Route path="support" element={<Support />} />
          
          {/* Legal Pages */}
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="cookies" element={<Cookies />} />
        </Route>

        {/* 9. Catch-all: Back to Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;