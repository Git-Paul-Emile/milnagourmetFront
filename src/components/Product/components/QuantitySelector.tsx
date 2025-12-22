import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onUpdateQuantity: (delta: number) => void;
}

export function QuantitySelector({ quantity, onUpdateQuantity }: QuantitySelectorProps) {
  return (
    <div className="flex items-center justify-center sm:justify-start space-x-4">
      <span className="font-semibold text-sm sm:text-base">Quantité:</span>
      <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-1">
        <button
          onClick={() => onUpdateQuantity(-1)}
          className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(1)}
          className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}