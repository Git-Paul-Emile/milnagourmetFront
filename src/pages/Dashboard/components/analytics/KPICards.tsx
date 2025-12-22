import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardsProps {
  revenueGrowth: number;
  ordersGrowth: number;
}

export function KPICards({
  revenueGrowth,
  ordersGrowth,
}: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Croissance Revenus</p>
            <p className={`text-2xl font-bold ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
            </p>
          </div>
          {revenueGrowth >= 0 ? (
            <TrendingUp className="h-8 w-8 text-green-600" />
          ) : (
            <TrendingDown className="h-8 w-8 text-red-600" />
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Croissance Commandes</p>
            <p className={`text-2xl font-bold ${ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {ordersGrowth >= 0 ? '+' : ''}{ordersGrowth.toFixed(1)}%
            </p>
          </div>
          {ordersGrowth >= 0 ? (
            <TrendingUp className="h-8 w-8 text-green-600" />
          ) : (
            <TrendingDown className="h-8 w-8 text-red-600" />
          )}
        </div>
      </div>
    </div>
  );
}