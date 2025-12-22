import { AuthUser } from '@/types';
import { httpClient } from './httpClient';

// Service d'authentification
export const authService = {
  async login(credentials: { telephone: string; password: string }) {
    const response = await httpClient.post<{ user: AuthUser; accessToken: string }, { telephone: string; password: string }>('/api/auth/login', credentials);
    if (response.data?.accessToken) {
      httpClient.setAccessToken(response.data.accessToken);
    }
    return response;
  },

  async register(data: { telephone: string; nomComplet: string; zoneLivraisonId: string; password: string; confirmPassword: string }) {
    const response = await httpClient.post<{ user: AuthUser; accessToken: string }, { telephone: string; nomComplet: string; zoneLivraisonId: string; password: string; confirmPassword: string }>('/api/auth/register', data);
    if (response.data?.accessToken) {
      httpClient.setAccessToken(response.data.accessToken);
    }
    return response;
  },

  async logout() {
    const response = await httpClient.post('/api/auth/logout');
    httpClient.setAccessToken(null);
    return response;
  },

  async logoutAll() {
    return httpClient.post('/api/auth/logout-all');
  },

  async refreshToken() {
    const response = await httpClient.post<{ accessToken: string }>('/api/auth/refresh');
    if (response.data?.accessToken) {
      httpClient.setAccessToken(response.data.accessToken);
    }
    return response;
  },

  async getProfile() {
    return httpClient.get<AuthUser>('/api/auth/me');
  },

  async deleteAccount() {
    return httpClient.delete('/api/auth/account');
  },
};