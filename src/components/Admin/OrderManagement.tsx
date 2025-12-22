import React, { useState } from 'react';
import { Modal } from '../Modal';
import { SuccessToast } from '../SuccessToast';
import { OrderDetailsModal } from './OrderManagement/components/OrderDetailsModal';
import { OrderManagementHeader } from './OrderManagement/components/OrderManagementHeader';
import { OrderManagementBody } from './OrderManagement/components/OrderManagementContent';
import { OrderProvider } from './OrderManagement/context/OrderContext';
import { useOrderContext } from './OrderManagement/context/useOrderContext';
import { useExport } from './OrderManagement/hooks/useExport';
import { Order } from '@/types';

interface OrderManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderManagementContent: React.FC<OrderManagementProps> = ({ isOpen, onClose }) => {
  const {
    loading,
    filteredOrders,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    updateOrderStatus,
    isProcessing,
    selectedOrder,
    setSelectedOrder,
    toastMessage,
    isToastVisible,
    hideToast,
  } = useOrderContext();

  const [showFilters, setShowFilters] = useState(false);
  const { handleExport } = useExport();

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status'], message?: string) => {
    try {
      await updateOrderStatus(orderId, status, message);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      // Ne pas fermer le modal en cas d'erreur pour permettre à l'utilisateur de réessayer
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-background rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-border">
        <div className="flex-shrink-0">
          <OrderManagementHeader
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
            onExport={() => handleExport(filteredOrders)}
            onClose={onClose}
          />
        </div>
        <div className="flex-1 min-h-0">
          <OrderManagementBody
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            loading={loading}
            filteredOrders={filteredOrders}
            onSelectOrder={setSelectedOrder}
          />
        </div>
      </div>

      <OrderDetailsModal
        selectedOrder={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
        isProcessing={isProcessing}
      />

      <SuccessToast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={hideToast}
      />
    </Modal>
  );
};

export function OrderManagement({ isOpen, onClose }: OrderManagementProps) {
  return (
    <OrderProvider>
      <OrderManagementContent isOpen={isOpen} onClose={onClose} />
    </OrderProvider>
  );
}