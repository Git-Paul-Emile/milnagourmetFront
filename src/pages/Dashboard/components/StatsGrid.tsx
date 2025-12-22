import React from 'react';
import { ShoppingCart, DollarSign, Users, Clock, Package } from 'lucide-react';
import { StatCard } from './StatCard';
import { DashboardStats } from './types';

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard
      title="Commandes totales"
      value={stats.totalOrders}
      icon={ShoppingCart}
      trend={stats.ordersTrend}
      color="hover:shadow-blue-500/10"
    />
    <StatCard
      title="Revenus totaux"
      value={`${stats.totalRevenue.toLocaleString()} FCFA`}
      icon={DollarSign}
      trend={stats.revenueTrend}
      color="hover:shadow-green-500/10"
    />
    <StatCard
      title="Clients actifs"
      value={stats.activeCustomers}
      icon={Users}
      trend={stats.customersTrend}
      color="hover:shadow-indigo-500/10"
    />

    <StatCard
      title="Produits actifs"
      value={stats.totalProducts}
      icon={Package}
      color="hover:shadow-purple-500/10"
    />
  </div>
);