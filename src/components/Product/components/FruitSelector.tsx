import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreationOptionItem } from '@/types';

interface FruitSelectorProps {
  fruits: CreationOptionItem[];
  selectedFruits: string[];
  maxFruits: number;
  onToggleFruit: (fruit: string) => void;
}

/**
 * Grille de vignettes fruits, alignée sur le langage visuel des cartes
 * produits du catalogue : coins arrondis, élévation + ombre primaire au
 * survol, zoom image 300 ms, nom #212121 qui passe au primary.
 * Sélection = bordure + coche, fond blanc conservé.
 */
export function FruitSelector({ fruits, selectedFruits, maxFruits, onToggleFruit }: FruitSelectorProps) {
  const maxReached = selectedFruits.length >= maxFruits;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-[#212121]">
        2. Choisissez vos fruits
        <span className="text-sm font-normal text-muted-foreground ml-2">
          ({selectedFruits.length}/{maxFruits})
        </span>
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {fruits.map((fruit) => {
          const isSelected = selectedFruits.includes(fruit.nom);
          const isDisabled = !isSelected && maxReached;
          return (
            <button
              key={fruit.nom}
              type="button"
              onClick={() => onToggleFruit(fruit.nom)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              className={cn(
                'group relative flex flex-col items-center overflow-hidden rounded-xl bg-card text-center transform-gpu cursor-pointer',
                'transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
                isSelected ? 'border-2 border-button-border' : 'border border-border'
              )}
            >
              {/* Pastille de sélection : fond vert, coche blanche. */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-1.5 right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-light text-white transition-opacity duration-200',
                  isSelected ? 'opacity-100' : 'opacity-0'
                )}
              >
                <Check className="h-3.5 w-3.5" />
              </span>

              <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center p-1.5">
                {fruit.image ? (
                  <img
                    src={fruit.image}
                    alt={fruit.nom}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-lg font-bold opacity-40">{fruit.nom.charAt(0)}</span>
                )}
              </div>
              <span className="w-full px-1.5 py-2 text-xs font-medium leading-tight text-[#212121] transition-colors group-hover:text-primary">
                {fruit.nom}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
