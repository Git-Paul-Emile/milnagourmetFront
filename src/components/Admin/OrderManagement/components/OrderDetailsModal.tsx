import React, { useState, useEffect } from 'react';
import { XCircle, CheckCircle, Clock, Send } from 'lucide-react';
import { Order, DeliveryZone } from '@/types';
import { deliveryZoneService } from '@/services/deliveryZone';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/button';

interface OrderDetailsModalProps {
  selectedOrder: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order['status'], message?: string) => void;
  isProcessing: boolean;
}

interface UserWithZone {
  id: string;
  deliveryZoneId?: string | number;
}

interface UsersResponse {
  data?: UserWithZone[];
}

export function OrderDetailsModal({ selectedOrder, onClose, onUpdateStatus, isProcessing }: OrderDetailsModalProps) {
  const [actionMessage, setActionMessage] = useState('');
  const [fallbackDeliveryZone, setFallbackDeliveryZone] = useState<DeliveryZone | null>(null);

  // Si pas de deliveryZone dans la commande mais qu'on a un customer, récupérer depuis l'utilisateur
  useEffect(() => {
    if (!selectedOrder) {
      setFallbackDeliveryZone(null);
      return;
    }
    
    const fetchUserDeliveryZone = async () => {
      const orderDeliveryZone = selectedOrder.deliveryZone;
      // Si la commande n'a pas de zone mais qu'on a un customer avec un ID
      if (!orderDeliveryZone && selectedOrder.customer?.id) {
        try {
          // Récupérer toutes les zones et tous les utilisateurs
           const [zonesResponse, usersResponse] = await Promise.all([
             deliveryZoneService.getAllActive(),
             userService.getUsers()
           ]);

           const zones: DeliveryZone[] = (zonesResponse as DeliveryZone[]) || [];
           const usersResponseData = usersResponse as UsersResponse;
           const users: UserWithZone[] = usersResponseData.data || [];
          const user = users.find((u: UserWithZone) => u.id === selectedOrder.customer?.id);
          
          // Si l'utilisateur a une zone de livraison, la trouver
           if (user?.deliveryZoneId) {
             const zoneId = String(user.deliveryZoneId);
            const zone = zones.find((z: DeliveryZone) => z.id === zoneId);
            if (zone) {
              setFallbackDeliveryZone(zone);
            } else {
              // Essayer de récupérer par ID si pas trouvé dans la liste
              try {
                const zoneById = await deliveryZoneService.getDeliveryZoneById(zoneId);
                setFallbackDeliveryZone(zoneById as DeliveryZone);
              } catch (err) {
                console.error('Zone non trouvée:', err);
              }
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la zone de livraison:', error);
        }
      } else {
        // Réinitialiser le fallback si la commande a déjà une zone
        setFallbackDeliveryZone(null);
      }
    };

    fetchUserDeliveryZone();
  }, [selectedOrder]);

  // Debug: vérifier les données reçues
  if (process.env.NODE_ENV === 'development' && selectedOrder) {
    console.log('OrderDetailsModal - selectedOrder:', selectedOrder);
    console.log('OrderDetailsModal - selectedOrder keys:', Object.keys(selectedOrder));
    console.log('OrderDetailsModal - deliveryZone:', selectedOrder.deliveryZone);
    console.log('OrderDetailsModal - customer:', selectedOrder.customer);
  }

  if (!selectedOrder) return null;

  const handleStatusUpdate = (status: Order['status'], message?: string) => {
    onUpdateStatus(selectedOrder.id, status, message);
    setActionMessage('');
  };

  // Calculer le sous-total à partir des items
  const calculatedSubtotal = selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Utiliser deliveryZone de la commande ou le fallback depuis l'utilisateur
  const deliveryZone = selectedOrder.deliveryZone || fallbackDeliveryZone;
  const deliveryFee = deliveryZone?.deliveryFee || 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-bold">Commande #{selectedOrder.id.slice(-6)}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Customer Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Informations client</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Nom:</strong> {!selectedOrder.customer?.id ? 'Client anonyme' : (selectedOrder.customer?.name || selectedOrder.customerInfo?.name || 'Non spécifié')}</p>
              <p><strong>Téléphone:</strong> {!selectedOrder.customer?.id ? 'Anonyme' : (selectedOrder.customer?.phone || selectedOrder.customerInfo?.phone || 'Non spécifié')}</p>
              <p><strong>Zone de livraison:</strong> {
                !selectedOrder.customer?.id ? 'Anonyme' : (
                  deliveryZone?.name ||
                  selectedOrder.deliveryLocation ||
                  selectedOrder.customer?.address ||
                  'Non spécifiée'
                )
              }</p>
              
              {selectedOrder.whatsappLink && (
                <p><strong>WhatsApp:</strong> <a href={selectedOrder.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Voir conversation</a></p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-semibold mb-3">Articles commandés</h4>
            <div className="space-y-3">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-card rounded-lg p-3 border border-border">
                  <div className="flex items-center space-x-3">
                    {item.image && (
                      <img src={`${import.meta.env.PROD ? 'https://milnagourmetback.onrender.com' : ''}${item.image}`} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    )}
                    <div>
                      <h5 className="font-medium">{item.name}</h5>
                      <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                      {item.customCreation && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <p><strong>Taille:</strong> {item.customCreation.size.nom}</p>
                          {item.customCreation.selectedFruits.length > 0 && (
                            <p><strong>Fruits:</strong> {item.customCreation.selectedFruits.join(', ')}</p>
                          )}
                          {item.customCreation.selectedSauces.length > 0 && (
                            <p><strong>Sauces:</strong> {item.customCreation.selectedSauces.join(', ')}</p>
                          )}
                          {item.customCreation.selectedCereales.length > 0 && (
                            <p><strong>Céréales:</strong> {item.customCreation.selectedCereales.join(', ')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.price * item.quantity} FCFA</p>
                    <p className="text-sm text-muted-foreground">{item.price} FCFA/unité</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              {(() => {
                // Si on a les frais de livraison, afficher le détail
                if (deliveryFee > 0) {
                  // Utiliser le total stocké de la commande (qui inclut déjà les frais)
                  // et calculer le sous-total en soustrayant les frais
                  const orderTotal = selectedOrder.total || 0;
                  const subtotalFromTotal = orderTotal - deliveryFee;
                  
                  return (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span>Sous-total:</span>
                        <span>{subtotalFromTotal.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Frais de livraison:</span>
                        <span>{deliveryFee.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-border">
                        <span>Total:</span>
                        <span className="text-primary">{orderTotal.toLocaleString()} FCFA</span>
                      </div>
                    </>
                  );
                } else {
                  // Si pas de frais, utiliser le total stocké ou le sous-total calculé
                  const orderTotal = selectedOrder.total || calculatedSubtotal;
                  return (
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">{orderTotal.toLocaleString()} FCFA</span>
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          {/* Actions */}
          {['recu', 'en_preparation', 'livraison'].includes(selectedOrder.status) && (
            <div className="space-y-4">
              <h4 className="font-semibold">Actions</h4>

              {selectedOrder.status === 'recu' && (
                <Button
                  onClick={() => handleStatusUpdate('en_preparation')}
                  loading={isProcessing}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Mettre en préparation</span>
                </Button>
              )}

              {selectedOrder.status === 'en_preparation' && (
                <Button
                  onClick={() => handleStatusUpdate('livraison')}
                  loading={isProcessing}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <Clock className="h-5 w-5" />
                  <span>Mettre livraison en cours</span>
                </Button>
              )}

              {selectedOrder.status === 'livraison' && (
                <Button
                  onClick={() => handleStatusUpdate('livree')}
                  loading={isProcessing}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <Send className="h-5 w-5" />
                  <span>Livrée</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}