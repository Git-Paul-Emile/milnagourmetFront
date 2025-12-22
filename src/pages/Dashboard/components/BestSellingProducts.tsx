import React from 'react';
import { DashboardStats } from './types';

interface BestSellingProductsProps {
  stats: DashboardStats;
}

export const BestSellingProducts = ({ stats }: BestSellingProductsProps) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <h3 className="text-lg font-semibold mb-4">Produits les plus vendus</h3>
    {stats.bestSellingProducts.length > 0 ? (
      <div className="space-y-3">
        {stats.bestSellingProducts.map((item, index) => (
          <div key={item.product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                {index + 1}
              </div>
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">{item.totalSold} vendus</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{item.revenue.toLocaleString()} FCFA</p>
              <p className="text-xs text-muted-foreground">Revenus</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground text-center py-4">Aucune vente enregistrée</p>
    )}
  </div>
);