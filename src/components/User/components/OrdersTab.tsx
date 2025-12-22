import React from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order, CartItem } from '@/types';
import { formatDate, formatPrice } from '../utils';

interface OrdersTabProps {
  orders?: Order[];
}

export function OrdersTab({ orders }: OrdersTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Historique des commandes</h3>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Commande #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                  <span className={cn(
                    'inline-block px-2 py-1 rounded-full text-xs font-medium',
                    order.status === 'delivered' && 'bg-green-100 text-green-800',
                    order.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                    order.status === 'cancelled' && 'bg-red-100 text-red-800'
                  )}>
                    {order.status === 'delivered' && 'Livrée'}
                    {order.status === 'pending' && 'En cours'}
                    {order.status === 'cancelled' && 'Annulée'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item: CartItem, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <span>{item.quantity}x {formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-semibold mb-2">Aucune commande</h4>
          <p className="text-muted-foreground">
            Vous n'avez pas encore passé de commande.
          </p>
        </div>
      )}
    </div>
  );
}