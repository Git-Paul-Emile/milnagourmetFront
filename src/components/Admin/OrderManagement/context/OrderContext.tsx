import React, { useState, ReactNode } from 'react';
import { Order } from '@/types';
import { useOrders } from '../hooks/useOrders';
import { useOrderFilters } from '../hooks/useOrderFilters';
import { OrderContext, OrderContextType } from './OrderContextDefinition';

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const { orders, loading, updateOrderStatus: updateStatus, assignDeliveryPerson: assignPerson } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const {
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
  } = useOrderFilters(orders);

  const updateOrderStatus = async (orderId: string, status: Order['status'], message?: string) => {
    setIsProcessing(true);
    try {
      await updateStatus(orderId, status, message);

      // La notification WhatsApp au client est envoyée automatiquement par le backend

      // Afficher le toast de succès
      const statusMessages = {
        'livree': 'Commande livrée avec succès',
        'annulee': 'Commande annulée'
      };
      const messageToast = statusMessages[status] || 'Statut mis à jour avec succès';
      showToast(messageToast);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error; // Re-throw pour que l'appelant puisse gérer l'erreur
    } finally {
      setIsProcessing(false);
    }
  };

  const assignDeliveryPerson = async (orderId: string, livreurId: string | null) => {
    setIsProcessing(true);
    try {
      const deliveryPerson = await assignPerson(orderId, livreurId);
      setSelectedOrder(prev => (prev && prev.id === orderId ? { ...prev, deliveryPerson } : prev));
      showToast(livreurId ? 'Livreur assigné avec succès' : 'Livreur retiré avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'assignation du livreur:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    // Masquer automatiquement après 3 secondes
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  const hideToast = () => {
    setIsToastVisible(false);
  };

  const value: OrderContextType = {
    orders,
    loading,
    filteredOrders,
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
    resetFilters,
    updateOrderStatus,
    assignDeliveryPerson,
    isProcessing,
    selectedOrder,
    setSelectedOrder,
    toastMessage,
    isToastVisible,
    showToast,
    hideToast,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};