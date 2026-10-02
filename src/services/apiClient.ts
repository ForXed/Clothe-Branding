// src/services/apiClient.ts
import axios from 'axios';
import type { ApiErrorResponse } from '../types/error';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh access cookie
        await axios.post(
          `${API_BASE_URL}/authentication/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh failed, logging out:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Normalize backend error envelope defensively.
    // Most endpoints return:
    // { error, message, code, timestamp }
    //
    // Some auth endpoints still return ad-hoc:
    // { error: true, message }
    //
    // So only message is guaranteed.
    const envelope = error.response?.data as ApiErrorResponse | undefined;

    const normalizedError = {
      ...error,
      message: envelope?.message ?? error.message ?? 'Something went wrong.',
      code: envelope?.code ?? 'UNKNOWN',
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;