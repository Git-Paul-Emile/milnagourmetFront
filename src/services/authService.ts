import { AuthUser } from '@/types';
import { httpClient } from './httpClient';

/**
 * Données d'inscription.
 * `email` est facultatif : l'authentification se fait par téléphone.
 * Il n'est demandé que pour permettre la réinitialisation de mot de passe
 * et les notifications de commande.
 */
export interface RegisterPayload {
  telephone: string;
  nomComplet: string;
  zoneLivraisonId: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

// Service d'authentification
export const authService = {
  async login(credentials: { telephone: string; password: string }) {
    const response = await httpClient.post<{ user: AuthUser; accessToken: string }, { telephone: string; password: string }>('/api/auth/login', credentials);
    if (response.data?.accessToken) {
      httpClient.setAccessToken(response.data.accessToken);
    }
    return response;
  },

  async register(data: RegisterPayload) {
    const response = await httpClient.post<{ user: AuthUser; accessToken: string }, RegisterPayload>('/api/auth/register', data);
    if (response.data?.accessToken) {
      httpClient.setAccessToken(response.data.accessToken);
    }
    return response;
  },

  /**
   * Étape 1 de la réinitialisation : demande d'un lien par email.
   *
   * Le backend répond toujours la même chose, que le compte existe ou
   * non — c'est volontaire (protection contre l'énumération de comptes).
   * Le front ne doit donc jamais afficher « adresse inconnue ».
   */
  async forgotPassword(email: string) {
    return httpClient.post<null, { email: string }>('/api/auth/forgot-password', { email });
  },

  /** Étape 2 : application du nouveau mot de passe à partir du jeton reçu. */
  async resetPassword(payload: { token: string; password: string; confirmPassword: string }) {
    return httpClient.post<null, typeof payload>('/api/auth/reset-password', payload);
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

  async updateProfile(data: { nom: string; telephone: string; deliveryZoneId: string; email?: string; motDePasse?: string; ancienMotDePasse?: string }) {
    return httpClient.put<AuthUser>('/api/auth/profile', data);
  },

  async deleteAccount() {
    return httpClient.delete('/api/auth/account');
  },
};