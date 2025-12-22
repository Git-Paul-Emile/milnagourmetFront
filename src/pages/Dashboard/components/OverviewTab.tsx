import React from 'react';
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
  TimeScale,
  Filler,
} from 'chart.js';
import { StatsGrid } from './StatsGrid';
import { QuickActions } from './QuickActions';
import { PeriodStats } from './PeriodStats';
import { ChartsSection } from './ChartsSection';
import { TopIngredients } from './TopIngredients';
import { BestSellingProducts } from './BestSellingProducts';
import { RecentOrders } from './RecentOrders';
import { OverviewTabProps } from './types';
import { getTimeBasedGreeting } from '@/utils/greeting';

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
  Legend,
  TimeScale,
  Filler
);

export function OverviewTab({ stats, setActiveTab, setIsOrderManagementOpen }: OverviewTabProps) {
  const greeting = getTimeBasedGreeting();

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">{greeting}, bienvenue sur votre tableau de bord !</h2>
        <p className="text-muted-foreground">Voici un aperçu de vos statistiques et activités récentes.</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Statistiques générales</h3>
        <StatsGrid stats={stats} />
      </div>
      <QuickActions setActiveTab={setActiveTab} setIsOrderManagementOpen={setIsOrderManagementOpen} />
      <PeriodStats stats={stats} />
      <ChartsSection stats={stats} />
      <TopIngredients stats={stats} />
      <BestSellingProducts stats={stats} />
      <RecentOrders stats={stats} />
    </div>
  );
}