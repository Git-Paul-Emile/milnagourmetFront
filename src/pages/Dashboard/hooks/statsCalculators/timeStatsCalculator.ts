import { Order } from '@/types';

/**
 * Calcule les statistiques temporelles avec les périodes précédentes pour les trends
 */
export function calculateTimeBasedStats(orders: Order[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // === PÉRIODE ACTUELLE ===
  
  // Commandes d'aujourd'hui
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.date || order.createdAt || '');
    return orderDate >= today;
  }).length;

  const todayRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.date || order.createdAt || '');
      return orderDate >= today && order.status !== 'cancelled';
    })
    .reduce((sum, order) => sum + order.total, 0);

  // Commandes de la semaine (7 derniers jours)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  const weekOrders = orders.filter(order => {
    const orderDate = new Date(order.date || order.createdAt || '');
    return orderDate >= weekStart;
  }).length;

  const weekRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.date || order.createdAt || '');
      return orderDate >= weekStart && order.status !== 'cancelled';
    })
    .reduce((sum, order) => sum + order.total, 0);

  // Commandes du mois actuel
  const monthStart = new Date(today);
  monthStart.setDate(1);
  const monthOrders = orders.filter(order => {
    const orderDate = new Date(order.date || order.createdAt || '');
    return orderDate >= monthStart;
  }).length;

  const monthRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.date || order.createdAt || '');
      return orderDate >= monthStart && order.status !== 'cancelled';
    })
    .reduce((sum, order) => sum + order.total, 0);

  // === PÉRIODE PRÉCÉDENTE (pour les trends) ===
  
  // Mois précédent
  const previousMonthStart = new Date(today);
  previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
  previousMonthStart.setDate(1);
  const previousMonthEnd = new Date(today);
  previousMonthEnd.setDate(0); // Dernier jour du mois précédent
  previousMonthEnd.setHours(23, 59, 59, 999);

  const previousMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.date || order.createdAt || '');
    return orderDate >= previousMonthStart && orderDate <= previousMonthEnd;
  }).length;

  const previousMonthRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.date || order.createdAt || '');
      return orderDate >= previousMonthStart && orderDate <= previousMonthEnd && order.status !== 'cancelled';
    })
    .reduce((sum, order) => sum + order.total, 0);

  // Semaine précédente (7 jours avant la semaine actuelle)
  const previousWeekStart = new Date(weekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  const previousWeekEnd = new Date(weekStart);
  previousWeekEnd.setMilliseconds(previousWeekEnd.getMilliseconds() - 1);

  const previousWeekOrders = orders.filter(order => {
    const orderDate = new Date(order.date || order.createdAt || '');
    return orderDate >= previousWeekStart && orderDate <= previousWeekEnd;
  }).length;

  const previousWeekRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.date || order.createdAt || '');
      return orderDate >= previousWeekStart && orderDate <= previousWeekEnd && order.status !== 'cancelled';
    })
    .reduce((sum, order) => sum + order.total, 0);

  // Calcul des trends (comparaison avec le mois précédent)
  const calculateTrend = (current: number, previous: number): string => {
    if (previous === 0) {
      return current > 0 ? '+100% ce mois' : '0% ce mois';
    }
    const percentage = ((current - previous) / previous) * 100;
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(0)}% ce mois`;
  };

  const ordersTrend = calculateTrend(monthOrders, previousMonthOrders);
  const revenueTrend = calculateTrend(monthRevenue, previousMonthRevenue);

  return {
    todayOrders,
    todayRevenue,
    weekOrders,
    weekRevenue,
    monthOrders,
    monthRevenue,
    // Données pour les trends
    previousMonthOrders,
    previousMonthRevenue,
    previousWeekOrders,
    previousWeekRevenue,
    ordersTrend,
    revenueTrend
  };
}