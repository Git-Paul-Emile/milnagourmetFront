import React from 'react';
import { cn } from '@/lib/utils';
import { ProductCategory, ProductCategoryItem } from '@/types';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: 'all' | ProductCategory;
  setCategoryFilter: (filter: 'all' | ProductCategory) => void;
  availabilityFilter: 'all' | 'available' | 'unavailable';
  setAvailabilityFilter: (filter: 'all' | 'available' | 'unavailable') => void;
  sortBy: 'name' | 'price';
  setSortBy: (sort: 'name' | 'price') => void;
  productCount: number;
  productCategories: ProductCategoryItem[];
  onReset: () => void;
}

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  availabilityFilter,
  setAvailabilityFilter,
  sortBy,
  setSortBy,
  productCount,
  productCategories,
  onReset
}: ProductFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium mb-1">Rechercher</label>
            <input
              type="text"
              placeholder="Nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-border rounded-lg"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'all' | ProductCategory)}
              className="w-full p-2 border border-border rounded-lg"
            >
              <option value="all">Toutes</option>
              <option value="cremeux">Crémeux</option>
              <option value="liquide">Liquide</option>
              <option value="creation">Création</option>
            </select>
          </div>

          {/* Disponibilité */}
          <div>
            <label className="block text-sm font-medium mb-1">Disponibilité</label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as 'all' | 'available' | 'unavailable')}
              className="w-full p-2 border border-border rounded-lg"
            >
              <option value="all">Tous</option>
              <option value="available">Activés</option>
              <option value="unavailable">Désactivés</option>
            </select>
          </div>

          {/* Tri */}
          <div>
            <label className="block text-sm font-medium mb-1">Trier par</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
              className="w-full p-2 border border-border rounded-lg"
            >
              <option value="name">Nom</option>
              <option value="price">Prix</option>
            </select>
          </div>
        </div>

        {/* Boutons d'actions */}
        <div className="flex sm:justify-start md:justify-end items-center mt-4">
          <div className="flex space-x-2">
            <button
              onClick={onReset}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}