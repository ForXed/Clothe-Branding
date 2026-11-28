// src/utils/validators.ts

export const validateEmail = (email: string): boolean => {
  const match = String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  return match !== null;
};