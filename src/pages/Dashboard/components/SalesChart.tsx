import React from 'react';
import { Line } from 'react-chartjs-2';
import { DashboardStats } from './types';

interface SalesChartProps {
  stats: DashboardStats;
}

export const SalesChart = ({ stats }: SalesChartProps) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <h3 className="text-lg font-semibold mb-4">Évolution des ventes (30 jours)</h3>
    <div className="h-64">
      <Line
        data={{
          labels: stats.salesData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
          }),
          datasets: [
            {
              label: 'Revenus (FCFA)',
              data: stats.salesData.map(item => item.revenue),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Nombre de commandes',
              data: stats.salesData.map(item => item.orders),
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              yAxisID: 'y1',
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Revenus (FCFA)'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Commandes'
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Évolution des ventes et commandes',
            },
          },
        }}
      />
    </div>
  </div>
);