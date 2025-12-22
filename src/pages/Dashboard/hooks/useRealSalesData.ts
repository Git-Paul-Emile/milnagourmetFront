import { useState, useEffect } from 'react';
import { revenueService, type RevenueData } from '@/services/revenueService';

type Period = 'day' | 'week' | 'month';

interface UseSalesDataResult {
  salesData: Array<{ date: string; revenue: number; orders?: number }>;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  message?: string;
}

/**
 * Hook pour récupérer les données de ventes réelles depuis l'API
 * Agrège les revenus par période sélectionnée
 * Affiche un message si aucune donnée n'est disponible
 *
 * @param period - Période d'agrégation: 'day' | 'week' | 'month'
 * @param startDate - Date de début optionnelle (ISO string)
 * @param endDate - Date de fin optionnelle (ISO string)
 * @returns {salesData, isLoading, error, isEmpty, message}
 */
export function useRealSalesData(
  period: Period = 'day',
  startDate?: string,
  endDate?: string
): UseSalesDataResult {
  const [salesData, setSalesData] = useState<Array<{ date: string; revenue: number; orders?: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setIsEmpty(false);
      setMessage(undefined);

      try {
        const data = await revenueService.getRevenueByPeriod(period, startDate, endDate);

        if (!data || data.length === 0) {
          setIsEmpty(true);
          setMessage(
            'Aucune donnée de vente disponible pour la période sélectionnée. ' +
            'Les commandes commenceront à apparaître une fois que vous aurez reçu vos premières ventes.'
          );
          setSalesData([]);
        } else {
          setIsEmpty(false);
          setMessage(undefined);
          // Transformer les données du backend en format compatible
          setSalesData(
            data.map(item => ({
              date: item.date,
              revenue: item.revenue,
              orders: 0 // Le backend ne fournit pas le nombre de commandes, pourrait être ajouté
            }))
          );
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des données';
        setError(errorMessage);
        setSalesData([]);
        setIsEmpty(true);
        setMessage(
          'Impossible de charger les données de vente. ' +
          'Veuillez vérifier votre connexion et réessayer.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period, startDate, endDate]);

  return { salesData, isLoading, error, isEmpty, message };
}
