import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { DashboardStats } from './types';

interface CategoryChartProps {
  stats: DashboardStats;
}

export const CategoryChart = ({ stats }: CategoryChartProps) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <h3 className="text-lg font-semibold mb-4">Répartition par catégories</h3>
    <div className="h-64">
      <Doughnut
        data={{
          labels: stats.categoryData.map(item => item.category),
          datasets: [{
            data: stats.categoryData.map(item => item.revenue),
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 205, 86, 0.8)',
            ],
            borderWidth: 2,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right' as const,
            },
            title: {
              display: true,
              text: 'Répartition des revenus par catégorie',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value.toLocaleString()} FCFA (${percentage}%)`;
                }
              }
            }
          },
        }}
      />
    </div>
  </div>
);