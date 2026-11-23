// src/types/auth.ts
// Mirrors the v1.3 draft contract (docs/BRUTIGE_openapi_v1_3-draft.yaml).
// Auth is cookie based: the browser never sees the tokens, so "who am I" comes
// from GET /authentication/me instead of a decoded JWT.

export type UserRole = 'BUYER' | 'MAKER' | 'ADMIN';

/** Answer of `GET /api/v1/authentication/me` — the session bootstrap. */
export interface CurrentUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole | null;
  emailVerified: boolean;
  /** False for a Google-only account that never set a password. */
  hasPassword: boolean;
  googleAccount: boolean;
  /** True when a maker_profiles row exists, i.e. onboarding is done. */
  makerProfile: boolean;
}

/** @deprecated Legacy shape still used by the admin screens; F4 replaces it with CurrentUser. */
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  roles?: string[];
  avatarUrl?: string | null;
}

export interface MessageResponse {
  message: string;
}

export interface SignupResponse extends MessageResponse {
  success: boolean;
}

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Extract<UserRole, 'BUYER' | 'MAKER'>;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  /** 6-digit code emailed at signup. The email itself comes from the session cookie. */
  otp: string;
}

export interface ForgottenPasswordInput {
  email: string;
}

export interface VerifyForgottenPasswordInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
}
