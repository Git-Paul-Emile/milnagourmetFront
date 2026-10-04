import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useApp } from '@/contexts/useApp';
import { DeliveryZone } from '@/types';

interface CartFooterProps {
  deliveryZone: DeliveryZone | null;
  isOrdering: boolean;
  onOrder: () => void;
  onClearCart: () => void;
}

export function CartFooter({ deliveryZone, isOrdering, onOrder, onClearCart }: CartFooterProps) {
  const { state } = useApp();
  const subtotal = state.cart.total;
  const deliveryFee = state.user ? state.cart.deliveryFee : 0;
  const pointsDiscount = state.user ? state.cart.pointsDiscount : 0;
  const finalTotal = state.user ? state.cart.totalWithDiscount : state.cart.total;

  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 sm:p-6 space-y-4 shadow-lg">
      {/* Delivery Info for logged-in users */}
      {state.user && (
        <div className="space-y-2">
          <div className="flex items-start space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Zone de livraison:</p>
              {deliveryZone ? (
                <p className="text-muted-foreground">{deliveryZone.name}</p>
              ) : state.user.zoneLivraison ? (
                <div>
                  <p className="text-muted-foreground">{state.user.zoneLivraison}</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1" role="alert">
                    Zone non trouvée dans la liste active
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Non spécifiée</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Sous-total:</span>
          <span>{subtotal} FCFA</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex items-center justify-between">
            <span>Frais de livraison:</span>
            <span>{deliveryFee} FCFA</span>
          </div>
        )}
        {pointsDiscount > 0 && (
          <div className="flex items-center justify-between text-green-600 dark:text-green-400">
            <span>Réduction (points):</span>
            <span>-{pointsDiscount} FCFA</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between border-t border-border pt-3 text-lg font-bold">
        <span>Total:</span>
        <span className="text-primary">
          {finalTotal} FCFA
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onOrder}
          disabled={isOrdering}
          className={cn(
            'group relative w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-lg font-semibold transition-all duration-300 transform-gpu overflow-hidden border-0',
            'bg-green-600 text-white hover:bg-green-600 hover:text-white hover:shadow-none hover:scale-[1.02] active:scale-95',
            isOrdering && 'opacity-50 cursor-not-allowed'
          )}
        >
          <FontAwesomeIcon icon={faWhatsapp} className={cn(
            'h-5 w-5 text-primary-foreground transition-transform duration-300',
            !isOrdering && 'group-hover:scale-110 group-hover:rotate-12'
          )} />
          {isOrdering && <Loader2 className="animate-spin h-5 w-5" />}
          <span className="relative z-10">{isOrdering ? 'Envoi en cours...' : 'Commander'}</span>
          {!isOrdering && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </button>

        <button
          onClick={onClearCart}
          className="w-full py-2 px-4 text-muted-foreground hover:text-destructive transition-colors text-sm"
        >
          Vider le panier
        </button>
      </div>
    </div>
  );
}
