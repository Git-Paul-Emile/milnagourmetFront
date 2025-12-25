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
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    ⚠️ Zone non trouvée dans la liste active
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Non spécifiée</p>
              )}
            </div>
          </div>
          {state.cart.deliveryFee > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span>Frais de livraison:</span>
              <span>{state.cart.deliveryFee} FCFA</span>
            </div>
          )}
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between text-lg font-bold">
        <span>Total:</span>
        <span className="text-primary">
          {state.user ? state.cart.totalWithDelivery : state.cart.total} FCFA
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onOrder}
          disabled={isOrdering}
          className={cn(
            'group relative w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-lg font-semibold transition-all duration-300 transform-gpu overflow-hidden',
            'bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100',
            'text-primary-foreground hover:shadow-xl hover:shadow-primary/25 hover:scale-105 hover:-translate-y-0.5 active:scale-95',
            isOrdering && 'opacity-50 cursor-not-allowed',
            'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
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