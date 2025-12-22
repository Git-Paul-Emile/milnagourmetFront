import { useState } from 'react';
import { Product } from '@/types';

export function useProductForm() {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    available: true,
    image: ''
  });

  const updateProduct = (updates: Partial<Product>) => {
    setNewProduct(prev => ({ ...prev, ...updates }));
  };

  const resetProduct = () => {
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      category: '',
      available: true,
      image: ''
    });
  };

  return {
    newProduct,
    updateProduct,
    resetProduct
  };
}