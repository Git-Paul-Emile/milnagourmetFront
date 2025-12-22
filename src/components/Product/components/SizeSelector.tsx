import React from 'react';
import { cn } from '@/lib/utils';
import { CreationSize } from '@/types';
import { Size } from '../hooks/useCustomCreation';

interface SizeSelectorProps {
  creationSizes: CreationSize[];
  selectedSize: Size;
  onSizeChange: (size: Size) => void;
}

export function SizeSelector({ creationSizes, selectedSize, onSizeChange }: SizeSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">1. Choisissez votre taille</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {creationSizes.map((sizeConfig) => (
          <button
            key={sizeConfig.nom}
            onClick={() => onSizeChange(sizeConfig.nom as Size)}
            className={cn(
              'p-6 rounded-lg border-2 transition-all text-left',
              selectedSize === sizeConfig.nom
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            )}
          >
            <h4 className="font-semibold text-lg capitalize">{sizeConfig.nom}</h4>
            <p className="text-2xl font-bold text-primary">{sizeConfig.prix} FCFA</p>
            <p className="text-sm text-muted-foreground">
              {sizeConfig.maxFruits} fruit{sizeConfig.maxFruits > 1 ? 's' : ''} + {sizeConfig.maxSauces} sauce{sizeConfig.maxSauces > 1 ? 's' : ''} + céréales
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}