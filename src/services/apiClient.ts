// src/services/apiClient.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1️⃣ REQUEST INTERCEPTOR: Attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('brutige_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2️⃣ RESPONSE INTERCEPTOR: Auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('brutige_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint directly (bypass interceptor to avoid loop)
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // Update tokens in storage
        localStorage.setItem('brutige_access_token', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('brutige_refresh_token', data.refreshToken);
        }

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed (token revoked/expired) -> Force logout
        console.error('Refresh failed, logging out:', refreshError);
        localStorage.removeItem('brutige_access_token');
        localStorage.removeItem('brutige_refresh_token');
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;