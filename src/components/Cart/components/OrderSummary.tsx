import React from 'react';
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
    </div>
  );
}