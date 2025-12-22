import React from 'react';
import { Line } from 'react-chartjs-2';
import { DashboardStats, TimeRange, MetricType } from './analyticsTypes';
import { getRevenueOverTimeData } from './analyticsChartService';

interface RevenueChartProps {
  stats: DashboardStats;
  timeRange: TimeRange;
  metricType: MetricType;
}

export function RevenueChart({ stats, timeRange, metricType }: RevenueChartProps) {
  const data = getRevenueOverTimeData(stats, timeRange, metricType);

  // Créer les labels filtrés pour l'axe X
  const filteredData = data.labels.map((dateStr, index) => ({
    date: dateStr,
    value: data.datasets[0].data[index]
  })).filter(item => item.value !== undefined);

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Évolution des {metricType === 'revenue' ? 'revenus' : metricType === 'orders' ? 'commandes' : 'clients'}</h3>
      <div className="h-64">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const suffix = metricType === 'revenue' ? ' FCFA' : '';
                    return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}${suffix}`;
                  }
                }
              }
            },
            scales: {
              x: {
                type: 'category',
                labels: filteredData.map(d => {
                  const date = new Date(d.date);
                  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
                })
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    if (metricType === 'revenue') {
                      return value.toLocaleString() + ' FCFA';
                    }
                    return value.toLocaleString();
                  }
                }
              },
            },
          }}
        />
      </div>
    </div>
  );
}