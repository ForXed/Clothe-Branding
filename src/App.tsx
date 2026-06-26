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

// Hub Pages
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

// Pricing Page
import Pricing from "./Pricing/Pricing";

// Global Infrastructure Components
import Preloader from "./Homepage/Preloader/Preloader";
import FloatingMessage from "./Notification/FloatingMessage";
import MakerApplication from "./Form/MakerApplication";
import TwoFactorSetup from "./Form/TwoFactorSetup";

// --- Type Definitions ---
interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

type NotifyFunction = (
  message: string,
  type?: "success" | "error" | "info",
) => void;

// Global Validation Helper
export const validateEmail = (email: string): boolean => {
  const match = String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  return match !== null;
};

const App: React.FC = () => {
  // --- GLOBAL STATE ---
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("brutige_theme") === "dark";
  });
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "success",
    visible: false,
  });

  // --- THEME SYNC ---
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
    localStorage.setItem("brutige_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = (): void => setIsDarkMode((prev) => !prev);

  // --- NOTIFICATION HANDLER ---
  const notify: NotifyFunction = (message, type = "success") => {
    setNotification({ message, type, visible: true });
    setTimeout(
      () => setNotification((prev) => ({ ...prev, visible: false })),
      4000,
    );
  };

  return (
    <Router>
      {/* Global Notification Layer */}
      <FloatingMessage
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
      />

      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Pricing Page */}
        <Route path="/pricing" element={<Pricing />} />

        {/* Auth Flow - Only pass notify to components that accept it */}
        <Route path="/login" element={<SignInPage notify={notify} />} />
        <Route path="/signup" element={<SignUpPage notify={notify} />} />
        <Route path="/maker-signup" element={<MakerSignUp />} />
        <Route path="/forgot-password" element={<ForgottenPassword />} />
        <Route path="/verify" element={<VerifyPassword />} />
        <Route
          path="/maker-application"
          element={<MakerApplication notify={notify} />}
        />

        {/* Account Management Forms */}
        <Route
          path="/change-password"
          element={
            <ChangePasswordForm
              notify={notify}
              onClose={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
        <Route
          path="/2fa-setup"
          element={
            <TwoFactorSetup
              onClose={function (): void {
                throw new Error("Function not implemented.");
              }}
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
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
