import React from 'react';
import { ProductCategoryItem } from '@/types';

interface ProductCategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
  productCategories: ProductCategoryItem[];
  error?: string;
}

export function ProductCategoryField({ value, onChange, productCategories, error }: ProductCategoryFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Catégorie *</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-border'}`}
      >
        <option value="">Choisir une catégorie...</option>
        {productCategories.filter(cat => cat.active).map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}