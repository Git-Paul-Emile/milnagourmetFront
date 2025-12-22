import { Order, Product, User } from '@/types';

export function calculateBasicStats(orders: Order[], products: Product[], users: User[]) {
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalProducts = products.filter(p => !p.archived).length;
  const totalUsers = users.filter(u => u.role !== 'admin').length;

  // Règle unique : client actif = non bloqué, non admin,
  // avec au moins une commande dans les 60 derniers jours
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const isActiveCustomerLast60Days = (user: User) => {
    if (user.role === 'admin' || user.blocked || !user.orders || user.orders.length === 0) {
      return false;
    }

    return user.orders.some(order => {
      const orderDate = new Date(order.date || order.createdAt || '');
      return orderDate >= sixtyDaysAgo;
    });
  };

  const activeCustomers = users.filter(isActiveCustomerLast60Days).length;

  // Calcul du trend des clients actifs (comparaison avec le mois précédent)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Mois actuel
  const monthStart = new Date(today);
  monthStart.setDate(1);
  
  // Mois précédent
  const previousMonthStart = new Date(today);
  previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
  previousMonthStart.setDate(1);
  const previousMonthEnd = new Date(today);
  previousMonthEnd.setDate(0); // Dernier jour du mois précédent
  previousMonthEnd.setHours(23, 59, 59, 999);

  // Clients actifs du mois actuel (ayant commandé ce mois)
  const activeCustomersThisMonth = users.filter(user => {
    if (user.role === 'admin' || user.blocked || !user.orders || user.orders.length === 0) {
      return false;
    }
    // Vérifier si l'utilisateur a commandé ce mois
    return user.orders.some(order => {
      const orderDate = new Date(order.date || order.createdAt || '');
      return orderDate >= monthStart;
    });
  }).length;

  // Clients actifs du mois précédent
  const activeCustomersPreviousMonth = users.filter(user => {
    if (user.role === 'admin' || user.blocked || !user.orders || user.orders.length === 0) {
      return false;
    }
    // Vérifier si le client a commandé le mois précédent
    return user.orders.some(order => {
      const orderDate = new Date(order.date || order.createdAt || '');
      return orderDate >= previousMonthStart && orderDate <= previousMonthEnd;
    });
  }).length;

  // Calcul du trend
  const calculateTrend = (current: number, previous: number): string => {
    if (previous === 0) {
      return current > 0 ? '+100% ce mois' : '0% ce mois';
    }
    const percentage = ((current - previous) / previous) * 100;
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(0)}% ce mois`;
  };

  const customersTrend = calculateTrend(activeCustomersThisMonth, activeCustomersPreviousMonth);

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    totalProducts,
    totalUsers,
    activeCustomers,
    customersTrend
  };
}