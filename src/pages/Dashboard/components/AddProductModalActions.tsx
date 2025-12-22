import React from 'react';
import { Product } from '@/types';
import { useProductForm } from './useProductForm';

interface AddProductModalActionsProps {
  onClose: () => void;
  onAddProduct: () => void;
  newProduct: Partial<Product>;
}

export function AddProductModalActions({
  onClose,
  onAddProduct,
  newProduct
}: AddProductModalActionsProps) {
  const { validateProduct } = useProductForm();
  const isValid = validateProduct(newProduct);

  return (
    <div className="flex justify-end space-x-3 mt-6">
      <button
        onClick={onClose}
        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
      >
        Annuler
      </button>
      <button
        onClick={onAddProduct}
        disabled={!isValid}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Ajouter le produit
      </button>
    </div>
  );
}