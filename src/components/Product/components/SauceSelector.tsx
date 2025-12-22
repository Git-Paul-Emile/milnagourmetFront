import React from 'react';
import { cn } from '@/lib/utils';

interface SauceSelectorProps {
  sauces: string[];
  selectedSauces: string[];
  maxSauces: number;
  onToggleSauce: (sauce: string) => void;
}

export function SauceSelector({ sauces, selectedSauces, maxSauces, onToggleSauce }: SauceSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        3. Choisissez vos sauces
        <span className="text-sm text-muted-foreground ml-2">
          ({selectedSauces.length}/{maxSauces})
        </span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {sauces.map((sauce) => (
          <button
            key={sauce}
            onClick={() => onToggleSauce(sauce)}
            disabled={!selectedSauces.includes(sauce) && selectedSauces.length >= maxSauces}
            className={cn(
              'p-3 rounded-lg border transition-all text-sm',
              selectedSauces.includes(sauce)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {sauce}
          </button>
        ))}
      </div>
    </div>
  );
}