import React from 'react';
import { Order } from '@/types';

interface OrderStatsProps {
  filteredOrders: Order[];
}

export function OrderStats({ filteredOrders }: OrderStatsProps) {
  // Utiliser une comparaison insensible à la casse pour les statuts
  const livreeCount = filteredOrders.filter(o => o.status && String(o.status).toLowerCase() === 'livree').length;
  const recuCount = filteredOrders.filter(o => o.status && String(o.status).toLowerCase() === 'recu').length;
  const preparationCount = filteredOrders.filter(o => o.status && String(o.status).toLowerCase() === 'en_preparation').length;
  const livraisonCount = filteredOrders.filter(o => o.status && String(o.status).toLowerCase() === 'livraison').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <div className="bg-card rounded-lg p-4 border border-border text-center">
        <div className="text-2xl font-bold text-primary">{filteredOrders.length}</div>
        <div className="text-sm text-muted-foreground">Commandes</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border text-center">
        <div className="text-2xl font-bold text-blue-600">
          {recuCount}
        </div>
        <div className="text-sm text-muted-foreground">Reçues</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border text-center">
        <div className="text-2xl font-bold text-orange-600">
          {preparationCount}
        </div>
        <div className="text-sm text-muted-foreground">En préparation</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border text-center">
        <div className="text-2xl font-bold text-yellow-600">
          {livraisonCount}
        </div>
        <div className="text-sm text-muted-foreground">En livraison</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border text-center">
        <div className="text-2xl font-bold text-purple-600">
          {livreeCount}
        </div>
        <div className="text-sm text-muted-foreground">Livrées</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border text-center">
        <div className="text-2xl font-bold text-green-600">
          {filteredOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()} FCFA
        </div>
        <div className="text-sm text-muted-foreground">Total</div>
      </div>
    </div>
  );
}