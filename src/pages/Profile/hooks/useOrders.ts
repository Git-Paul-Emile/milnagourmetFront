import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/types';
import { orderService } from '@/services';
import { filterAndSortOrders } from '@/pages/Profile/utils';
import { OrdersFilters, UseOrdersReturn } from '@/pages/Profile/types';

export const useOrders = (): UseOrdersReturn => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<OrdersFilters>({
    searchTerm: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        const response = await orderService.getMyOrders();
        setOrders(response.data as Order[] || []);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const filteredOrders = useMemo(() => {
    return filterAndSortOrders(orders, filters.searchTerm, filters.sortBy, filters.sortOrder);
  }, [orders, filters]);

  return {
    orders,
    loading,
    filteredOrders,
    filters,
    setFilters
  };
};