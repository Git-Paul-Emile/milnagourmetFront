import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
  isChristmasTheme?: boolean;
}

export function CartButton({ itemCount, onClick, isChristmasTheme = false }: CartButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 transition-colors",
        "text-foreground hover:text-primary"
      )}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse-soft">
          {itemCount}
        </span>
      )}
    </button>
  );
}