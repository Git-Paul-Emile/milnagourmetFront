import React from 'react';
import { ProductCategoryItem } from '@/types';

interface ProductCategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
  productCategories: ProductCategoryItem[];
}

export function ProductCategoryField({ value, onChange, productCategories }: ProductCategoryFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Catégorie *</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-border rounded-lg"
      >
        <option value="">Choisir une catégorie...</option>
        {productCategories.filter(cat => cat.active).map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}