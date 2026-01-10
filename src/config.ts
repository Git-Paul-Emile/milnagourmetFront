/**
 * Centralized configuration for the frontend application.
 * Ensure all environment variables are accessed through this file.
 */

export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
