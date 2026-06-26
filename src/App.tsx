import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import LandingPage from "./LandingPage/LandingPage";
import BrutigePlatform from "./Homepage/BrutigePlatform";
import SignInPage from "./Form/SignInPage";
import SignUpPage from "./Form/SignUpPage";
import MakerSignUp from "./Form/MakerSignUp";
import ForgottenPassword from "./Form/ForgottenPassword";
import VerifyPassword from "./Form/VerifyPassword";
import MakerStudio from "./MakerStudio/MakerStudio/MakerStudio";

// New Form Components
import ChangePasswordForm from "./Form/ChangePasswordForm";
import TwoStepSetup from "./Form/TwoFactorSetup";

<<<<<<< HEAD
// Hub Pages (Clean Names)
import HubLayout from "./Hub/HubLayout";
import Collections from "./Hub/Collections/Collections";
import Process from "./Hub/Process/Process";
import Showcase from "./Hub/ShowCase/ShowCase";
import FAQ from "./Hub/FAQ/FAQ";
import Blog from "./Hub/Blog/Blog";
import BlogPost from "./Hub/Blog/BlogPost";
import Guides from "./Hub/Guides/Guides";
import GuideDetail from "./Hub/Guides/GuidesDetail";
import Support from "./Hub/Support/Support";
import Privacy from "./Hub/Legal/Privacy";
import Terms from "./Hub/Legal/Terms";
import Cookies from "./Hub/Legal/Cookies";

// Pricing Page (NEW IMPORT)
import Pricing from "./Pricing/Pricing";

// Global Infrastructure Components
import Preloader from "./Homepage/Preloader/Preloader";
import FloatingMessage from "./Notification/FloatingMessage";

// Global Validation Helper
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
=======
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

// Pricing Page
import Pricing from './Pricing/Pricing';

// Global Infrastructure Components
import Preloader from './Homepage/Preloader/Preloader';
import FloatingMessage from './Notification/FloatingMessage';
import MakerApplication from './Form/MakerApplication';
import TwoFactorSetup from './Form/TwoFactorSetup';

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
>>>>>>> origin/dev
};

const App: React.FC = () => {
  // --- GLOBAL STATE ---
<<<<<<< HEAD
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("brutige_theme") === "dark";
  });
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [notification, setNotification] = useState({
    message: "",
    type: "success",
    visible: false,
=======
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('brutige_theme') === 'dark';
  });
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<NotificationState>({ 
    message: '', 
    type: 'success', 
    visible: false 
>>>>>>> origin/dev
  });

  // --- THEME SYNC ---
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
    localStorage.setItem("brutige_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

<<<<<<< HEAD
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // --- NOTIFICATION HANDLER ---
  const notify = (message, type = "success") => {
    setNotification({ message, type, visible: true });
    // Auto-hide after 4 seconds
    setTimeout(
      () => setNotification((prev) => ({ ...prev, visible: false })),
      4000,
    );
=======
  const toggleTheme = (): void => setIsDarkMode(prev => !prev);

  // --- NOTIFICATION HANDLER ---
  const notify: NotifyFunction = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000);
>>>>>>> origin/dev
  };

  return (
    <Router>
<<<<<<< HEAD
      {/* 1. Global Notification Layer (Floats at bottom) */}
      <FloatingMessage
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
=======
      {/* Global Notification Layer */}
      <FloatingMessage 
        message={notification.message} 
        type={notification.type} 
        isVisible={notification.visible} 
>>>>>>> origin/dev
      />

      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Pricing Page */}
        <Route path="/pricing" element={<Pricing />} />

        {/* Auth Flow - Only pass notify to components that accept it */}
        <Route path="/login" element={<SignInPage notify={notify} />} />
        <Route path="/signup" element={<SignUpPage notify={notify} />} />
<<<<<<< HEAD
        <Route path="/maker-signup" element={<MakerSignUp notify={notify} />} />
        <Route
          path="/forgot-password"
          element={<ForgottenPassword notify={notify} />}
        />
        <Route path="/verify" element={<VerifyPassword notify={notify} />} />

        {/* 5. Account Management Forms (Modal Routes) */}
        <Route
          path="/change-password"
          element={<ChangePasswordForm notify={notify} />}
        />
        <Route path="/2fa-setup" element={<TwoStepSetup notify={notify} />} />

        {/* 6. MAKER STUDIO (Standalone Sub-Routes) */}
        <Route
          path="/studio/*"
=======
        <Route path="/maker-signup" element={<MakerSignUp />} />
        <Route path="/forgot-password" element={<ForgottenPassword />} />
        <Route path="/verify" element={<VerifyPassword />} />
        <Route path="/maker-application" element={<MakerApplication notify={notify} />} />
        
        {/* Account Management Forms */}
        <Route path="/change-password" element={<ChangePasswordForm notify={notify} onClose={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route path="/2fa-setup" element={<TwoFactorSetup onClose={function (): void {
          throw new Error('Function not implemented.');
        } } />} />

        {/* MAKER STUDIO */}
        <Route 
          path="/studio/*" 
>>>>>>> origin/dev
          element={
            isAppLoading ? (
              <Preloader onComplete={() => setIsAppLoading(false)} />
            ) : (
<<<<<<< HEAD
              <MakerStudio
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                notify={notify}
              />
=======
              <MakerStudio />
>>>>>>> origin/dev
            )
          }
        />

<<<<<<< HEAD
        {/* 7. THE PLATFORM HUB (Shop, Chat, Profile) */}

        <Route
          path="/platform/*"
=======
        {/* THE PLATFORM HUB */}
        <Route 
          path="/platform/*" 
>>>>>>> origin/dev
          element={
            isAppLoading ? (
              <Preloader onComplete={() => setIsAppLoading(false)} />
            ) : (
<<<<<<< HEAD
              <BrutigePlatform
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                notify={notify}
              />
=======
              <BrutigePlatform isDarkMode={isDarkMode} toggleTheme={toggleTheme} notify={notify as (message: string, type?: string) => void} />
>>>>>>> origin/dev
            )
          }
        />

<<<<<<< HEAD
        {/* 8. THE RESOURCE HUB (Collections, Guides, Support, etc.) */}
        <Route
          path="/hub"
=======
        {/* THE RESOURCE HUB */}
        <Route 
          path="/hub" 
>>>>>>> origin/dev
          element={
            isAppLoading ? (
              <Preloader onComplete={() => setIsAppLoading(false)} />
            ) : (
<<<<<<< HEAD
              <HubLayout
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                notify={notify}
              />
=======
              <HubLayout />
>>>>>>> origin/dev
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
<<<<<<< HEAD

          {/* Legal Pages */}
=======
>>>>>>> origin/dev
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="cookies" element={<Cookies />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
