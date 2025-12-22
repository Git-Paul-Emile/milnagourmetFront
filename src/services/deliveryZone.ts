import { DeliveryZone } from '@/types';
import { httpClient } from './httpClient';

export const deliveryZoneService = {
  async getAll() {
    const response = await httpClient.get('/api/delivery-zones');
    return response.data;
  },

  async getAllActive(): Promise<DeliveryZone[]> {
    const response = await httpClient.get('/api/delivery-zones/active');
    return response.data as DeliveryZone[];
  },

  async getAllWithOrderCounts() {
    const response = await httpClient.get('/api/delivery-zones/with-orders');
    return response.data;
  },

  async getDeliveryZoneById(id: string) {
    const response = await httpClient.get(`/api/delivery-zones/${id}`);
    return response.data;
  },

  async create(data: Partial<DeliveryZone>) {
    return httpClient.post('/api/delivery-zones', data);
  },

  async update(id: string, data: Partial<DeliveryZone>) {
    return httpClient.put(`/api/delivery-zones/${id}`, data);
  },

  async delete(id: string) {
    return httpClient.delete(`/api/delivery-zones/${id}`);
  }
};