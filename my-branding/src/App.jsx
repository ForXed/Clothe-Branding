import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './Form/SignInPage';
import SignUp from './Form/SignUpPage';
import ForgottenPassword from './Form/ForgottenPassword';
import VerifyPassword from './Form/VerifyPassword';
import LandingPage from './LandingPage/LandingPage';
import BrutigePlatform from './Homepage/BrutigePlatform';

function App() {
  return (
    <LandingPage />
    // <BrutigePlatform />
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<SignIn />} />
    //     <Route path="/signup" element={<SignUp />} />
    //     <Route path="/forgot-password" element={<ForgottenPassword />} />
    //     <Route path="/verify" element={<VerifyPassword />} />
    //     <Route path="*" element={<Navigate to="/login" />} />
    //   </Routes>
    // </Router>
  );
}

// Validation Helper used in Components
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

export default App; 