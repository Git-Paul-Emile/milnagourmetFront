import React from 'react';
import { Bar } from 'react-chartjs-2';
import { DashboardStats, TimeRange, MetricType } from './analyticsTypes';
import { getSizePerformanceData } from './analyticsChartService';

interface SizeChartProps {
  stats: DashboardStats;
  timeRange: TimeRange;
  metricType: MetricType;
}

export function SizeChart({ stats, timeRange, metricType }: SizeChartProps) {
  const data = getSizePerformanceData(stats, timeRange, metricType);

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Performance par taille (Créations)</h3>
      <div className="h-64">
        <Bar
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
                    return `${context.label}: ${context.parsed.y.toLocaleString()}${suffix}`;
                  }
                }
              }
            },
            scales: {
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