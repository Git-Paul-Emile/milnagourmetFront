import { Order } from '@/types';

/**
 * Filtre les commandes par période
 */
export const filterOrdersByDate = (orders: Order[], startDate: Date, endDate?: Date): Order[] => {
  return orders.filter(order => {
    const orderDate = new Date(order.date || order.createdAt || '');
    return orderDate >= startDate && (!endDate || orderDate <= endDate);
  });
};

/**
 * Calcule le revenu total des commandes filtrées
 */
export const calculateTotalRevenue = (orders: Order[]): number => {
  return orders
    .filter(order => order.status !== 'annulee')
    .reduce((sum, order) => sum + order.total, 0);
};

/**
 * Compte le nombre de commandes
 */
export const countOrders = (orders: Order[]): number => {
  return orders.length;
};

/**
 * Obtient la date de début d'aujourd'hui
 */
export const getTodayStart = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Obtient la date de début de la semaine (7 jours en arrière)
 */
export const getWeekStart = (): Date => {
  const today = getTodayStart();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  return weekStart;
};

/**
 * Obtient la date de début du mois
 */
export const getMonthStart = (): Date => {
  const today = getTodayStart();
  const monthStart = new Date(today);
  monthStart.setDate(1);
  return monthStart;
};