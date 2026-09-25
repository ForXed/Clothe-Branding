// src/services/apiClient.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Required for httpOnly cookies
});

// 1️⃣ RESPONSE INTERCEPTOR: Auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint (browser sends refresh cookie automatically)
        await axios.post(
          `${API_BASE_URL}/authentication/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry the original request (browser sends new access cookie automatically)
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed (token revoked/expired) -> Force logout
        console.error('Refresh failed, logging out:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;