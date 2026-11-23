// src/services/apiClient.ts
//
// One axios instance for the whole app.
//
// - VITE_API_URL is the *origin* (e.g. http://localhost:8080); the /api/v1
//   version prefix lives here so no service has to remember it.
// - Auth is cookie based (accessToken / refreshToken, HttpOnly), so every
//   request needs withCredentials.
// - A 401 triggers exactly one refresh attempt, single-flight: concurrent
//   requests share the same refresh promise instead of stampeding the API.
// - Every failure is normalised into an ApiError carrying the API's own
//   envelope: { error, message, code, timestamp, details }.
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorBody } from '../types/error';

/** Origin only: http://localhost:8080 (a trailing /api/v1 in the env var is tolerated). */
export const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080')
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/, '');

/** Versioned API root: http://localhost:8080/api/v1 */
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;

/**
 * OAuth and the WebSocket live at the host root, not under /api/v1.
 * The Google button must point here so Spring Security can start the flow.
 */
export const OAUTH_BASE_URL = API_ORIGIN;

/** Endpoints that must never trigger the refresh-and-retry dance. */
const NO_REFRESH_PATHS = [
  '/authentication/login',
  '/authentication/signup',
  '/authentication/refresh',
  '/authentication/forgot',
  '/authentication/verify-forgotten',
  '/authentication/reset-password',
];

/** A request that the caller may retry after `refreshSession()` succeeds. */
type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export class ApiError extends Error {
  readonly status?: number;
  readonly code: string;
  readonly details?: Record<string, string> | null;
  readonly timestamp?: number;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      details?: Record<string, string> | null;
      timestamp?: number;
    } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code ?? 'UNKNOWN';
    this.details = options.details ?? null;
    this.timestamp = options.timestamp;
  }

  /** The user is not signed in (or their session just expired). */
  get isUnauthenticated(): boolean {
    return this.status === 401 || this.code === 'UNAUTHENTICATED';
  }

  /** Signed in, but not allowed to do this. */
  get isForbidden(): boolean {
    return this.status === 403 || this.code === 'ACCESS_DENIED';
  }

  /** First field-level validation message, when the API sent any. */
  get firstFieldError(): string | undefined {
    if (!this.details) return undefined;
    const first = Object.values(this.details)[0];
    return first ?? undefined;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  const axiosError = error as AxiosError<Partial<ApiErrorBody>>;
  const body = axiosError.response?.data;
  const status = axiosError.response?.status;

  if (body && typeof body.message === 'string') {
    return new ApiError(body.message, {
      status,
      code: body.code,
      details: body.details,
      timestamp: body.timestamp,
    });
  }

  if (axiosError.code === 'ERR_NETWORK') {
    return new ApiError(
      "Can't reach the server. Is the backend running on port 8080?",
      { code: 'NETWORK_ERROR' },
    );
  }

  return new ApiError(
    axiosError.message || 'Something went wrong. Please try again.',
    { status, code: 'UNKNOWN' },
  );
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
  // Do not set Content-Type globally: axios must be free to set
  // multipart/form-data (with its boundary) for uploads.
});

let refreshInFlight: Promise<void> | null = null;

/**
 * Renew the access cookie. Safe to call concurrently - callers share one request.
 * Throws an ApiError when the refresh token is gone or expired.
 */
export function refreshSession(): Promise<void> {
  if (!refreshInFlight) {
    refreshInFlight = axios
      .post(`${API_BASE_URL}/authentication/refresh`, {}, { withCredentials: true })
      .then(() => undefined)
      .catch((error: unknown) => {
        throw toApiError(error);
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const axiosError = error as AxiosError<Partial<ApiErrorBody>>;
    const config = axiosError.config as RetryableConfig | undefined;
    const url = config?.url ?? '';

    const canRetry =
      axiosError.response?.status === 401 &&
      !!config &&
      !config._retry &&
      !NO_REFRESH_PATHS.some((path) => url.includes(path));

    if (canRetry) {
      config._retry = true;
      try {
        await refreshSession();
        return apiClient(config as AxiosRequestConfig);
      } catch {
        // Fall through: report the original 401 so callers can redirect to /login.
      }
    }

    return Promise.reject(toApiError(axiosError));
  },
);

export default apiClient;
