// src/types/error.ts

export interface ApiErrorResponse {
  error: boolean;
  message: string;
  code?: string;
  timestamp?: number;
}