import { Customer } from '@/types';

/**
 * Calcule les métriques d'un client (fréquence d'achat et statut)
 */
export function calculateCustomerMetrics(customer: Customer): void {
  const now = new Date();
  const firstOrderDate = new Date(customer.createdAt);
  const daysSinceFirstOrder = Math.max(1, (now.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24));

  customer.purchaseFrequency = customer.totalOrders / daysSinceFirstOrder; // commandes par jour

  // Déterminer le statut (simple logique)
  if (customer.totalOrders >= 5 || customer.purchaseFrequency >= 0.1) {
    customer.status = 'regular';
  } else {
    customer.status = 'new';
  }
}