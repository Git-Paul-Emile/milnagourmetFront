import { httpClient } from './httpClient';

// Service pour les commandes
export const orderService = {
  async createOrder(orderData: unknown) {
    return httpClient.post('/api/orders', orderData);
  },

  async getOrders() {
    return httpClient.get('/api/orders');
  },

  async getMyOrders() {
    return httpClient.get('/api/orders/my-orders');
  },

  async updateOrderStatus(orderId: string, status: string) {
    return httpClient.put(`/api/orders/${orderId}/status`, { status });
  },
};