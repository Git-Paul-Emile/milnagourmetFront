import { httpClient, buildQueryString } from './httpClient';

// Paramètres optionnels de pagination/recherche/filtre/tri pour GET /api/orders.
// Si aucun n'est fourni, l'endpoint reste rétro-compatible et renvoie la liste complète.
export interface OrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'recu' | 'livree' | 'annulee';
  sortBy?: 'date' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Service pour les commandes
export const orderService = {
  async createOrder(orderData: unknown) {
    return httpClient.post('/api/orders', orderData);
  },

  async getOrders(params?: OrderListParams) {
    const query = params ? buildQueryString({ ...params }) : '';
    return httpClient.get(`/api/orders${query}`);
  },

  async getMyOrders() {
    return httpClient.get('/api/orders/my-orders');
  },

  async updateOrderStatus(orderId: string, status: string) {
    return httpClient.put(`/api/orders/${orderId}/status`, { status });
  },

  async assignDeliveryPerson(orderId: string, livreurId: string | null) {
    return httpClient.put(`/api/orders/${orderId}/delivery-person`, { livreurId });
  },
};