import apiClient, { OAUTH_BASE_URL } from './apiClient';
import type {
  CurrentUser,
  LoginInput,
  MessageResponse,
  ResetPasswordInput,
  SignupInput,
  SignupResponse,
  VerifyEmailInput,
} from '../types/auth';

/**
 * Auth client for the v1.3 API.
 *
 * Two things are easy to get wrong here:
 * 1. Tokens live in HttpOnly cookies, so nothing in this file returns them and the
 *    only way to learn who is signed in is `getMe()`.
 * 2. `verify-email`, `resend-otp` and `logout` read the user from the session
 *    cookie, not from the body — they must be called while the cookies are set.
 */
export const authService = {
  /** `POST /authentication/signup` — 201 + auth cookies; the user still has to verify the email. */
  async signup(input: SignupInput): Promise<SignupResponse> {
    const { data } = await apiClient.post<SignupResponse>('/authentication/signup', input);
    return data;
  },

  /** `POST /authentication/login` — 200 + auth cookies. */
  async login({ email, password }: LoginInput): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/authentication/login', { email, password });
    return data;
  },

  /** `POST /authentication/logout` — clears the cookies. Never throws. */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/authentication/logout');
    } catch {
      // The session may already be gone; the client state is what matters.
    }
  },

  /** `GET /authentication/me` — 200 with the identity, 401 when there is no session. */
  async getMe(): Promise<CurrentUser> {
    const { data } = await apiClient.get<CurrentUser>('/authentication/me');
    return data;
  },

  /** `POST /authentication/verify-email` — the email comes from the session cookie. */
  async verifyEmail({ otp }: VerifyEmailInput): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/authentication/verify-email', { otp });
    return data;
  },

  /** `POST /authentication/resend-otp` — 202, or 409 OTP_STILL_VALID while the previous code is alive. */
  async resendOtp(): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/authentication/resend-otp');
    return data;
  },

  /** `POST /authentication/forgotten-password` — 202, emails a 6-digit reset code. */
  async forgotPassword(email: string): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/authentication/forgotten-password', { email });
    return data;
  },

  /**
   * `POST /authentication/verify-forgotten-password-otp` — step 1 of the reset flow.
   * Verifies the code without spending it; `resetPassword` is what changes the password.
   */
  async verifyForgottenPasswordOtp(email: string, otp: string): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/authentication/verify-forgotten-password-otp', {
      email,
      otp,
    });
    return data;
  },

  /**
   * `POST /authentication/reset-password` — step 2 of the reset flow, and the only way
   * to change a password. There is no `change-password` endpoint and no `?token=` link.
   */
  async resetPassword({ email, otp, password }: ResetPasswordInput): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/authentication/reset-password', {
      email,
      otp,
      password,
    });
    return data;
  },

  /** Google sign-in starts at the API root, not under `/api/v1`. */
  getGoogleOAuthUrl(): string {
    return `${OAUTH_BASE_URL}/oauth2/authorization/google`;
  },
};
