import { useState, useMemo } from 'react';
import { Product, ProductCategory } from '@/types';

export function useProductFilters(allProducts: Product[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductCategory>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  const filteredAndSortedProducts = useMemo(() => {
    return allProducts
      .filter(product => {
        // Filtre recherche (seulement par nom)
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        // Filtre catégorie
        if (categoryFilter !== 'all' && product.category !== categoryFilter) {
          return false;
        }

        // Filtre disponibilité
        if (availabilityFilter !== 'all') {
          if (availabilityFilter === 'available' && !product.available) return false;
          if (availabilityFilter === 'unavailable' && product.available) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          default:
            return 0;
        }

        // Toujours trier en ordre croissant
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      });
  }, [allProducts, searchTerm, categoryFilter, availabilityFilter, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setAvailabilityFilter('all');
    setSortBy('name');
  };

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    availabilityFilter,
    setAvailabilityFilter,
    sortBy,
    setSortBy,
    filteredAndSortedProducts,
    resetFilters
  };
}