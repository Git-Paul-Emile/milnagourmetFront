import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useApp } from '@/contexts/useApp';
import { Button } from '@/components/ui/button';
import { useCustomerInfo, useDeliveryZones } from './hooks';
import { CustomerInfoFields, DeliveryZoneSelector, OrderSummary, PointsSelector } from './components';
import { submitOrder } from './utils/orderSubmission';

interface CustomerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: () => void;
}

export function CustomerInfoModal({ isOpen, onClose, onOrderSuccess }: CustomerInfoModalProps) {
  const { state, dispatch } = useApp();
  const { customerInfo, updateField, isValid } = useCustomerInfo();
  const { deliveryZones, selectedZoneId, selectedZone, isLoading, setSelectedZoneId } = useDeliveryZones(isOpen);
  const [isSending, setIsSending] = useState(false);
  const [pointsUsed, setPointsUsed] = useState(0);

  const handlePointsChange = (points: number) => {
    setPointsUsed(points);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid() || !selectedZoneId) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: 'Veuillez remplir tous les champs, y compris la zone de livraison.',
          avatar: '/uploads/temoignages/milna-owner.jpg'
        }
      });
      return;
    }

    setIsSending(true);
    try {
      await submitOrder({
        cartItems: state.cart.items,
        subtotal: state.cart.total,
        customerInfo,
        selectedZone,
        pointsUsed
      });

      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          message: 'Commande envoyée avec succès ! Nous vous contacterons bientôt.',
          avatar: '/uploads/temoignages/milna-owner.jpg'
        }
      });

      // Clear cart after successful order
      dispatch({ type: 'CLEAR_CART' });
      onOrderSuccess?.();
      onClose();
    } catch (error) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: 'Erreur lors de l\'envoi de la commande. Veuillez réessayer.',
          avatar: '/uploads/temoignages/milna-owner.jpg'
        }
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-background rounded-2xl max-w-md w-full border border-border shadow-2xl my-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold">Informations de livraison</h2>
              <p className="text-sm text-muted-foreground">
                Renseignez vos coordonnées pour finaliser votre commande
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <CustomerInfoFields
              customerInfo={customerInfo}
              onFieldChange={updateField}
            />

            <DeliveryZoneSelector
              deliveryZones={deliveryZones}
              selectedZoneId={selectedZoneId}
              isLoading={isLoading}
              onZoneChange={setSelectedZoneId}
            />

            {/* Points Selector - only show for logged-in users */}
            {state.user && state.user.pointsFidelite > 0 && (
              <PointsSelector
                availablePoints={state.user.pointsFidelite}
                currentTotal={state.cart.total + (selectedZone?.deliveryFee || 0)}
                onPointsChange={handlePointsChange}
                conversionRate={1}
              />
            )}

            <OrderSummary
              itemCount={state.cart.itemCount}
              subtotal={state.cart.total}
              selectedZone={selectedZone}
              pointsDiscount={pointsUsed}
            />

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSending}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
                loading={isSending}
              >
                <Send className="h-4 w-4 mr-2" />
                Commander
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}