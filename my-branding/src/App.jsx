import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LandingPage from './LandingPage/LandingPage';
import BrutigePlatform from './Homepage/BrutigePlatform';
import SignInPage from './Form/SignInPage';
import SignUpPage from './Form/SignUpPage';
import ForgottenPassword from './Form/ForgottenPassword';
import VerifyPassword from './Form/VerifyPassword';

// Global Validation Helper
export const validateEmail = (email) => {
  return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Pages */}
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgottenPassword />} />
        <Route path="/verify" element={<VerifyPassword />} />

        {/* THE PLATFORM: Wildcard /* is mandatory here */}
        <Route 
          path="/platform/*" 
          element={<BrutigePlatform isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;