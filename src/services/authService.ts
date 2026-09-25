// src/services/authService.ts
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
    const response = await apiClient.post<AuthResponse>('/authentication/register', data);
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

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/authentication/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/authentication/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/authentication/reset-password', { token, password });
    return response.data;
  },

  // 🌐 OAUTH
  getGoogleOAuthUrl(): string {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${API_BASE_URL}/oauth2/authorization/google`;
  },
};