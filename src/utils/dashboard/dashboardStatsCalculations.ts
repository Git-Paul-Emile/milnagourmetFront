import { Order, Product, User as UserType, DashboardStats } from '@/types';
import {
  filterOrdersByDate,
  calculateTotalRevenue,
  countOrders,
  getTodayStart,
  getWeekStart,
  getMonthStart
} from './utils';
import { calculateTopIngredients } from '@/pages/Dashboard/hooks/statsCalculators/productStatsCalculator';
import { calculateSalesData, calculateCategoryData, calculateSizeData } from '@/pages/Dashboard/hooks/statsCalculators/chartDataCalculator';

/**
 * Calcule les statistiques de base (total commandes, revenu, etc.) avec trends
 */
const calculateBasicStats = (orders: Order[], products: Product[], users: UserType[]) => {
  const totalOrders = orders.length;
  const totalRevenue = calculateTotalRevenue(orders);
  // Le backend renvoie les statuts en minuscules : 'recu', 'livree', 'annulee'
  const pendingOrders = orders.filter(order => order.status && String(order.status).toLowerCase() === 'recu').length;
  const totalProducts = products.filter(p => !p.archived).length;
  const totalUsers = users.filter(u => u.role !== 'admin').length;

  // Un client est actif s'il n'est pas bloqué, qu'il n'est pas admin
  // et qu'il a passé au moins une commande dans les 60 derniers jours
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const isActiveCustomerLast60Days = (user: UserType) => {
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
  const todayStart = getTodayStart();
  const monthStart = getMonthStart();
  const previousMonthStart = new Date(todayStart);
  previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
  previousMonthStart.setDate(1);
  const previousMonthEnd = new Date(todayStart);
  previousMonthEnd.setDate(0);
  previousMonthEnd.setHours(23, 59, 59, 999);

  // Clients actifs du mois actuel
  const activeCustomersThisMonth = users.filter(user => {
    if (user.role === 'admin' || user.blocked || !user.orders || user.orders.length === 0) {
      return false;
    }
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
};

/**
 * Calcule les produits les plus vendus
 * Le backend renvoie les statuts en minuscules, donc on compare en minuscules
 */
const calculateBestSellingProducts = (orders: Order[]) => {
  const productSales = new Map<string, { product: Product; totalSold: number; revenue: number }>();

  orders.forEach(order => {
    // Le backend renvoie les statuts en minuscules : 'recu', 'livree', 'annulee'
    if (order.status && String(order.status).toLowerCase() === 'livree') {
      order.items.forEach(item => {
        if (item.product) {
          const productId = item.product.id;
          const existing = productSales.get(productId);
          if (existing) {
            existing.totalSold += item.quantity;
            existing.revenue += item.price * item.quantity;
          } else {
            productSales.set(productId, {
              product: item.product,
              totalSold: item.quantity,
              revenue: item.price * item.quantity
            });
          }
        }
      });
    }
  });

  return Array.from(productSales.values())
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);
};

/**
 * Obtient les commandes récentes
 */
const getRecentOrders = (orders: Order[]) => {
  return orders
    .sort((a, b) => new Date(b.date || b.createdAt || '').getTime() - new Date(a.date || a.createdAt || '').getTime())
    .slice(0, 5);
};

/**
 * Calcule les statistiques temporelles (aujourd'hui, semaine, mois) avec trends
 */
const calculateTimeBasedStats = (orders: Order[]) => {
  const todayStart = getTodayStart();
  const weekStart = getWeekStart();
  const monthStart = getMonthStart();

  const todayOrders = filterOrdersByDate(orders, todayStart);
  const todayRevenue = calculateTotalRevenue(todayOrders);

  const weekOrders = filterOrdersByDate(orders, weekStart);
  const weekRevenue = calculateTotalRevenue(weekOrders);

  const monthOrders = filterOrdersByDate(orders, monthStart);
  const monthRevenue = calculateTotalRevenue(monthOrders);

  // Calcul des périodes précédentes pour les trends
  const previousMonthStart = new Date(todayStart);
  previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
  previousMonthStart.setDate(1);
  const previousMonthEnd = new Date(todayStart);
  previousMonthEnd.setDate(0); // Dernier jour du mois précédent
  previousMonthEnd.setHours(23, 59, 59, 999);

  const previousMonthOrders = filterOrdersByDate(orders, previousMonthStart, previousMonthEnd);
  const previousMonthRevenue = calculateTotalRevenue(previousMonthOrders);

  // Calcul des trends
  const calculateTrend = (current: number, previous: number): string => {
    if (previous === 0) {
      return current > 0 ? '+100% ce mois' : '0% ce mois';
    }
    const percentage = ((current - previous) / previous) * 100;
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(0)}% ce mois`;
  };

  const ordersTrend = calculateTrend(countOrders(monthOrders), countOrders(previousMonthOrders));
  const revenueTrend = calculateTrend(monthRevenue, previousMonthRevenue);

  return {
    todayOrders: countOrders(todayOrders),
    todayRevenue,
    weekOrders: countOrders(weekOrders),
    weekRevenue,
    monthOrders: countOrders(monthOrders),
    monthRevenue,
    ordersTrend,
    revenueTrend
  };
};

/**
 * Calcule les données de statut des commandes
 * Le backend renvoie les statuts en minuscules, donc on doit comparer en minuscules
 */
const calculateOrderStatusData = (orders: Order[]) => {
  // Le backend convertit les statuts en minuscules (voir order.controller.ts ligne 242)
  // Donc on doit comparer en minuscules aussi
  return [
    { status: 'Reçue', count: orders.filter(o => o.status && String(o.status).toLowerCase() === 'recu').length },
    { status: 'Livrée', count: orders.filter(o => o.status && String(o.status).toLowerCase() === 'livree').length },
    { status: 'Annulée', count: orders.filter(o => o.status && String(o.status).toLowerCase() === 'annulee').length }
  ];
};

/**
 * Calcule les statistiques du dashboard
 */
export const calculateDashboardStats = async (
  orders: Order[],
  products: Product[],
  users: UserType[]
): Promise<DashboardStats> => {
  const basicStats = calculateBasicStats(orders, products, users);
  const bestSellingProducts = calculateBestSellingProducts(orders);
  const recentOrders = getRecentOrders(orders);
  const timeStats = calculateTimeBasedStats(orders);
  const orderStatusData = calculateOrderStatusData(orders);

  // Calculer dynamiquement toutes les données depuis la base de données
  const { topFruits, topSauces, topCereales } = calculateTopIngredients(orders);
  const salesData = calculateSalesData(orders);
  
  // Calculer les données nécessitant des appels asynchrones
  const [categoryData, sizeData] = await Promise.all([
    calculateCategoryData(orders),
    calculateSizeData(orders)
  ]);

  return {
    ...basicStats,
    ...timeStats,
    activeCustomers: basicStats.activeCustomers,
    bestSellingProducts,
    topFruits,
    topSauces,
    topCereales,
    salesData,
    categoryData,
    sizeData,
    orderStatusData,
    recentOrders,
    // Trends calculés dynamiquement
    ordersTrend: timeStats.ordersTrend,
    revenueTrend: timeStats.revenueTrend,
    customersTrend: basicStats.customersTrend
  };
};