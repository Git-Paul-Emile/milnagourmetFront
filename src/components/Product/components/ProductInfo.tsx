import React from 'react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';

  return (
    <div className="p-4 space-y-3">
      <div>
        <h3 className={cn(
          "font-semibold text-lg transition-colors",
          isChristmasTheme
            ? "text-[#8B0000] group-hover:text-[#8B0000]"
            : "text-foreground group-hover:text-primary"
        )}>
          {product.name}
        </h3>
        <p className={cn(
          "text-sm line-clamp-2 mt-1",
          isChristmasTheme ? "text-[#666]" : "text-muted-foreground"
        )}>
          {product.description}
        </p>
      </div>

      {/* Prix et catégorie */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className={cn(
              "text-2xl font-bold",
              isChristmasTheme ? "text-[#165B33]" : "text-primary"
            )}>
              {product.price}
            </span>
            <span className={cn(
              "text-sm",
              isChristmasTheme ? "text-[#666]" : "text-muted-foreground"
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