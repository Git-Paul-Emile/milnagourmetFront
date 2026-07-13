import React from 'react';
import { Eye, MapPin, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/types';
import { getStatusColorSync, getStatusTextSync } from '../utils/utils';

interface OrderListProps {
  filteredOrders: Order[];
  onSelectOrder: (order: Order) => void;
}

export function OrderList({ filteredOrders, onSelectOrder }: OrderListProps) {
  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pb-12">
      {filteredOrders.map((order) => (
        <div key={order.id} className="bg-card rounded-lg p-4 border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">Commande #{order.id.slice(-6)}</h3>
                <p className="text-sm text-muted-foreground">
                  {order.customer?.name || 'Client anonyme'} • {new Date(order.date || order.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                </p>
                {order.items.some(item => item.customCreation) && (
                  <p className="text-xs text-muted-foreground">
                    <strong>Créations:</strong> {order.items.filter(item => item.customCreation).map(item => {
                      const details = [];
                      if (item.customCreation!.selectedFruits.length > 0) details.push(`Fruits: ${item.customCreation!.selectedFruits.join(', ')}`);
                      if (item.customCreation!.selectedSauces.length > 0) details.push(`Sauces: ${item.customCreation!.selectedSauces.join(', ')}`);
                      if (item.customCreation!.selectedCereales.length > 0) details.push(`Céréales: ${item.customCreation!.selectedCereales.join(', ')}`);
                      return `${item.customCreation!.size.nom} (${details.join('; ')})`;
                    }).join(' | ')}
                  </p>
                )}
                {order.deliveryLocation && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {order.deliveryLocation}
                  </p>
                )}
                {order.whatsappLink && (
                  <p className="text-xs text-primary flex items-center gap-1">
                    <MessageCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                    Conversation WhatsApp disponible
                  </p>
                )}
              </div>
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto',
                getStatusColorSync(order.status)
              )}>
                {getStatusTextSync(order.status)}
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-2">
              <span className="font-bold text-primary text-sm sm:text-base">{order.total} FCFA</span>
              <div className="flex items-center space-x-2">
                {order.whatsappLink && (
                  <a
                    href={order.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 hover:bg-muted rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title="Voir conversation WhatsApp"
                    aria-label="Voir la conversation WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
                  </a>
                )}
                <button
                  onClick={() => onSelectOrder(order)}
                  className="p-3 hover:bg-muted rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Voir le détail de la commande ${order.id.slice(-6)}`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}