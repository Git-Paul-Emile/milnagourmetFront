import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface EmptyCartProps {
  onClose: () => void;
}

export function EmptyCart({ onClose }: EmptyCartProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Votre panier est vide</h3>
      <p className="text-muted-foreground mb-6">
        Découvrez nos délicieux yaourts gourmets et ajoutez-les à votre panier !
      </p>
      <button
        onClick={() => {
          onClose();
          document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="border-0 bg-[#43A2F2] px-6 py-3 rounded-lg font-semibold text-white transition-transform duration-300 hover:bg-[#43A2F2] hover:text-white hover:scale-[1.02] active:scale-95"
      >
        Voir le Catalogue
      </button>
    </div>
  );
}