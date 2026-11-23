// src/auth/AuthContext.tsx
// Session state for the whole app.
//
// The API issues HttpOnly cookies, so the browser cannot read the token. The only
// way to know who is signed in is GET /api/v1/authentication/me, which the backend
// answers from those cookies. That is why this provider is the single source of
// truth: it calls /me once on boot, re-calls it after login and after the OAuth
// redirect, and clears itself on logout.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { toApiError } from '../services/apiClient';
import { authService } from '../services/authService';
import type {
  CurrentUser,
  LoginInput,
  SignupInput,
  SignupResponse,
  UserRole,
} from '../types/auth';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export interface AuthContextValue {
  status: AuthStatus;
  user: CurrentUser | null;
  /** Friendly message for the last failed /me call, if any. */
  error: string | null;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
  /** Re-read the session from the API. Resolves to the user, or null. */
  refresh: () => Promise<CurrentUser | null>;
  /** Signs in and loads the identity afterwards. */
  login: (input: LoginInput) => Promise<CurrentUser>;
  /** Creates an account (email still unverified) and returns the API answer. */
  signup: (input: SignupInput) => Promise<SignupResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Guards against a stale /me answer overwriting a newer one (React 18 strict
  // mode mounts twice, and logout can race an in-flight refresh).
  const requestId = useRef(0);

  const applyUser = useCallback((next: CurrentUser | null) => {
    setUser(next);
    setStatus(next ? 'authenticated' : 'anonymous');
  }, []);

  const refresh = useCallback(async (): Promise<CurrentUser | null> => {
    const current = ++requestId.current;

    try {
      const me = await authService.getMe();
      if (current !== requestId.current) return me;
      setError(null);
      applyUser(me);
      return me;
    } catch (err) {
      if (current !== requestId.current) return null;

      const apiError = toApiError(err);

      // 401 is the normal "nobody is signed in" answer, not a problem to show.
      if (apiError.isUnauthenticated) {
        setError(null);
        applyUser(null);
        return null;
      }

      setError(apiError.message);
      applyUser(null);
      return null;
    }
  }, [applyUser]);

  const login = useCallback(
    async (input: LoginInput): Promise<CurrentUser> => {
      await authService.login(input);

      // Tokens are cookies; the identity has to be fetched.
      const me = await refresh();

      if (!me) {
        throw new Error(
          'Signed in, but the session could not be read. Please try again.',
        );
      }

      return me;
    },
    [refresh],
  );

  const signup = useCallback(
    async (input: SignupInput): Promise<SignupResponse> =>
      authService.signup(input),
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    requestId.current += 1;

    try {
      await authService.logout();
    } finally {
      setError(null);
      applyUser(null);
    }
  }, [applyUser]);

  useEffect(() => {
    void refresh();

    return () => {
      requestId.current += 1;
    };
  }, [refresh]);

  const hasRole = useCallback(
    (...roles: UserRole[]): boolean => Boolean(user?.role && roles.includes(user.role)),
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      isAuthenticated: status === 'authenticated',
      hasRole,
      refresh,
      login,
      signup,
      logout,
    }),
    [status, user, error, hasRole, refresh, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }

  return context;
}
