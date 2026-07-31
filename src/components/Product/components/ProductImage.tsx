import React from 'react';
import { Eye } from 'lucide-react';
import { Product } from '@/types';
import { getFullImageUrl } from '@/utils/imageUtils';

interface ProductImageProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export function ProductImage({ product, onViewDetails }: ProductImageProps) {
  return (
    <div className="relative aspect-square overflow-hidden">
      <img
        src={getFullImageUrl(product.image)}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />

      {/* Badge de disponibilité */}
      {!product.available && (
        <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-medium">
          Indisponible
        </div>
      )}

      {/* Actions rapides */}
      {onViewDetails && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-1">
          <button
            onClick={() => onViewDetails(product)}
            className="p-2 bg-background/80 hover:bg-background text-foreground rounded-full shadow-medium transition-colors"
            title="Voir détails"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
