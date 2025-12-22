import React from 'react';
import { Product } from '@/types';

interface ProductPreviewProps {
  product: Product;
}

export function ProductPreview({ product }: ProductPreviewProps) {
  return (
    <div className="flex items-center space-x-4 mb-6 p-4 bg-muted/30 rounded-lg">
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <p className="text-lg font-bold text-primary mt-1">{product.price} FCFA</p>
      </div>
    </div>
  );
}