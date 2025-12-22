import { useState, useEffect, useCallback } from 'react';
import { Order, Product, User } from '@/types';
import { DashboardStats } from '../types/dashboardStats';
import { calculateBasicStats } from './statsCalculators/revenueCalculator';
import { calculateTimeBasedStats } from './statsCalculators/timeStatsCalculator';
import { calculateBestSellingProducts, calculateTopIngredients, calculateRecentOrders } from './statsCalculators/productStatsCalculator';
import { calculateSalesData, calculateCategoryData, calculateSizeData, calculateOrderStatusData } from './statsCalculators/chartDataCalculator';

export function useDashboardStats(orders: Order[], products: Product[], users: User[]) {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    todayOrders: 0,
    todayRevenue: 0,
    weekOrders: 0,
    weekRevenue: 0,
    monthOrders: 0,
    monthRevenue: 0,
    activeCustomers: 0,
    bestSellingProducts: [],
    topFruits: [],
    topSauces: [],
    topCereales: [],
    salesData: [],
    categoryData: [],
    sizeData: [],
    orderStatusData: [],
    recentOrders: []
  });

  const calculateStats = useCallback(async () => {
    try {
      // Debug: vérifier les commandes reçues
      if (process.env.NODE_ENV === 'development') {
        console.log('[useDashboardStats] Calcul des stats avec:', {
          ordersCount: orders.length,
          productsCount: products.length,
          usersCount: users.length,
          sampleOrderStatus: orders.length > 0 ? orders[0]?.status : 'aucune commande'
        });
      }

      const basicStats = calculateBasicStats(orders, products, users);
      const timeStats = calculateTimeBasedStats(orders);
      const bestSellingProducts = calculateBestSellingProducts(orders);
      const { topFruits, topSauces, topCereales } = calculateTopIngredients(orders);
      const recentOrders = calculateRecentOrders(orders);
      const salesData = calculateSalesData(orders);
      
      // Appels asynchrones pour les données nécessitant des traductions
      // Utiliser Promise.allSettled pour éviter qu'une erreur bloque les autres
      console.log('[useDashboardStats] Appel de calculateOrderStatusData avec', orders.length, 'commandes');
      const [categoryResult, sizeResult, orderStatusResult] = await Promise.allSettled([
        calculateCategoryData(orders),
        calculateSizeData(orders),
        calculateOrderStatusData(orders)
      ]);

      const categoryData = categoryResult.status === 'fulfilled' ? categoryResult.value : [];
      const sizeData = sizeResult.status === 'fulfilled' ? sizeResult.value : [];
      const orderStatusData = orderStatusResult.status === 'fulfilled' ? orderStatusResult.value : [];

      // Log pour debug si nécessaire
      if (orderStatusResult.status === 'rejected') {
        console.error('[useDashboardStats] ❌ Erreur lors du calcul des statuts de commandes:', orderStatusResult.reason);
      } else {
        console.log('[useDashboardStats] ✅ Résultat orderStatusData reçu:', orderStatusData);
        console.log('[useDashboardStats] Nombre de statuts:', orderStatusData.length);
        if (orderStatusData.length > 0) {
          console.log('[useDashboardStats] Premier statut:', orderStatusData[0]);
        }
      }

      setStats({
        ...basicStats,
        ...timeStats,
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
      });
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
    }
  }, [orders, products, users]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  return stats;
}