import { httpClient, buildQueryString } from './httpClient';

// Paramètres optionnels de pagination/recherche/filtre/tri pour GET /api/users.
// Si aucun n'est fourni, l'endpoint reste rétro-compatible et renvoie la liste complète.
export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  blocked?: 'true' | 'false';
  sortBy?: 'name' | 'orders' | 'date';
  sortOrder?: 'asc' | 'desc';
}

// Service pour les utilisateurs et ressources de livraison
export const userService = {
  async getUsers(params?: UserListParams) {
    const query = params ? buildQueryString({ ...params }) : '';
    return httpClient.get(`/api/users${query}`);
  },

  async updateUser(id: string, data: unknown) {
    return httpClient.put(`/api/users/${id}`, data);
  },

  async deleteUser(id: string) {
    return httpClient.delete(`/api/users/${id}`);
  },

  async getDeliveryZones() {
    return httpClient.get('/api/delivery-zones');
  },

  async getDeliveryPersons() {
    return httpClient.get('/api/delivery-persons');
  },
};