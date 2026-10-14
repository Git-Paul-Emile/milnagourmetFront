import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
  product: Product;
}

const MAX_COLLAPSED_CHARS = 65;

export function ProductInfo({ product }: ProductInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const description = product.description || '';
  const isLong = description.length > MAX_COLLAPSED_CHARS;

  const truncatedText = useMemo(() => {
    if (!isLong) return description;
    const cut = description.slice(0, MAX_COLLAPSED_CHARS);
    const lastSpace = cut.lastIndexOf(' ');
    return lastSpace > 30 ? cut.slice(0, lastSpace) : cut;
  }, [description, isLong]);

  return (
    <div className="relative z-10 p-4 space-y-3">
      <div>
        <h3 className={cn(
          "font-semibold text-lg transition-colors",
          "text-[#212121] group-hover:text-primary"
        )}>
          {product.name}
        </h3>

        {/* Zone de description à hauteur constante (3 lignes) pour garantir que la dimension des cartes ne change jamais */}
        <div className="mt-1 h-[3.75rem] text-sm leading-5 text-[#8b8b8b]">
          {isExpanded ? (
            <div 
              onPointerDown={(e) => e.stopPropagation()}
              className="h-full overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              <span>{description} </span>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsExpanded(false);
                }}
                className="text-primary hover:text-primary-dark font-medium text-xs cursor-pointer underline-offset-2 hover:underline inline ml-1"
              >
                voir moins
              </button>
            </div>
          ) : isLong ? (
            <div className="h-full overflow-hidden">
              <span>{truncatedText}... </span>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsExpanded(true);
                }}
                className="text-primary hover:text-primary-dark font-medium text-xs cursor-pointer underline-offset-2 hover:underline inline ml-1"
              >
                voir plus
              </button>
            </div>
          ) : (
            <div className="h-full overflow-hidden">
              <span>{description}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prix et catégorie */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className={cn(
              "text-2xl font-bold",
              "text-primary"
            )}>
              {product.price}
            </span>
            <span className={cn(
              "text-sm",
              "text-muted-foreground"
            )}>FCFA</span>
          </div>
        </div>
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          product.category === 'cremeux' && 'bg-cream text-foreground',
          product.category === 'liquide' && 'bg-primary/10 text-primary',
          product.category === 'creation' && 'bg-accent/10 text-accent'
        )}>
          {product.category === 'cremeux' && 'Crémeux'}
          {product.category === 'liquide' && 'Liquide'}
          {product.category === 'creation' && 'Création'}
        </span>
      </div>
    </div>
  );
}