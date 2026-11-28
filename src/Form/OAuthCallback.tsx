// src/Form/OAuthCallback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        // Backend sets auth cookies on redirect
        // Just navigate to discovery
        navigate('/platform/discovery');
      } catch (error) {
        console.error('OAuth callback failed:', error);
        navigate('/login');
      }
    };

    handleOAuthSuccess();
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontSize: '1.2rem'
    }}>
      Completing sign in...
    </div>
  );
};

export default OAuthCallback;