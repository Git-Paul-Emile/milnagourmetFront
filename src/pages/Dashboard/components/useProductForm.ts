import { Product } from '@/types';

export function useProductForm() {
  const validateProduct = (product: Partial<Product>): boolean => {
    return !!(product.name && product.description && product.price);
  };

  return {
    validateProduct
  };
}