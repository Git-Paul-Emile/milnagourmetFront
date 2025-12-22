import React from 'react';
import { cn } from '@/lib/utils';

interface FruitSelectorProps {
  fruits: string[];
  selectedFruits: string[];
  maxFruits: number;
  onToggleFruit: (fruit: string) => void;
}

export function FruitSelector({ fruits, selectedFruits, maxFruits, onToggleFruit }: FruitSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        2. Choisissez vos fruits
        <span className="text-sm text-muted-foreground ml-2">
          ({selectedFruits.length}/{maxFruits})
        </span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {fruits.map((fruit) => (
          <button
            key={fruit}
            onClick={() => onToggleFruit(fruit)}
            disabled={!selectedFruits.includes(fruit) && selectedFruits.length >= maxFruits}
            className={cn(
              'p-3 rounded-lg border transition-all text-sm',
              selectedFruits.includes(fruit)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {fruit}
          </button>
        ))}
      </div>
    </div>
  );
}