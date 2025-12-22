import { useState, useMemo } from 'react';
import { User as UserType } from '@/types';

export function useUserFilters(users: UserType[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  // Tri par défaut : date d'inscription
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'orders' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(user => {
        // Filtre recherche
        // Recherche uniquement par nom et téléphone comme demandé
        if (
          searchTerm &&
          !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !user.phone.includes(searchTerm)
        ) {
          return false;
        }

        // Filtre statut
        if (statusFilter !== 'all') {
          if (statusFilter === 'active' && user.blocked) return false;
          if (statusFilter === 'blocked' && !user.blocked) return false;
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
          case 'email':
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          case 'orders':
            aValue = a.orders?.length || 0;
            bValue = b.orders?.length || 0;
            break;
          case 'date':
            aValue = new Date(a.createdAt || '').getTime();
            bValue = new Date(b.createdAt || '').getTime();
            break;
          default:
            return 0;
        }

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
  }, [users, searchTerm, statusFilter, sortBy, sortOrder]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    // Réinitialisation sur la date d'inscription
    setSortBy('date');
    setSortOrder('desc');
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredAndSortedUsers,
    resetFilters,
  };
}