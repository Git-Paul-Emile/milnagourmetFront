import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductActionsProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductActions({ product, onAddToCart }: ProductActionsProps) {
  return (
    <button
      onClick={onAddToCart}
      disabled={!product.available}
      className={cn(
        'group relative w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 transform-gpu overflow-hidden',
        product.available
          ? 'bg-white border border-border text-foreground hover:bg-[#43A2F2] hover:text-white hover:border-[#43A2F2] hover:scale-105 hover:-translate-y-0.5 active:scale-95'
          : 'bg-muted text-muted-foreground cursor-not-allowed',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
      )}
    >
      <ShoppingCart className={cn(
        'h-4 w-4 transition-transform duration-300',
        product.available && 'group-hover:scale-110 group-hover:rotate-12'
      )} />
      <span className="relative z-10">{product.available ? 'Ajouter au panier' : 'Indisponible'}</span>
    </button>
  );
}