import React from 'react';
import { Edit, Trash2, Plus, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductCategoryItem } from '@/types';

interface CategoryManagementProps {
  productCategories: ProductCategoryItem[];
  onAddCategory: () => void;
  onEditCategory: (category: ProductCategoryItem) => void;
  onDeleteCategory: (category: ProductCategoryItem) => void;
  onToggleCategoryStatus: (categoryId: number, currentStatus: boolean) => void;
}

export function CategoryManagement({
  productCategories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onToggleCategoryStatus
}: CategoryManagementProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-xl sm:text-2xl font-bold">Gestion des catégories</h3>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <p className="text-sm text-muted-foreground">
          Gérez les catégories de produits pour organiser votre catalogue
        </p>
        <button
          onClick={onAddCategory}
          className="w-full sm:w-auto bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center justify-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      <div className="space-y-3">
        {productCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucune catégorie définie. Ajoutez-en une pour commencer à organiser vos produits.
          </p>
        ) : (
          productCategories.map((category) => (
            <div key={category.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium">{category.name}</span>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <button
                  onClick={() => onToggleCategoryStatus(category.id, category.active)}
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors',
                    category.active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                  )}
                  title={category.active ? 'Désactiver la catégorie' : 'Activer la catégorie'}
                >
                  {category.active ? 'Active' : 'Inactive'}
                </button>
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEditCategory(category)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}