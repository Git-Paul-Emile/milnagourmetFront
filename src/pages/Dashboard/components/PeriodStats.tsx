import React from 'react';
import { DashboardStats } from './types';

interface PeriodStatsProps {
  stats: DashboardStats;
}

export const PeriodStats = ({ stats }: PeriodStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Aujourd'hui</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Commandes</span>
          <span className="font-semibold">{stats.todayOrders}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Revenus</span>
          <span className="font-semibold">{stats.todayRevenue.toLocaleString()} FCFA</span>
        </div>
        
      </div>
    </div>

    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Cette semaine</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Commandes</span>
          <span className="font-semibold">{stats.weekOrders}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Revenus</span>
          <span className="font-semibold">{stats.weekRevenue.toLocaleString()} FCFA</span>
        </div>
       
      </div>
    </div>

    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Ce mois</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Commandes</span>
          <span className="font-semibold">{stats.monthOrders}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Revenus</span>
          <span className="font-semibold">{stats.monthRevenue.toLocaleString()} FCFA</span>
        </div>
       
      </div>
    </div>
  </div>
);