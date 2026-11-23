// src/auth/AccountBadge.tsx
// Small, unobtrusive "who is signed in" pill with a sign-out action.
//
// There was no way to sign out anywhere in the app, which makes demoing the two
// sides of the marketplace (buyer, then maker) impossible in one browser session.
// This is deliberately not a redesign: one fixed corner element, and it renders
// nothing unless there is a session.
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from './AuthContext';

const AccountBadge: React.FC = () => {
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);

  if (status !== 'authenticated' || !user) return null;

  // The sign-in and callback screens have their own affordances.
  if (location.pathname === '/login' || location.pathname === '/oauth/callback') {
    return null;
  }

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  const handleLogout = async (): Promise<void> => {
    setBusy(true);

    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.6rem 0.4rem 0.75rem',
        borderRadius: '999px',
        background: 'rgba(20, 20, 22, 0.86)',
        color: '#f5f5f5',
        fontSize: '0.78rem',
        lineHeight: 1.2,
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.28)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <span style={{ opacity: 0.85 }}>
        {name}
        {user.role ? ` · ${user.role.toLowerCase()}` : ''}
      </span>
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={busy}
        style={{
          border: '1px solid rgba(255, 255, 255, 0.35)',
          background: 'transparent',
          color: 'inherit',
          borderRadius: '999px',
          padding: '0.15rem 0.55rem',
          fontSize: '0.72rem',
          cursor: busy ? 'progress' : 'pointer',
        }}
      >
        {busy ? 'signing out…' : 'sign out'}
      </button>
    </div>
  );
};

export default AccountBadge;
