import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface ProductActionsProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductActions({ product, onAddToCart }: ProductActionsProps) {
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';
  return (
    <button
      onClick={onAddToCart}
      disabled={!product.available}
      className={cn(
        'group relative w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 transform-gpu overflow-hidden',
        product.available
          ? isChristmasTheme
            ? 'bg-[#C41E3A] text-white hover:bg-[#8B0000] hover:shadow-xl hover:shadow-[#C41E3A]/25 hover:scale-105 hover:-translate-y-0.5 active:scale-95'
            : 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-xl hover:shadow-primary/25 hover:scale-105 hover:-translate-y-0.5 active:scale-95'
          : 'bg-muted text-muted-foreground cursor-not-allowed',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
      )}
    >
      <ShoppingCart className={cn(
        'h-4 w-4 transition-transform duration-300',
        product.available && 'group-hover:scale-110 group-hover:rotate-12'
      )} />
      <span className="relative z-10">{product.available ? 'Ajouter au panier' : 'Indisponible'}</span>
      {product.available && (
        <div className={cn(
          "absolute inset-0 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isChristmasTheme
            ? "bg-[#C41E3A]/30"
            : "bg-gradient-to-r from-primary/30 to-secondary/30"
        )} />
      )}
    </button>
  );
}