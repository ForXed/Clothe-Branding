// src/hooks/useAdminAuth.ts
// Protects /admin/* routes.
// In production: verifies ADMIN role via GET /authentication/me.
// In development with VITE_ADMIN_DEV_BYPASS=true: skips the API call
// so you can build and view the admin UI without a running backend.

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/adminService";
import { getErrorMessage } from "../utils/apiError";
import type { AuthUser } from "../types/auth";

/* ------------------------------------------------------------------ */
/* Dev bypass flag                                                     */
/* ------------------------------------------------------------------ */

const DEV_BYPASS =
  import.meta.env.VITE_ADMIN_DEV_BYPASS === "true" &&
  import.meta.env.DEV;

/* ------------------------------------------------------------------ */
/* Mock admin user for dev bypass                                      */
/* ------------------------------------------------------------------ */

const MOCK_ADMIN: AuthUser = {
  id: "dev-admin-001",
  email: "dev@brutige.local",
  firstName: "Dev",
  lastName: "Admin",
  isEmailVerified: true,
  roles: ["ADMIN"],
  avatarUrl: null,
};

/* ------------------------------------------------------------------ */
/* Hook return type                                                    */
/* ------------------------------------------------------------------ */

export interface UseAdminAuthReturn {
  admin: AuthUser | null;
  loading: boolean;
  error: string | null;
  isDevBypass: boolean;
  refresh: () => void;
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useAdminAuth(): UseAdminAuthReturn {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  const check = useCallback(async () => {
    /* -------------------------------------------------------------- */
    /* Dev bypass: skip API entirely                                   */
    /* -------------------------------------------------------------- */

    if (DEV_BYPASS) {
      setAdmin(MOCK_ADMIN);
      setError(null);
      setLoading(false);
      return;
    }

    /* -------------------------------------------------------------- */
    /* Real auth check                                                 */
    /* -------------------------------------------------------------- */

    const current = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const user = await adminService.getCurrentAdmin();

      if (current !== requestId.current) return;

      const roles = Array.isArray(user.roles) ? user.roles : [];
      const isAdmin = roles.includes("ADMIN");

      if (!isAdmin) {
        setError("You do not have admin access.");
        setAdmin(null);
        navigate("/login", { replace: true });
        return;
      }

      setAdmin(user);
    } catch (err) {
      if (current !== requestId.current) return;

      const message = getErrorMessage(
        err,
        "Could not verify admin session.",
      );

      setError(message);
      setAdmin(null);
      navigate("/login", { replace: true });
    } finally {
      if (current === requestId.current) {
        setLoading(false);
      }
    }
  }, [navigate]);

  useEffect(() => {
    void check();

    return () => {
      requestId.current += 1;
    };
  }, [check]);

  return {
    admin,
    loading,
    error,
    isDevBypass: DEV_BYPASS,
    refresh: () => void check(),
  };
}