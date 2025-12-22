import React from 'react';
import { DeliveryZone } from '@/types';

interface OrderSummaryProps {
  itemCount: number;
  subtotal: number;
  selectedZone: DeliveryZone | undefined;
}

export function OrderSummary({ itemCount, subtotal, selectedZone }: OrderSummaryProps) {
  const deliveryFee = selectedZone?.deliveryFee || 0;
  const total = subtotal + deliveryFee;

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
        <div className="flex justify-between font-bold text-primary border-t pt-2">
          <span>Total:</span>
          <span>{total} FCFA</span>
        </div>
      </div>
    </div>
  );
}