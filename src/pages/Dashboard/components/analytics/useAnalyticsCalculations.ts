import { useMemo } from 'react';
import { DashboardStats } from './analyticsTypes';

export function useAnalyticsCalculations(stats: DashboardStats) {
  const calculations = useMemo(() => {
    const calculateGrowthRate = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // Calculer les périodes précédentes pour les trends réels
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Mois précédent
    const previousMonthStart = new Date(today);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    previousMonthStart.setDate(1);
    const previousMonthEnd = new Date(today);
    previousMonthEnd.setDate(0); // Dernier jour du mois précédent
    previousMonthEnd.setHours(23, 59, 59, 999);

    // Pour les calculs, on utilise les données du mois actuel vs mois précédent
    // Ces valeurs sont déjà calculées dans timeStatsCalculator, mais on les recalcule ici
    // pour être cohérent avec les données disponibles dans stats
    
    // Extraire les valeurs de croissance depuis les trends si disponibles
    // Sinon, calculer à partir des données disponibles
    const parseTrendPercentage = (trend?: string): number => {
      if (!trend) return 0;
      const match = trend.match(/([+-]?\d+)%/);
      return match ? parseFloat(match[1]) : 0;
    };

    const revenueGrowth = parseTrendPercentage(stats.revenueTrend);
    const ordersGrowth = parseTrendPercentage(stats.ordersTrend);
    const customersGrowth = parseTrendPercentage(stats.customersTrend);

    const averageOrderValue = stats.monthOrders > 0 ? stats.monthRevenue / stats.monthOrders : 0;
    const customerLifetimeValue = stats.activeCustomers > 0 ? stats.totalRevenue / stats.activeCustomers : 0;

    return {
      revenueGrowth,
      ordersGrowth,
      customersGrowth,
      averageOrderValue,
      customerLifetimeValue,
    };
  }, [stats]);

  return calculations;
}