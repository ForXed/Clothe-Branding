import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Pages
import LandingPage from './LandingPage/LandingPage';
import BrutigePlatform from './Homepage/BrutigePlatform';
import SignInPage from './Form/SignInPage';
import SignUpPage from './Form/SignUpPage';
import MakerSignUp from './Form/MakerSignUp';
import ForgottenPassword from './Form/ForgottenPassword';
import VerifyPassword from './Form/VerifyPassword';
import MakerStudio from './MakerStudio/MakerStudio';

// Form Components
import ChangePasswordForm from './Form/ChangePasswordForm';
import TwoFactorSetup from './Form/TwoFactorSetup';
import MakerApplication from './Form/MakerApplication';

// Hub Pages
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
import CustomOrderPolicy from './Hub/Legal/CustomOrderPolicy';


// Global Infrastructure Components
import Preloader from './Homepage/Preloader/Preloader';
import FloatingMessage from './Notification/FloatingMessage';

// --- Type Definitions ---
interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

type NotifyFunction = (message: string, type?: 'success' | 'error' | 'info') => void;

// Global Validation Helper
export const validateEmail = (email: string): boolean => {
  const match = String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  return match !== null;
};

interface AppRoutesProps {
  notify: NotifyFunction;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ notify, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  return (
    <>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Flow */}
        <Route path="/login" element={<SignInPage notify={notify} />} />
        <Route path="/signup" element={<SignUpPage notify={notify} />} />
        <Route path="/maker-signup" element={<MakerSignUp />} />
        <Route path="/forgot-password" element={<ForgottenPassword />} />
        <Route path="/verify" element={<VerifyPassword />} />
        <Route path="/maker-application" element={<MakerApplication notify={notify} />} />
        
        {/* Account Management Forms */}
        <Route 
          path="/change-password" 
          element={
            <ChangePasswordForm 
              notify={notify} 
              onClose={() => navigate('/studio/settings')}
            />
          } 
        />
        <Route 
          path="/2fa-setup" 
          element={
            <TwoFactorSetup 
              onClose={() => navigate('/studio/settings')}
              onSuccess={() => notify('2FA enabled successfully', 'success')}
            />
          } 
        />

    

        {/* MAKER STUDIO */}
        <Route 
          path="/studio/*" 
          element={
            isAppLoading ? (
              <Preloader onComplete={() => setIsAppLoading(false)} />
            ) : (
              <MakerStudio />
            )
          } 
        />

        {/* THE PLATFORM HUB */}
        <Route 
          path="/platform/*" 
          element={
            isAppLoading ? (
              <Preloader onComplete={() => setIsAppLoading(false)} />
            ) : (
              <BrutigePlatform 
                isDarkMode={isDarkMode} 
                toggleTheme={toggleTheme} 
                notify={notify as (message: string, type?: string) => void}
              />
            )
          } 
        />

        {/* THE RESOURCE HUB */}
        <Route 
          path="/hub" 
          element={
            isAppLoading ? (
              <Preloader onComplete={() => setIsAppLoading(false)} />
            ) : (
              <HubLayout />
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
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="cookies" element={<Cookies />} />
          <Route path="custom-order-policy" element={<CustomOrderPolicy />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

// ✅ Main App component - owns the theme state
const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('brutige_theme') === 'dark';
  });
  const [notification, setNotification] = useState<NotificationState>({ 
    message: '', 
    type: 'success', 
    visible: false 
  });

  const toggleTheme = (): void => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('brutige_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const notify: NotifyFunction = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000);
  };

  return (
    <Router>
      <FloatingMessage 
        message={notification.message} 
        type={notification.type} 
        isVisible={notification.visible} 
      />

      <AppRoutes 
        notify={notify}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    </Router>
  );
};

export default App;