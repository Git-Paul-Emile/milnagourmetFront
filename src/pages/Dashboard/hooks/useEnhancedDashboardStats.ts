import { useState, useEffect } from 'react';
import { Order, Product, User } from '@/types';
import { useDashboardStats } from './useDashboardStats';
import { revenueService, type RevenueData } from '@/services/revenueService';

/**
 * Hook amélioré qui combine les données en temps réel du frontend
 * avec les données agrégées du backend pour les graphiques
 */
export function useEnhancedDashboardStats(
  orders: Order[],
  products: Product[],
  users: User[],
  period: 'today' | 'week' | 'month' | 'year' | 'all' = 'month'
) {
  // Obtenir les stats de base calculées côté frontend
  const baseStats = useDashboardStats(orders, products, users);

  // État pour les données de revenus du backend
  const [backendSalesData, setBackendSalesData] = useState<RevenueData[] | null>(null);
  const [salesDataLoading, setSalesDataLoading] = useState(false);

  useEffect(() => {
    const fetchBackendData = async () => {
      if (orders.length === 0) {
        // Si aucune commande, pas besoin de charger du backend
        setBackendSalesData(null);
        return;
      }

      setSalesDataLoading(true);
      try {
        // Déterminer la période pour l'API basée sur le filtre du frontend
        let apiPeriod: 'day' | 'week' | 'month' = 'day';
        if (period === 'week' || period === 'today') {
          apiPeriod = 'day';
        } else if (period === 'month' || period === 'year') {
          apiPeriod = 'day'; // Toujours utiliser le jour pour plus de détails
        } else {
          apiPeriod = 'day';
        }

        const revenueData = await revenueService.getRevenueByPeriod(apiPeriod);

        if (revenueData && revenueData.length > 0) {
          setBackendSalesData(revenueData);
        } else {
          setBackendSalesData(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de revenus du backend:', error);
        setBackendSalesData(null);
      } finally {
        setSalesDataLoading(false);
      }
    };

    fetchBackendData();
  }, [orders.length, period]);

  // Si on a des données du backend, les utiliser pour le graphique de ventes
  // Sinon, utiliser les données calculées localement
  const enhancedStats = {
    ...baseStats,
    salesData:
      backendSalesData && backendSalesData.length > 0
        ? backendSalesData.map(item => ({
            date: item.date,
            revenue: item.revenue,
            orders: 0 // Backend ne fournit pas le nombre de commandes
          }))
        : baseStats.salesData,
    salesDataSource: backendSalesData ? 'backend' : 'local' as const,
    salesDataLoading
  };

  return enhancedStats;
}
