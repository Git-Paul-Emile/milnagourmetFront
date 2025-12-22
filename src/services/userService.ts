import { httpClient } from './httpClient';

// Service pour les utilisateurs et ressources de livraison
export const userService = {
  async getUsers() {
    return httpClient.get('/api/users');
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