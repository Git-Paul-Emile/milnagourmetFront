import React from 'react';
import { Package, CheckCircle, XCircle, Folder } from 'lucide-react';
import { Product, ProductCategoryItem } from '@/types';

interface ProductStatsProps {
  allProducts: Product[];
  productCategories: ProductCategoryItem[];
}

export function ProductStats({ allProducts, productCategories }: ProductStatsProps) {
  const totalProducts = allProducts.length;
  const activeProducts = allProducts.filter(p => p.available).length;
  const inactiveProducts = allProducts.filter(p => !p.available).length;
  const activeCategories = productCategories.filter(cat => cat.active).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-card rounded-lg p-4 border border-border">
        <Package className="h-8 w-8 mb-2 text-muted-foreground" />
        <div className="text-2xl font-bold text-primary">{totalProducts}</div>
        <div className="text-sm text-muted-foreground">Total produits</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border">
        <CheckCircle className="h-8 w-8 mb-2 text-muted-foreground" />
        <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
        <div className="text-sm text-muted-foreground">Produits actifs</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border">
        <XCircle className="h-8 w-8 mb-2 text-muted-foreground" />
        <div className="text-2xl font-bold text-red-600">{inactiveProducts}</div>
        <div className="text-sm text-muted-foreground">Produits inactifs</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border">
        <Folder className="h-8 w-8 mb-2 text-muted-foreground" />
        <div className="text-2xl font-bold text-blue-600">{activeCategories}</div>
        <div className="text-sm text-muted-foreground">Catégorie{activeCategories !== 1 ? 's' : ''}</div>
      </div>
    </div>
  );
}