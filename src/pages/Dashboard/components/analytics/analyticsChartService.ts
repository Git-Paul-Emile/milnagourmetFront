import { DashboardStats, TimeRange, MetricType } from './analyticsTypes';

// Fonction utilitaire pour filtrer les données selon la période
function filterDataByTimeRange(data: Array<{ date: string; revenue: number; orders: number }>, timeRange: TimeRange) {
  const now = new Date();
  let startDate: Date;

  switch (timeRange) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return data.filter(item => new Date(item.date) >= startDate);
}

export function getRevenueOverTimeData(stats: DashboardStats, timeRange: TimeRange, metricType: MetricType) {
  const filteredData = filterDataByTimeRange(stats.salesData, timeRange);

  let label = 'Revenus';
  let data: number[] = [];
  let color = 'rgb(59, 130, 246)';

  switch (metricType) {
    case 'revenue':
      label = 'Revenus';
      data = filteredData.map(d => d.revenue);
      color = 'rgb(59, 130, 246)';
      break;
    case 'orders':
      label = 'Commandes';
      data = filteredData.map(d => d.orders);
      color = 'rgb(16, 185, 129)';
      break;
    case 'customers':
      // Pour les clients, on pourrait calculer les clients uniques par jour
      // Pour l'instant, on utilise les commandes comme approximation
      label = 'Clients actifs';
      data = filteredData.map(d => Math.floor(d.orders * 0.7)); // Approximation
      color = 'rgb(245, 158, 11)';
      break;
  }

  return {
    labels: filteredData.map(d => d.date),
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

export function getOrdersOverTimeData(stats: DashboardStats, timeRange: TimeRange, metricType: MetricType) {
  const filteredData = filterDataByTimeRange(stats.salesData, timeRange);

  let label = 'Commandes';
  let data: number[] = [];
  let color = 'rgb(16, 185, 129)';

  switch (metricType) {
    case 'revenue':
      label = 'Revenus';
      data = filteredData.map(d => d.revenue);
      color = 'rgb(59, 130, 246)';
      break;
    case 'orders':
      label = 'Commandes';
      data = filteredData.map(d => d.orders);
      color = 'rgb(16, 185, 129)';
      break;
    case 'customers':
      label = 'Clients actifs';
      data = filteredData.map(d => Math.floor(d.orders * 0.7)); // Approximation
      color = 'rgb(245, 158, 11)';
      break;
  }

  return {
    labels: filteredData.map(d => d.date),
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

export function getCategoryPerformanceData(stats: DashboardStats, timeRange: TimeRange, metricType: MetricType) {
  let label = 'Revenus';
  let data: number[] = [];

  switch (metricType) {
    case 'revenue':
      label = 'Revenus';
      data = stats.categoryData.map(c => c.revenue);
      break;
    case 'orders':
      label = 'Commandes';
      data = stats.categoryData.map(c => c.count);
      break;
    case 'customers':
      // Pour les clients, approximation basée sur les commandes
      label = 'Clients';
      data = stats.categoryData.map(c => Math.floor(c.count * 0.7));
      break;
  }

  return {
    labels: stats.categoryData.map(c => c.category),
    datasets: [
      {
        label,
        data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };
}

export function getSizePerformanceData(stats: DashboardStats, timeRange: TimeRange, metricType: MetricType) {
  let label = 'Revenus par taille';
  let data: number[] = [];

  switch (metricType) {
    case 'revenue':
      label = 'Revenus par taille';
      data = stats.sizeData.map(s => s.revenue);
      break;
    case 'orders':
      label = 'Commandes par taille';
      data = stats.sizeData.map(s => s.count);
      break;
    case 'customers':
      label = 'Clients par taille';
      data = stats.sizeData.map(s => Math.floor(s.count * 0.7));
      break;
  }

  return {
    labels: stats.sizeData.map(s => s.size),
    datasets: [
      {
        label,
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };
}

export function getOrderStatusDistributionData(stats: DashboardStats) {
  return {
    labels: stats.orderStatusData.map(s => s.status),
    datasets: [
      {
        data: stats.orderStatusData.map(s => s.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Reçue
          'rgba(245, 158, 11, 0.8)', // En préparation
          'rgba(16, 185, 129, 0.8)', // En livraison
          'rgba(147, 51, 234, 0.8)', // Livrée
        ],
        borderWidth: 1,
      },
    ],
  };
}