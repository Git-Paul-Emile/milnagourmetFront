import React from 'react';
import { XCircle, ShoppingCart } from 'lucide-react';
import { User as UserType, Order, DeliveryZone } from '@/types';

interface UserOrdersModalProps {
  selectedUser: UserType | null;
  orders: Order[];
  deliveryZones: DeliveryZone[];
  isOpen: boolean;
  onClose: () => void;
}

export function UserOrdersModal({ selectedUser, orders, deliveryZones, isOpen, onClose }: UserOrdersModalProps) {
  if (!isOpen || !selectedUser) return null;

  const userOrders = orders.filter(order => order.customer?.id === selectedUser.id);

  // Try several sources to display the delivery zone (user zone, then last order fallback)
  const userDeliveryZoneId = selectedUser.deliveryZoneId || selectedUser.zoneLivraisonId;
  const deliveryZoneNameFromUser = userDeliveryZoneId
    ? deliveryZones.find(zone => zone.id === String(userDeliveryZoneId))?.name
    : null;

  const deliveryZoneNameFromOrders =
    userOrders.find(order => order.deliveryZone?.name)?.deliveryZone?.name ||
    userOrders.find(order => order.deliveryLocation)?.deliveryLocation;

  const deliveryZoneName = deliveryZoneNameFromUser || deliveryZoneNameFromOrders || 'Non spécifiée';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Commandes de {selectedUser.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Informations utilisateur</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Nom:</strong> {selectedUser.name}</p>
            </div>
            <div>
              <p><strong>Téléphone:</strong> {selectedUser.phone}</p>
              <p><strong>Zone de livraison:</strong> {deliveryZoneName}</p>
            </div>
          </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Historique des commandes ({userOrders.length})</h3>
            {userOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune commande trouvée pour ce client</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {userOrders
                  .sort((a, b) => new Date(b.date || b.createdAt || '').getTime() - new Date(a.date || a.createdAt || '').getTime())
                  .map((order) => (
                    <div key={order.id} className="bg-card rounded-lg p-4 border border-border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">Commande #{order.id.slice(-6)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date || order.createdAt || '').toLocaleDateString('fr-FR')} à {new Date(order.date || order.createdAt || '').toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <div className="mt-2 space-y-1">
                            {order.items.map((item, index) => (
                              <p key={index} className="text-sm">
                                • {item.name} x{item.quantity} - {item.price * item.quantity} FCFA
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{order.total} FCFA</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium mt-2 inline-block ${
                            order.status === 'recu' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'livree' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'annulee' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status === 'recu' ? 'Reçue' :
                             order.status === 'livree' ? 'Livrée' :
                             order.status === 'annulee' ? 'Annulée' :
                             order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}