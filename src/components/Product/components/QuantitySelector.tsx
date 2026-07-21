import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onUpdateQuantity: (delta: number) => void;
}

const controlClasses =
  'p-2 rounded-full transition-all duration-200 cursor-pointer hover:bg-muted hover:scale-110 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:scale-100';

export function QuantitySelector({ quantity, onUpdateQuantity }: QuantitySelectorProps) {
  return (
    <div className="flex items-center justify-center sm:justify-start gap-4">
      <span className="font-semibold text-sm sm:text-base">Quantité :</span>
      <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
        <button
          type="button"
          onClick={() => onUpdateQuantity(-1)}
          disabled={quantity <= 1}
          aria-label="Diminuer la quantité"
          className={controlClasses}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="w-12 text-center font-bold text-lg" aria-live="polite" aria-label={`Quantité : ${quantity}`}>
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => onUpdateQuantity(1)}
          aria-label="Augmenter la quantité"
          className={controlClasses}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
