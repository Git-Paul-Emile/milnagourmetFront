import React from 'react';
import { OrderFilters } from './OrderFilters';
import { OrderStats } from './OrderStats';
import { OrderList } from './OrderList';
import { OrderLoadingState } from './OrderLoadingState';
import { OrderEmptyState } from './OrderEmptyState';
import { Order } from '@/types';

interface OrderManagementContentProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'recu' | 'en_preparation' | 'livraison' | 'livree';
  setStatusFilter: (filter: 'all' | 'recu' | 'en_preparation' | 'livraison' | 'livree') => void;
  dateFilter: 'all' | 'today' | 'week' | 'month';
  setDateFilter: (filter: 'all' | 'today' | 'week' | 'month') => void;
  loading: boolean;
  filteredOrders: Order[];
  onSelectOrder: (order: Order | null) => void;
}

export function OrderManagementBody({
  showFilters,
  setShowFilters,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  loading,
  filteredOrders,
  onSelectOrder,
}: OrderManagementContentProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-6 pb-0">
        {showFilters && (
          <div className="mb-4">
            <OrderFilters
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          </div>
        )}

        {!loading && filteredOrders.length > 0 && (
          <div className="mb-4">
            <OrderStats filteredOrders={filteredOrders} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <OrderLoadingState />
        ) : filteredOrders.length === 0 ? (
          <OrderEmptyState />
        ) : (
          <OrderList filteredOrders={filteredOrders} onSelectOrder={onSelectOrder} />
        )}
      </div>
    </div>
  );
}