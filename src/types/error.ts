// src/types/error.ts

/**
 * The single error envelope the API returns for every failure:
 *
 *   { "error": "Bad Request", "message": "…", "code": "VALIDATION_FAILED",
 *     "timestamp": 1795406398882, "details": { "field": "message" } }
 *
 * `error` is the HTTP reason phrase, `code` is the stable machine value the
 * client should branch on, `details` only appears on validation failures.
 * See BrutigeBackend/docs/API_HANDOFF.md.
 */
export interface ApiErrorBody {
  error: string;
  message: string;
  code: string;
  timestamp: number;
  details?: Record<string, string> | null;
}

/** Error codes the client branches on (not exhaustive - the API may add more). */
export const ApiErrorCode = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  MALFORMED_JSON: 'MALFORMED_JSON',
  MISSING_PART: 'MISSING_PART',
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  ACCESS_DENIED: 'ACCESS_DENIED',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  OTP_STILL_VALID: 'OTP_STILL_VALID',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  OAUTH_ONLY_ACCOUNT: 'OAUTH_ONLY_ACCOUNT',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_USER_DATA: 'INVALID_USER_DATA',
  EMAIL_SENDING_FAILED: 'EMAIL_SENDING_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ApiErrorCodeValue = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];
