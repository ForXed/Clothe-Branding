import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// The landing page and the auth forms are the entry points everyone pays for, so they
// stay in the main bundle. Everything else is a separate chunk that loads on first visit.

// Pages
import LandingPage from './LandingPage/LandingPage';
import SignInPage from './Form/SignInPage';
import SignUpPage from './Form/SignUpPage';
import MakerSignUp from './Form/MakerSignUp';
import VerifyPassword from './Form/VerifyPassword';
import ResetPassword from './Form/ResetPassword';

const BrutigePlatform = lazy(() => import('./Homepage/BrutigePlatform'));
const MakerStudio = lazy(() => import('./MakerStudio/MakerStudio'));

// Form Components
import ChangePasswordForm from './Form/ChangePasswordForm';
import MakerApplication from './Form/MakerApplication';

// Hub Pages
const HubLayout = lazy(() => import('./Hub/HubLayout'));
const Collections = lazy(() => import('./Hub/Collections/Collections'));
const Process = lazy(() => import('./Hub/Process/Process'));
const Showcase = lazy(() => import('./Hub/ShowCase/ShowCase'));
const FAQ = lazy(() => import('./Hub/FAQ/FAQ'));
const Blog = lazy(() => import('./Hub/Blog/Blog'));
const BlogPost = lazy(() => import('./Hub/Blog/BlogPost'));
const Guides = lazy(() => import('./Hub/Guides/Guides'));
const GuideDetail = lazy(() => import('./Hub/Guides/GuidesDetail'));
const Support = lazy(() => import('./Hub/Support/Support'));
const Privacy = lazy(() => import('./Hub/Legal/Privacy'));
const Terms = lazy(() => import('./Hub/Legal/Terms'));
const Cookies = lazy(() => import('./Hub/Legal/Cookies'));
const CustomOrderPolicy = lazy(() => import('./Hub/Legal/CustomOrderPolicy'));

// Admin
const AdminLayout = lazy(() => import('./Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./Admin/AdminDashboard'));
const MakerList = lazy(() => import('./Admin/Makers/MakerList'));
const MakerDetail = lazy(() => import('./Admin/Makers/MakerDetail'));
const DisputeList = lazy(() => import('./Admin/Disputes/DisputeList'));
const DisputeDetail = lazy(() => import('./Admin/Disputes/DisputeDetail'));
const OrderList = lazy(() => import('./Admin/Orders/OrderList'));
const AdminOrderDetail = lazy(() => import('./Admin/Orders/AdminOrderDetail'));
const UserList = lazy(() => import('./Admin/Users/UserList'));

// Global Infrastructure Components
import Preloader from './Homepage/Preloader/Preloader';
import FloatingMessage from './Notification/FloatingMessage';

// Session + route guards
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
import { ADMIN_ROLES, STUDIO_ROLES } from './auth/homePath';
import OAuthCallback from './pages/OAuthCallback';
import AccountBadge from './auth/AccountBadge';
import RouteFallback from './pages/RouteFallback';
import RouteErrorBoundary from './pages/RouteErrorBoundary';

// --- Type Definitions ---
interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

type NotifyFunction = (
  message: string,
  type?: 'success' | 'error' | 'info',
) => void;

interface AppRoutesProps {
  notify: NotifyFunction;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  notify,
  isDarkMode,
  toggleTheme,
}) => {
  const navigate = useNavigate();
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  return (
    <>
      <RouteErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Flow */}
        <Route path="/login" element={<SignInPage notify={notify} />} />
        <Route path="/signup" element={<SignUpPage notify={notify} />} />
        <Route path="/maker-signup" element={<MakerSignUp />} />
        <Route path="/verify-email" element={<VerifyPassword />} />
        <Route path="/reset-password" element={<ResetPassword notify={notify} />} />
        <Route path="/maker-application" element={<MakerApplication notify={notify} />} />

        {/* Now backed by the two-step reset (forgotten-password -> verify -> reset). */}
        <Route
          path="/change-password"
          element={
            <RequireAuth>
              <ChangePasswordForm
                notify={notify}
                onClose={() => navigate('/platform')}
              />
            </RequireAuth>
          }
        />


        {/* Google sign-in lands here: the backend already set the cookies. */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* MAKER STUDIO */}
        <Route
          path="/studio/*"
          element={
            <RequireAuth roles={STUDIO_ROLES}>
              {isAppLoading ? (
                <Preloader onComplete={() => setIsAppLoading(false)} />
              ) : (
                <MakerStudio />
              )}
            </RequireAuth>
          }
        />

        {/* THE PLATFORM HUB */}
        <Route
          path="/platform/*"
          element={
            <RequireAuth>
              {isAppLoading ? (
                <Preloader onComplete={() => setIsAppLoading(false)} />
              ) : (
                <BrutigePlatform
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  notify={notify as (message: string, type?: string) => void}
                />
              )}
            </RequireAuth>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth roles={ADMIN_ROLES}>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="makers" element={<MakerList />} />
          <Route path="makers/:makerId" element={<MakerDetail />} />
          <Route path="disputes" element={<DisputeList />} />
          <Route path="disputes/:orderId" element={<DisputeDetail />} />
          <Route path="orders" element={<OrderList />} />
                <Route path="orders/:orderId" element={<AdminOrderDetail />} />
          <Route path="users" element={<UserList />} />
        </Route>

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
      </Suspense>
      </RouteErrorBoundary>
    </>
  );
};

// Main App component - owns the theme state
const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('brutige_theme') === 'dark';
  });

  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'success',
    visible: false,
  });

  const toggleTheme = (): void => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light',
    );
    localStorage.setItem('brutige_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const notify: NotifyFunction = (message, type = 'success') => {
    setNotification({ message, type, visible: true });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  return (
    <Router>
      {/* Global Notification Layer */}
      <FloatingMessage
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
      />

      {/* Session state has to sit inside the Router: the guards round-trip. */}
      <AuthProvider>
        {/* Session badge + sign out, so both sides of the marketplace can be
            demoed in one browser without clearing cookies by hand. */}
        <AccountBadge />

        {/* Pass theme state down to AppRoutes */}
        <AppRoutes
          notify={notify}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      </AuthProvider>
    </Router>
  );
};

export default App;