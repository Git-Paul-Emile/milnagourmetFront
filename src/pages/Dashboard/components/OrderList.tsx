import React from 'react';
import { Order } from '@/types';
import { getStatusDisplayText, getStatusClasses, formatOrderDate, formatOrderId } from './orderUtils';

interface OrderListProps {
  orders: Order[];
  filteredOrdersCount: number;
}

export function OrderList({ orders, filteredOrdersCount }: OrderListProps) {
  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">Commandes</h3>
        <p className="text-sm text-muted-foreground mt-1">{filteredOrdersCount} commande{filteredOrdersCount !== 1 ? 's' : ''}</p>
      </div>
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {orders.map((order) => (
          <div key={order.id} className="p-4 hover:bg-muted/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Commande #{formatOrderId(order.id)}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customer?.name || 'Client anonyme'} • {formatOrderDate(order)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{order.total} FCFA</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(order.status)}`}>
                  {getStatusDisplayText(order.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Aucune commande trouvée avec ces filtres
          </div>
        )}
      </div>
    </div>
  );
}