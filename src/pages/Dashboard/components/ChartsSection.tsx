import React from 'react';
import { SalesChart } from './SalesChart';
import { CategoryChart } from './CategoryChart';
import { SizeChart } from './SizeChart';
import { OrderStatusChart } from './OrderStatusChart';
import { DashboardStats } from './types';

interface ChartsSectionProps {
  stats: DashboardStats;
}

export const ChartsSection = ({ stats }: ChartsSectionProps) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">Graphiques et analyses</h3>
    {/* Graphiques */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SalesChart stats={stats} />
      <CategoryChart stats={stats} />
    </div>

    {/* Graphiques supplémentaires */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SizeChart stats={stats} />
      <OrderStatusChart stats={stats} />
    </div>
  </div>
);