// src/types/auth.ts
// Derived from v1.2 authentication controller responses (cookie-based, OTP).

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  roles?: string[];        // ⚠️ CONFIRM — contract mentions ADMIN self-assign rejection
  avatarUrl?: string | null; // ⚠️ CONFIRM — avatar field still unconfirmed from earlier
}

export interface AuthResponse {
  user: AuthUser;
  message?: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  otp: string; // 6-digit code
}

export interface ResendOtpInput {
  email: string;
}

export interface ForgottenPasswordInput {
  email: string;
}

export interface VerifyForgottenPasswordInput {
  email: string;
  forgottenPassword: string;
  otp: string;
}