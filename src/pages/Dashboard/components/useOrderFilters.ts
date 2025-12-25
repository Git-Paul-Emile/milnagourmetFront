import { useState, useMemo } from 'react';
import { Order } from '@/types';

export type StatusFilter = 'all' | 'recu' | 'livree' | 'annulee';
export type DateFilter = 'all' | 'today' | 'week' | 'month';
export type SortBy = 'date' | 'total';
export type SortOrder = 'asc' | 'desc';

export interface OrderFiltersState {
  searchTerm: string;
  statusFilter: StatusFilter;
  dateFilter: DateFilter;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface OrderFiltersActions {
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setDateFilter: (filter: DateFilter) => void;
  setSortBy: (sort: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  resetFilters: () => void;
}

export function useOrderFilters(orders: Order[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter(order => {
        // Filtre recherche : nom du client ou nom du produit
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const customerNameMatch = order.customer?.name?.toLowerCase().includes(searchLower);
          const productNameMatch = order.items?.some(item => 
            item.product?.name?.toLowerCase().includes(searchLower)
          );
          
          if (!customerNameMatch && !productNameMatch) {
            return false;
          }
        }

        // Filtre statut (le backend renvoie les statuts en minuscules)
        if (statusFilter !== 'all') {
          const orderStatus = order.status ? String(order.status).toLowerCase() : '';
          if (orderStatus !== statusFilter) {
            return false;
          }
        }

        // Filtre date
        if (dateFilter !== 'all') {
          const orderDate = new Date(order.date || order.createdAt || '');
          if (isNaN(orderDate.getTime())) return false;
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          orderDate.setHours(0, 0, 0, 0);

          switch (dateFilter) {
            case 'today': {
              // Commandes d'aujourd'hui
              if (orderDate.getTime() !== today.getTime()) return false;
              break;
            }
            case 'week': {
              // Cette semaine (7 derniers jours)
              const weekAgo = new Date(today);
              weekAgo.setDate(today.getDate() - 7);
              if (orderDate < weekAgo) return false;
              break;
            }
            case 'month': {
              // Ce mois
              const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
              if (orderDate < monthStart) return false;
              break;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        let aValue: number;
        let bValue: number;

        switch (sortBy) {
          case 'date':
            aValue = new Date(a.date || a.createdAt || '').getTime();
            bValue = new Date(b.date || b.createdAt || '').getTime();
            break;
          case 'total':
            aValue = a.total || 0;
            bValue = b.total || 0;
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
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  const state: OrderFiltersState = {
    searchTerm,
    statusFilter,
    dateFilter,
    sortBy,
    sortOrder,
  };

  const actions: OrderFiltersActions = {
    setSearchTerm,
    setStatusFilter,
    setDateFilter,
    setSortBy,
    setSortOrder,
    resetFilters,
  };

  return {
    state,
    actions,
    filteredAndSortedOrders,
  };
}