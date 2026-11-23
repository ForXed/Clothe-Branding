// src/hooks/useAdminAuth.ts
// Protects /admin/* routes by reading the shared session (see auth/AuthContext).
//
// It used to call GET /authentication/me through adminService and then inspect a
// `roles` array; the real answer has a single `role` field, and the app boots that
// once now. The return shape is unchanged so the admin screens can adopt
// CurrentUser incrementally (F4).
//
// In development with VITE_ADMIN_DEV_BYPASS=true the API check is skipped so the
// admin UI can be built and viewed without a running backend.

import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import type { AuthUser } from "../types/auth";

const DEV_BYPASS =
  import.meta.env.VITE_ADMIN_DEV_BYPASS === "true" &&
  import.meta.env.DEV;

const MOCK_ADMIN: AuthUser = {
  id: "dev-admin-001",
  email: "dev@brutige.local",
  firstName: "Dev",
  lastName: "Admin",
  isEmailVerified: true,
  roles: ["ADMIN"],
  avatarUrl: null,
};

export interface UseAdminAuthReturn {
  admin: AuthUser | null;
  loading: boolean;
  error: string | null;
  isDevBypass: boolean;
  refresh: () => void;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const navigate = useNavigate();
  const { status, user, error, refresh } = useAuth();
  const redirected = useRef(false);

  const isAdmin = user?.role === "ADMIN";
  const loading = !DEV_BYPASS && status === "loading";

  useEffect(() => {
    if (DEV_BYPASS || redirected.current || status === "loading") return;

    if (status === "anonymous" || !isAdmin) {
      redirected.current = true;
      navigate("/login", { replace: true });
    }
  }, [isAdmin, navigate, status]);

  const refreshSession = useCallback((): void => {
    void refresh();
  }, [refresh]);

  if (DEV_BYPASS) {
    return {
      admin: MOCK_ADMIN,
      loading: false,
      error: null,
      isDevBypass: true,
      refresh: refreshSession,
    };
  }

  return {
    admin:
      user && isAdmin
        ? {
            id: user.id,
            email: user.email,
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            isEmailVerified: user.emailVerified,
            roles: user.role ? [user.role] : [],
            avatarUrl: null,
          }
        : null,
    loading,
    error:
      status === "authenticated" && !isAdmin
        ? "You do not have admin access."
        : error,
    isDevBypass: false,
    refresh: refreshSession,
  };
}
