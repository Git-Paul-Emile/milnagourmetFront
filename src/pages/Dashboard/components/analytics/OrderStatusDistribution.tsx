import React from 'react';
import { Pie } from 'react-chartjs-2';
import { DashboardStats } from './analyticsTypes';
import { getOrderStatusDistributionData } from './analyticsChartService';

interface OrderStatusDistributionProps {
  stats: DashboardStats;
}

export function OrderStatusDistribution({ stats }: OrderStatusDistributionProps) {
  const data = getOrderStatusDistributionData(stats);

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Distribution des statuts de commandes</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64">
          <Pie
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right' as const,
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.parsed;
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              },
            }}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Statistiques détaillées</h4>
          <div className="space-y-2">
            {stats.orderStatusData.map((status, index) => {
              const total = stats.orderStatusData.reduce((sum, s) => sum + s.count, 0);
              const percentage = total > 0 ? ((status.count / total) * 100).toFixed(1) : '0.0';

              return (
                <div key={status.status} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                    />
                    <span className="font-medium">{status.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{status.count}</span>
                    <span className="text-sm text-muted-foreground ml-2">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}