import { Order, Customer } from '@/types';

/**
 * Met à jour un client existant avec une nouvelle commande
 */
const updateExistingCustomer = (customer: Customer, order: Order): void => {
  customer.orderHistory.push(order);
  customer.totalOrders += 1;
  customer.totalSpent += order.total;

  // Mettre à jour la dernière commande
  const orderDate = new Date(order.date || order.createdAt || '');
  if (!customer.lastOrderDate || orderDate > new Date(customer.lastOrderDate)) {
    customer.lastOrderDate = orderDate.toISOString();
  }

  // Mettre à jour les préférences (types de yaourt)
  order.items.forEach(item => {
    if (item.product?.name && !customer.preferences.favoriteYogurtTypes.includes(item.product.name)) {
      customer.preferences.favoriteYogurtTypes.push(item.product.name);
    }
  });
};

/**
 * Crée un nouveau client à partir d'une commande
 */
const createNewCustomer = (order: Order): Customer => {
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
};

/**
 * Calcule la fréquence d'achat et détermine le statut du client
 */
const calculateCustomerMetrics = (customer: Customer): void => {
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
};

/**
 * Calcule les données clients à partir des commandes
 */
export const calculateCustomersFromOrders = (orders: Order[]): Customer[] => {
  const customerMap = new Map<string, Customer>();

  orders.forEach(order => {
    if (order.customer?.phone) {
      const phone = order.customer.phone;
      const existingCustomer = customerMap.get(phone);

      if (existingCustomer) {
        updateExistingCustomer(existingCustomer, order);
      } else {
        const newCustomer = createNewCustomer(order);
        customerMap.set(phone, newCustomer);
      }
    }
  });

  // Calculer la fréquence d'achat et déterminer le statut
  const customers = Array.from(customerMap.values());
  customers.forEach(calculateCustomerMetrics);

  return customers;
};