import { Order, Customer } from '@/types';

/**
 * Met à jour un client existant avec les données d'une nouvelle commande
 */
export function updateCustomerWithOrder(existingCustomer: Customer, order: Order): void {
  existingCustomer.orderHistory.push(order);
  existingCustomer.totalOrders += 1;
  existingCustomer.totalSpent += order.total;

  // Mettre à jour la dernière commande
  const orderDate = new Date(order.date || order.createdAt || '');
  if (!existingCustomer.lastOrderDate || orderDate > new Date(existingCustomer.lastOrderDate)) {
    existingCustomer.lastOrderDate = orderDate.toISOString();
  }

  // Mettre à jour les préférences (types de yaourt)
  order.items.forEach(item => {
    if (item.product?.name && !existingCustomer.preferences.favoriteYogurtTypes.includes(item.product.name)) {
      existingCustomer.preferences.favoriteYogurtTypes.push(item.product.name);
    }
  });
}