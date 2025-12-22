import React from 'react';
import { Pie } from 'react-chartjs-2';
import { DashboardStats } from './types';

interface OrderStatusChartProps {
  stats: DashboardStats;
}

export const OrderStatusChart = ({ stats }: OrderStatusChartProps) => {
  // Vérifier si les données existent et ne sont pas vides
  const hasData = stats.orderStatusData && stats.orderStatusData.length > 0;
  const hasOrders = hasData && stats.orderStatusData.some(item => item.count > 0);
  
  // Si les données ne sont pas encore chargées ou sont vides
  if (!hasData) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Statut des commandes</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Si les données sont chargées mais qu'il n'y a pas de commandes avec des counts > 0
  // Afficher quand même le graphique avec des valeurs à 0 pour montrer les statuts disponibles
  if (!hasOrders) {
    // Afficher le graphique même avec des counts à 0 pour montrer les statuts disponibles
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Statut des commandes</h3>
        <div className="h-64">
          <Pie
            data={{
              labels: stats.orderStatusData.map(item => item.status),
              datasets: [{
                data: stats.orderStatusData.map(item => item.count),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 205, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
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
                  text: 'Répartition des statuts de commandes',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.parsed;
                      return `${label}: ${value}`;
                    }
                  }
                }
              },
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Aucune commande trouvée avec ces statuts
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Statut des commandes</h3>
      <div className="h-64">
        <Pie
          data={{
            labels: stats.orderStatusData.map(item => item.status),
            datasets: [{
              data: stats.orderStatusData.map(item => item.count),
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 205, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
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
                text: 'Répartition des statuts de commandes',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            },
          }}
        />
      </div>
    </div>
  );
};