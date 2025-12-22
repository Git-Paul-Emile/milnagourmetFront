import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useApp } from '@/contexts/useApp';

interface CartHeaderProps {
  onClose: () => void;
}

export function CartHeader({ onClose }: CartHeaderProps) {
  const { state } = useApp();

  return (
    <div className="flex items-center justify-between p-6 border-b border-border">
      <div className="flex items-center space-x-2">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold">Mon Panier</h2>
        {state.cart.itemCount > 0 && (
          <span className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded-full">
            {state.cart.itemCount}
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-muted rounded-full transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}