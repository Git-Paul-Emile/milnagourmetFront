import { useState, useMemo } from 'react';
import { Order } from '@/types';

export const useOrderFilters = (orders: Order[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'recu' | 'en_preparation' | 'livraison' | 'livree'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        // Filtre recherche
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchesCustomer = order.customer?.name?.toLowerCase().includes(term);
          const matchesPhone = order.customer?.phone?.includes(term);
          const matchesProduct = order.items.some(item =>
            item.name.toLowerCase().includes(term) ||
            item.product?.name?.toLowerCase().includes(term)
          );

          if (!matchesCustomer && !matchesPhone && !matchesProduct) {
            return false;
          }
        }


        // Filtre statut
        if (statusFilter !== 'all') {
          if (order.status !== statusFilter) {
            return false;
          }
        }

        // Filtre date
        if (dateFilter !== 'all') {
          const orderDate = new Date(order.date || order.createdAt || '');
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          switch (dateFilter) {
            case 'today': {
              if (orderDate < today) return false;
              break;
            }
            case 'week': {
              const weekAgo = new Date(today);
              weekAgo.setDate(today.getDate() - 7);
              if (orderDate < weekAgo) return false;
              break;
            }
            case 'month': {
              const monthAgo = new Date(today);
              monthAgo.setMonth(today.getMonth() - 1);
              if (orderDate < monthAgo) return false;
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

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredOrders,
    resetFilters
  };
};