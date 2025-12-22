import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import { AnalyticsTabProps } from './analytics/analyticsTypes';
import { useAnalyticsState } from './analytics/useAnalyticsState';
import { useAnalyticsCalculations } from './analytics/useAnalyticsCalculations';
import { KPICards } from './analytics/KPICards';
import { AnalyticsControls } from './analytics/AnalyticsControls';
import { RevenueChart } from './analytics/RevenueChart';
import { OrdersChart } from './analytics/OrdersChart';
import { CategoryChart } from './analytics/CategoryChart';
import { SizeChart } from './analytics/SizeChart';
import { OrderStatusDistribution } from './analytics/OrderStatusDistribution';
import { IngredientAnalysis } from './analytics/IngredientAnalysis';
import { AnalyticsActions } from './analytics/AnalyticsActions';

export function AnalyticsTab({ stats, loadDashboardData }: AnalyticsTabProps) {
  const { timeRange, setTimeRange, metricType, setMetricType } = useAnalyticsState();
  const { revenueGrowth, ordersGrowth } = useAnalyticsCalculations(stats);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportReport = () => {
    const reportDate = new Date().toLocaleDateString('fr-FR');

    // Créer un nouveau workbook
    const wb = XLSX.utils.book_new();

    // Feuille 1: Résumé des statistiques
    const summaryData = [
      ['Rapport d\'Analyse - ' + reportDate],
      [''],
      ['Paramètres du rapport'],
      ['Période', timeRange],
      ['Métrique', metricType],
      [''],
      ['Statistiques générales'],
      ['Total commandes', stats.totalOrders.toString()],
      ['Total revenus', stats.totalRevenue.toString(), 'FCFA'],
      ['Commandes en attente', stats.pendingOrders.toString()],
      ['Clients actifs', stats.activeCustomers.toString()],
      [''],
      ['Statistiques du jour'],
      ['Commandes aujourd\'hui', stats.todayOrders.toString()],
      ['Revenus aujourd\'hui', stats.todayRevenue.toString(), 'FCFA'],
      [''],
      ['Statistiques du mois'],
      ['Commandes ce mois', stats.monthOrders.toString()],
      ['Revenus ce mois', stats.monthRevenue.toString(), 'FCFA']
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Résumé');

    // Feuille 2: Évolution temporelle
    const timeData = [
      ['Date', 'Revenus (FCFA)', 'Commandes']
    ];

    // Filtrer les données selon la période sélectionnée
    const filteredSalesData = (() => {
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

      return stats.salesData.filter(item => new Date(item.date) >= startDate);
    })();

    filteredSalesData.forEach(item => {
      timeData.push([item.date, item.revenue.toString(), item.orders.toString()]);
    });

    const wsTime = XLSX.utils.aoa_to_sheet(timeData);
    XLSX.utils.book_append_sheet(wb, wsTime, 'Évolution temporelle');

    // Feuille 3: Performance par catégorie
    const categoryData = [
      ['Catégorie', 'Nombre de commandes', 'Revenus (FCFA)']
    ];

    stats.categoryData.forEach(cat => {
      categoryData.push([cat.category, cat.count.toString(), cat.revenue.toString()]);
    });

    const wsCategory = XLSX.utils.aoa_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(wb, wsCategory, 'Performance par catégorie');

    // Feuille 4: Performance par taille
    const sizeData = [
      ['Taille', 'Nombre de commandes', 'Revenus (FCFA)']
    ];

    stats.sizeData.forEach(size => {
      sizeData.push([size.size, size.count.toString(), size.revenue.toString()]);
    });

    const wsSize = XLSX.utils.aoa_to_sheet(sizeData);
    XLSX.utils.book_append_sheet(wb, wsSize, 'Performance par taille');

    // Feuille 5: Produits les plus vendus
    const topProductsData = [
      ['Produit', 'Quantité vendue', 'Revenus générés (FCFA)']
    ];

    stats.bestSellingProducts.forEach(product => {
      topProductsData.push([product.product.name, product.totalSold.toString(), product.revenue.toString()]);
    });

    const wsProducts = XLSX.utils.aoa_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(wb, wsProducts, 'Top produits');

    // Générer et télécharger le fichier
    XLSX.writeFile(wb, `rapport-analyse-${reportDate}.xlsx`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadDashboardData();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicateurs de performance clés */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Indicateurs de performance clés</h3>
        <KPICards
          revenueGrowth={revenueGrowth}
          ordersGrowth={ordersGrowth}
        />
      </div>

      {/* Contrôles de période */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Contrôles d'analyse</h3>
        <AnalyticsControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          metricType={metricType}
          setMetricType={setMetricType}
        />
      </div>

      {/* Graphiques principaux */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Graphiques principaux</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart stats={stats} timeRange={timeRange} metricType={metricType} />
          <OrdersChart stats={stats} timeRange={timeRange} />
        </div>
      </div>

      {/* Graphiques de performance */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Graphiques de performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart stats={stats} timeRange={timeRange} metricType={metricType} />
          <SizeChart stats={stats} timeRange={timeRange} metricType={metricType} />
        </div>
      </div>

      {/* Distribution des statuts de commandes */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Distribution des statuts de commandes</h3>
        <OrderStatusDistribution stats={stats} />
      </div>

      {/* Analyse des ingrédients populaires */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Analyse des ingrédients populaires</h3>
        <IngredientAnalysis stats={stats} />
      </div>

      {/* Boutons d'export */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Actions d'export</h3>
        <AnalyticsActions
          onExportReport={handleExportReport}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </div>
    </div>
  );
}