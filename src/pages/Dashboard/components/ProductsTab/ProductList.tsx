import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, ProductCategoryItem, CreationOptions } from '@/types';

interface ProductListProps {
  products: Product[];
  productCategories: ProductCategoryItem[];
  creationOptions: CreationOptions;
  onEditProduct: (product: Product) => void;
  onToggleAvailability: (productId: string, currentStatus: boolean) => void;
  onDeleteProduct: (product: Product) => void;
}

export function ProductList({
  products,
  productCategories,
  creationOptions,
  onEditProduct,
  onToggleAvailability,
  onDeleteProduct
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun produit trouvé avec les filtres appliqués.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className={cn(
          'bg-card rounded-lg border border-border p-4 relative'
        )}>

          {product.image && (
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
          )}

          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-1">{product.description}</p>
          <p className="text-xs text-muted-foreground mb-2">
            Catégorie: {productCategories.find(cat => cat.id.toString() === product.category)?.name || product.category}
          </p>

          {/* Afficher les ingrédients pour les produits de création */}
          {product.category === 'creation' && (
            <div className="mb-2 text-xs text-muted-foreground">
              <div className="grid grid-cols-3 gap-1">
                <div>Fruits: {creationOptions.fruits.length}</div>
                <div>Sauces: {creationOptions.sauces.length}</div>
                <div>Céréales: {creationOptions.cereales.length}</div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-primary">{product.price} FCFA</span>
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            )}>
              {product.available ? 'Activé' : 'Désactivé'}
            </span>
          </div>


          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onEditProduct(product)}
              className="flex-1 bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
            >
              Modifier
            </button>

            <button
              onClick={() => onToggleAvailability(product.id, product.available)}
              className={cn(
                'flex-1 px-3 py-1 rounded text-xs transition-colors',
                product.available
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              )}
            >
              {product.available ? 'Désactiver' : 'Activer'}
            </button>

            <button
              onClick={() => onDeleteProduct(product)}
              className="flex-1 bg-red-100 text-red-800 px-3 py-1 rounded text-xs hover:bg-red-200 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}