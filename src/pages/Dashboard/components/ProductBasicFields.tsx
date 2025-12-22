import React from 'react';
import { Product, ProductCategory } from '@/types';

interface ProductBasicFieldsProps {
  newProduct: Partial<Product>;
  setNewProduct: (product: Partial<Product>) => void;
  productCategories: Array<{ id: string; name: string; active: boolean }>;
}

export function ProductBasicFields({
  newProduct,
  setNewProduct,
  productCategories
}: ProductBasicFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nom du produit *</label>
        <input
          type="text"
          value={newProduct.name || ''}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          placeholder="ex: Gourmet Fraise"
          className="w-full p-2 border border-border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea
          value={newProduct.description || ''}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          placeholder="Décrivez le produit..."
          className="w-full p-2 border border-border rounded-lg h-20"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prix (FCFA) *</label>
          <input
            type="number"
            value={newProduct.price || 0}
            onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value) || 0})}
            placeholder="ex: 2500"
            className="w-full p-2 border border-border rounded-lg"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catégorie *</label>
          <select
            value={newProduct.category || ''}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value as ProductCategory})}
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
      </div>
    </div>
  );
}