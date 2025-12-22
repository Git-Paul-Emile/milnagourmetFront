import { DeliveryPerson } from '@/types';
import { httpClient } from './httpClient';

export const deliveryPersonService = {
  async getAll() {
    return httpClient.get('/api/delivery-persons');
  },

  async getDeliveryPersonById(id: string) {
    return httpClient.get(`/api/delivery-persons/${id}`);
  },

  async create(data: Partial<DeliveryPerson>) {
    return httpClient.post('/api/delivery-persons', data);
  },

  async update(id: string, data: Partial<DeliveryPerson>) {
    return httpClient.put(`/api/delivery-persons/${id}`, data);
  },

  async delete(id: string) {
    return httpClient.delete(`/api/delivery-persons/${id}`);
  }
};