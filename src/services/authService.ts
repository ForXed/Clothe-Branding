// src/services/authService.ts
import apiClient from './apiClient';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const authService = {
  // 🔐 AUTH CORE
  async register(data: RegisterData) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;

    // Store tokens immediately
    localStorage.setItem('brutige_access_token', accessToken);
    localStorage.setItem('brutige_refresh_token', refreshToken);

    return { user, accessToken };
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore logout errors, we clear local state anyway
      console.warn('Logout API call failed, clearing local state.');
    }
    localStorage.removeItem('brutige_access_token');
    localStorage.removeItem('brutige_refresh_token');
  },

  // 🔄 SESSION LIFECYCLE
  async verifyEmail(token: string) {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
  const response = await apiClient.post('/auth/change-password', { currentPassword, newPassword });
  return response.data;
},

  async forgotPassword(email: string) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    return response.data;
  },

  // 🌐 OAUTH
  getGoogleOAuthUrl() {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${API_BASE_URL}/auth/oauth2/google`;
  }
};