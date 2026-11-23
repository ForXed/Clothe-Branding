// src/pages/OAuthCallback.tsx
// Landing page for the Google sign-in redirect.
//
// The backend finishes the OAuth exchange server side, sets the cookies and
// redirects the browser here (OAUTH_SUCCESS_REDIRECT_URL = /oauth/callback). There
// is no token in the URL: the only thing this page can do is ask /authentication/me
// who just signed in and route them.
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { homePathFor } from '../auth/homePath';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refresh } = useAuth();
  const [message, setMessage] = useState<string>('Finishing sign-in…');
  const started = useRef(false);

  const backendError = searchParams.get('error');

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (backendError) {
      setMessage('Google sign-in was cancelled or refused.');
      return;
    }

    let cancelled = false;

    void (async () => {
      const me = await refresh();

      if (cancelled) return;

      if (me) {
        navigate(homePathFor(me), { replace: true });
        return;
      }

      setMessage(
        'We could not find a session. The sign-in may have expired — please try again.',
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [backendError, navigate, refresh]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <p style={{ fontSize: '1rem', opacity: 0.85 }}>{message}</p>
      <Link to="/login" style={{ textDecoration: 'underline' }}>
        Back to sign in
      </Link>
    </div>
  );
};

export default OAuthCallback;
