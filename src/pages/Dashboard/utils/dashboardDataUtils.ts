import { Order, Customer } from '@/types';
import { createCustomerFromOrder, updateCustomerWithOrder, calculateCustomerMetrics } from './customer';

/**
 * Calcule les données clients à partir des commandes
 */
export function calculateCustomersFromOrders(orders: Order[]): Customer[] {
  const customerMap = new Map<string, Customer>();

  orders.forEach(order => {
    if (order.customer?.phone) {
      const phone = order.customer.phone;
      const existingCustomer = customerMap.get(phone);

      if (existingCustomer) {
        updateCustomerWithOrder(existingCustomer, order);
      } else {
        const customer = createCustomerFromOrder(order);
        customerMap.set(phone, customer);
      }
    }
  });

  const customers = Array.from(customerMap.values());
  customers.forEach(calculateCustomerMetrics);

  return customers;
}