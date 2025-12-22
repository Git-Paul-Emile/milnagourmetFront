import React from 'react';
import { Bar } from 'react-chartjs-2';
import { DashboardStats } from './types';

interface SizeChartProps {
  stats: DashboardStats;
}

export const SizeChart = ({ stats }: SizeChartProps) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <h3 className="text-lg font-semibold mb-4">Répartition par taille (Créations)</h3>
    <div className="h-64">
      <Bar
        data={{
          labels: stats.sizeData.map(item => item.size),
          datasets: [{
            label: 'Revenus par taille',
            data: stats.sizeData.map(item => item.revenue),
            backgroundColor: 'rgba(153, 102, 255, 0.8)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Revenus par taille de création',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Revenus (FCFA)'
              }
            },
          },
        }}
      />
    </div>
  </div>
);