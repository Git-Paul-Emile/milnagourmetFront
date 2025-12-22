import { Order, Customer } from '@/types';

/**
 * Crée un nouveau client à partir d'une commande
 */
export function createCustomerFromOrder(order: Order): Customer {
  const phone = order.customer!.phone;
  return {
    id: `customer-${phone}`,
    firstName: order.customer!.name?.split(' ')[0] || '',
    lastName: order.customer!.name?.split(' ').slice(1).join(' ') || '',
    phone: phone,
    email: order.customer!.email,
    address: order.customer!.address,
    orderHistory: [order],
    purchaseFrequency: 0, // Sera calculé plus tard
    preferences: {
      favoriteYogurtTypes: order.items.map(item => item.product?.name || '').filter(name => name.length > 0)
    },
    status: 'new', // Par défaut nouveau
    whatsappOffersEnabled: false,
    createdAt: order.date || order.createdAt || new Date().toISOString(),
    lastOrderDate: order.date || order.createdAt || new Date().toISOString(),
    totalOrders: 1,
    totalSpent: order.total
  };
}