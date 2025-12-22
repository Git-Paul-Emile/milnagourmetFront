import { httpClient } from './httpClient';

export interface RevenueData {
  date: string;
  revenue: number;
}

type Period = 'day' | 'week' | 'month';

/**
 * Service pour récupérer les données de revenus réels depuis l'API
 * Agrège les données par période (jour, semaine, mois)
 */
export const revenueService = {
  /**
   * Récupère les revenus réels agrégés par la période spécifiée
   * @param period - 'day' | 'week' | 'month'
   * @param startDate - Date de début optionnelle (ISO string)
   * @param endDate - Date de fin optionnelle (ISO string)
   * @returns Tableau de données {date, revenue} ou null en cas d'erreur
   */
  async getRevenueByPeriod(
    period: Period,
    startDate?: string,
    endDate?: string
  ): Promise<RevenueData[] | null> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await httpClient.get<RevenueData[]>(`/api/orders/revenue/${period}${queryString}`);

      if (response.status === 'success' && response.data && Array.isArray(response.data)) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Erreur lors de la récupération des revenus (${period}):`, error);
      return null;
    }
  },

  /**
   * Récupère les revenus du jour
   */
  async getDailyRevenue(startDate?: string, endDate?: string): Promise<RevenueData[] | null> {
    return this.getRevenueByPeriod('day', startDate, endDate);
  },

  /**
   * Récupère les revenus hebdomadaires
   */
  async getWeeklyRevenue(startDate?: string, endDate?: string): Promise<RevenueData[] | null> {
    return this.getRevenueByPeriod('week', startDate, endDate);
  },

  /**
   * Récupère les revenus mensuels
   */
  async getMonthlyRevenue(startDate?: string, endDate?: string): Promise<RevenueData[] | null> {
    return this.getRevenueByPeriod('month', startDate, endDate);
  }
};
