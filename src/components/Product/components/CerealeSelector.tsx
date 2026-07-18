import React from 'react';
import { cn } from '@/lib/utils';

interface CerealeSelectorProps {
  cereales: string[];
  selectedCereales: string[];
  onToggleCereale: (cereale: string) => void;
}

export function CerealeSelector({ cereales, selectedCereales, onToggleCereale }: CerealeSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">4. Choisissez votre céréale (optionnel)</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {cereales.map((cereale) => (
          <button
            key={cereale}
            onClick={() => onToggleCereale(cereale)}
            className={cn(
              'p-3 rounded-lg border transition-all text-sm',
              selectedCereales.includes(cereale)
                ? 'border-button-border bg-button border  hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground'
                : 'border-border hover:border-button-border/50'
            )}
          >
            {cereale}
          </button>
        ))}
      </div>
    </div>
  );
}