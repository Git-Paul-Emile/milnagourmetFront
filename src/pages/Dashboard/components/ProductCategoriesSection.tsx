import React from 'react';
import { Tag } from 'lucide-react';
import { ProductCategoryItem } from '@/types';

interface ProductCategoriesSectionProps {
  productCategories: ProductCategoryItem[];
}

export function ProductCategoriesSection({ productCategories }: ProductCategoriesSectionProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Tag className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">Catégories de produits</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{productCategories.filter(cat => cat.active).length}</div>
            <div className="text-sm text-muted-foreground">Catégories actives</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">{productCategories.filter(cat => !cat.active).length}</div>
            <div className="text-sm text-muted-foreground">Catégories inactives</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{productCategories.length}</div>
            <div className="text-sm text-muted-foreground">Total catégories</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Liste des catégories</h4>
          {productCategories.map((category) => (
            <div key={category.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
              <div>
                <span className="font-medium">{category.name}</span>
                {category.description && (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {category.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}