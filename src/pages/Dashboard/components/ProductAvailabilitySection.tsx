import React from 'react';
import { Product } from '@/types';

interface ProductAvailabilitySectionProps {
  newProduct: Partial<Product>;
  setNewProduct: (product: Partial<Product>) => void;
}

export function ProductAvailabilitySection({
  newProduct,
  setNewProduct
}: ProductAvailabilitySectionProps) {
  return (
    <div className="flex items-center space-x-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={newProduct.available ?? true}
          onChange={(e) => setNewProduct({...newProduct, available: e.target.checked})}
        />
        <span className="text-sm">Produit activé immédiatement</span>
      </label>
    </div>
  );
}