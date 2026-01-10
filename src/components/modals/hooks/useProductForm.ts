import { useState } from 'react';
import { Product } from '@/types';

interface FieldErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
}

export function useProductForm() {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    available: true,
    image: ''
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const updateProduct = (updates: Partial<Product>) => {
    setNewProduct(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates) as (keyof FieldErrors)[];
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        if (field in newErrors) {
          newErrors[field] = '';
        }
      });
      return newErrors;
    });
  };

  const validateProduct = (): boolean => {
    const errors: FieldErrors = {};

    if (!newProduct.name?.trim()) {
      errors.name = 'Le nom du produit est requis';
    }

    if (!newProduct.description?.trim()) {
      errors.description = 'La description est requise';
    }

    if (!newProduct.price || newProduct.price <= 0) {
      errors.price = 'Le prix doit être supérieur à 0';
    }

    if (!newProduct.category) {
      errors.category = 'La catégorie est requise';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
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
    setFieldErrors({});
  };

  return {
    newProduct,
    fieldErrors,
    updateProduct,
    validateProduct,
    resetProduct
  };
}