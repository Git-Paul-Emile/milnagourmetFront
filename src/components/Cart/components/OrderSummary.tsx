import React from 'react';
import { Wallet } from 'lucide-react';
import { DeliveryZone } from '@/types';

interface OrderSummaryProps {
  itemCount: number;
  subtotal: number;
  selectedZone: DeliveryZone | undefined;
  pointsDiscount?: number;
}

export function OrderSummary({ itemCount, subtotal, selectedZone, pointsDiscount = 0 }: OrderSummaryProps) {
  const deliveryFee = selectedZone?.deliveryFee || 0;
  const total = subtotal + deliveryFee - pointsDiscount;

  return (
    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
      <h3 className="font-semibold text-sm">Récapitulatif de commande</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Articles:</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Sous-total:</span>
          <span>{subtotal} FCFA</span>
        </div>
        {selectedZone && deliveryFee > 0 && (
          <div className="flex justify-between">
            <span>Frais de livraison:</span>
            <span>{deliveryFee} FCFA</span>
          </div>
        )}
        {pointsDiscount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Réduction (points):</span>
            <span>-{pointsDiscount} FCFA</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-primary border-t pt-2">
          <span>Total:</span>
          <span>{total} FCFA</span>
        </div>
      </div>

      {/* Modalité de règlement affichée avant validation.
          Aucun paiement en ligne n'est proposé : le client règle le
          livreur. L'indiquer ici évite l'abandon de panier par crainte
          d'avoir à saisir une carte bancaire. */}
      <p className="flex items-center gap-1.5 border-t pt-2 text-xs text-muted-foreground">
        <Wallet className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-medium text-foreground">Paiement à la livraison.</strong>{' '}
          Aucun paiement en ligne n'est demandé.
        </span>
      </p>
    </div>
  );
}