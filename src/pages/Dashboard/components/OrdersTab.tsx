import React from 'react';
import { Order } from '@/types';
import { DashboardStats } from './types';
import { useOrderFilters } from './useOrderFilters';
import { OrderFilters } from './OrderFilters';
import { OrderList } from './OrderList';
import OrderStatusStats from './OrderStatusStats';

interface OrdersTabProps {
  orders: Order[];
  stats: DashboardStats;
  setIsOrderManagementOpen: (open: boolean) => void;
  displaySuccessToast: (message: string) => void;
}

export function OrdersTab({ orders, stats, setIsOrderManagementOpen, displaySuccessToast }: OrdersTabProps) {
  const { state, actions, filteredAndSortedOrders } = useOrderFilters(orders);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold">Gestion des commandes</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsOrderManagementOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ouvrir le gestionnaire
          </button>
        </div>
      </div>

      {/* Statistiques des commandes */}
      <OrderStatusStats stats={stats} />

      {/* Filtres avancés */}
      <OrderFilters
        state={state}
        actions={actions}
      />

      {/* Liste des commandes filtrées */}
      <OrderList orders={filteredAndSortedOrders} filteredOrdersCount={filteredAndSortedOrders.length} />
    </div>
  );
}