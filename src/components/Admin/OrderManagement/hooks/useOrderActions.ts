import { useState } from 'react';
import { Order } from '@/types';
import { sendOrderConfirmationMessage, sendOrderCancellationMessage } from '../services/notificationService';

export const useOrderActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const updateOrderStatus = (
    orderId: string,
    status: Order['status'],
    message?: string,
    selectedOrder?: Order | null
  ) => {
    try {
      setIsProcessing(true);

      // Ici, on pourrait appeler une API pour mettre à jour le statut
      // Pour l'instant, on simule avec les hooks existants

      // Envoyer une notification WhatsApp au client si la commande est confirmée
      if (status === 'confirmed' && selectedOrder) {
        sendOrderConfirmationMessage(selectedOrder);
      }

      // Si refusée, envoyer le message personnalisé
      if (status === 'cancelled' && selectedOrder && message) {
        sendOrderCancellationMessage(selectedOrder, message);
      }

    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    updateOrderStatus,
    isProcessing,
  };
};