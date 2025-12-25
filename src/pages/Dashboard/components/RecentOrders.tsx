import React from 'react';
import { cn } from '@/lib/utils';
import { DashboardStats } from './types';

interface RecentOrdersProps {
  stats: DashboardStats;
}

export const RecentOrders = ({ stats }: RecentOrdersProps) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <h3 className="text-lg font-semibold mb-4">Commandes récentes</h3>
    {stats.recentOrders.length > 0 ? (
      <div className="space-y-3">
        {stats.recentOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Commande #{order.id.slice(-6)}</p>
              <p className="text-sm text-muted-foreground">
                {order.customer?.name || 'Client anonyme'} • {new Date(order.date || order.createdAt || '').toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{order.total} FCFA</p>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                order.status === 'recu' ? 'bg-blue-100 text-blue-800' :
                order.status === 'livree' ? 'bg-purple-100 text-purple-800' :
                order.status === 'annulee' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              )}>
                {order.status === 'recu' ? 'Reçue' :
                 order.status === 'livree' ? 'Livrée' :
                 order.status === 'annulee' ? 'Annulée' :
                 order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground text-center py-4">Aucune commande récente</p>
    )}
  </div>
);