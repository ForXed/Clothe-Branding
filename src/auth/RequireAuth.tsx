// src/auth/RequireAuth.tsx
// Route guard. Waits for the session bootstrap instead of flashing a redirect,
// sends anonymous visitors to /login (remembering where they were), and sends a
// signed-in account with the wrong role to its own home rather than to /login.
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useAuth } from './AuthContext';
import { homePathFor } from './homePath';
import type { UserRole } from '../types/auth';

interface RequireAuthProps {
  children: ReactNode;
  /** When given, the account must hold one of these roles. */
  roles?: UserRole[];
}

const SessionSplash: React.FC<{ label: string }> = ({ label }) => (
  <div
    role="status"
    aria-live="polite"
    style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'inherit',
      fontSize: '0.95rem',
      opacity: 0.7,
    }}
  >
    {label}
  </div>
);

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  roles,
}) => {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <SessionSplash label="Checking your session…" />;
  }

  if (status === 'anonymous' || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (roles && roles.length > 0 && !(user.role && roles.includes(user.role))) {
    return <Navigate to={homePathFor(user)} replace />;
  }

  return <>{children}</>;
};
