import apiClient from './apiClient';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
  };
  message?: string;
}

export const authService = {
  // 🔐 AUTH CORE
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/authentication/signup', data);
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/authentication/login', { email, password });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/authentication/logout');
    } catch (e) {
      console.warn('Logout API call failed:', e);
    }
  },

  // 🔄 SESSION LIFECYCLE
  async verifyEmail(otp: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/authentication/verify-email', { otp });
    return response.data;
  },

  async resendOtp(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/authentication/resend-otp', { email });
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/authentication/forgotten-password', { email });
    return response.data;
  },

  async resetPassword(email: string, password: string, otp: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/authentication/verify-forgotten-password', {
      email,
      forgottenPassword: password,
      otp,
    });
    return response.data;
  },

  // 🌐 OAUTH
  getGoogleOAuthUrl(): string {
    // Google OAuth must be at the root, not under /api/v1
    const API_ROOT = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';
    return `${API_ROOT}/oauth2/authorization/google`;
  },
};