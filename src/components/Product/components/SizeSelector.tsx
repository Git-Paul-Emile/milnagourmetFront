import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreationSize } from '@/types';
import { Size } from '../hooks/useCustomCreation';

interface SizeSelectorProps {
  creationSizes: CreationSize[];
  selectedSize: Size;
  onSizeChange: (size: Size) => void;
}

/**
 * Sélecteur de taille en cartes-image, aligné sur le langage visuel des
 * cartes produits du catalogue (ProductCard) : mêmes coins, mêmes couleurs,
 * mêmes effets de survol (élévation, ombre primaire, zoom image 300 ms,
 * titre qui passe à la couleur primaire).
 * La sélection est marquée par la bordure et la coche — le fond reste blanc.
 */
export function SizeSelector({ creationSizes, selectedSize, onSizeChange }: SizeSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-[#212121]">1. Choisissez votre taille</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {creationSizes.map((sizeConfig) => {
          const isSelected = selectedSize === sizeConfig.nom;
          return (
            <button
              key={sizeConfig.nom}
              type="button"
              onClick={() => onSizeChange(sizeConfig.nom as Size)}
              aria-pressed={isSelected}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-xl bg-card text-left transform-gpu cursor-pointer',
                'transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isSelected
                  ? 'border-2 border-button-border'
                  : 'border border-border'
              )}
            >
              {/* Pastille de sélection : fond vert, coche blanche. */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-light text-white transition-opacity duration-200',
                  isSelected ? 'opacity-100' : 'opacity-0'
                )}
              >
                <Check className="h-4 w-4" />
              </span>

              {/* Visuel : image entière (object-contain, pas de recadrage),
                  fond blanc, zoom au survol. */}
              <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center p-2">
                {sizeConfig.image ? (
                  <img
                    src={sizeConfig.image}
                    alt={sizeConfig.nom}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-3xl font-bold capitalize opacity-40">
                    {sizeConfig.nom.charAt(0)}
                  </span>
                )}
              </div>

              {/* Texte : titre #212121 -> primary au survol, prix en primary,
                  unité FCFA séparée en muted — copie du bloc ProductInfo. */}
              <div className="p-3 space-y-1">
                <h4 className="font-semibold capitalize leading-tight text-[#212121] transition-colors group-hover:text-primary">
                  {sizeConfig.nom}
                </h4>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-bold text-primary">{sizeConfig.prix}</span>
                  <span className="text-xs text-muted-foreground">FCFA</span>
                </div>
                <p className="text-xs text-[#8b8b8b]">
                  {sizeConfig.maxFruits} fruit{sizeConfig.maxFruits > 1 ? 's' : ''} + {sizeConfig.maxSauces} sauce{sizeConfig.maxSauces > 1 ? 's' : ''}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
