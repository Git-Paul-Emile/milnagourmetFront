import React, { createContext } from 'react';
import { Order } from '@/types';

export interface OrderContextType {
  // État des commandes
  orders: Order[];
  loading: boolean;
  filteredOrders: Order[];

  // Filtres
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'recu' | 'livree' | 'annulee';
  setStatusFilter: (filter: 'all' | 'recu' | 'livree' | 'annulee') => void;
  dateFilter: 'all' | 'today' | 'week' | 'month';
  setDateFilter: (filter: 'all' | 'today' | 'week' | 'month') => void;
  sortBy: 'date' | 'total';
  setSortBy: (sort: 'date' | 'total') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  resetFilters: () => void;

  // Actions
  updateOrderStatus: (orderId: string, status: Order['status'], message?: string) => Promise<void>;
  isProcessing: boolean;

  // Modal
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;

  // Toast
  toastMessage: string;
  isToastVisible: boolean;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);