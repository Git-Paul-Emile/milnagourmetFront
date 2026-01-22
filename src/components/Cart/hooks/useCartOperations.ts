import { useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { sendCartOrderToWhatsApp } from '@/services/whatsapp';
import { User, DeliveryZone } from '@/types';
import { useAvatarToast } from '@/hooks/useAvatarToast';

export function useCartOperations(deliveryZone: DeliveryZone | null, onOrderSuccess?: () => void) {
  const { state, dispatch } = useApp();
  const avatarToast = useAvatarToast();
  const [isOrdering, setIsOrdering] = useState(false);
  const [isCustomerInfoModalOpen, setIsCustomerInfoModalOpen] = useState(false);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleOrder = async () => {
    if (state.cart.items.length === 0) return;

    // Si l'utilisateur n'est pas connecté, ouvrir le modal d'informations client
    if (!state.user) {
      setIsCustomerInfoModalOpen(true);
      return;
    }

    // Si l'utilisateur est connecté, procéder directement
    setIsOrdering(true);
    try {
      // Adapter l'AuthUser au format User attendu par la fonction
      const adaptedUser: User = {
        id: state.user.id,
        name: state.user.nomComplet,
        phone: state.user.telephone,
        deliveryZoneId: deliveryZone?.id || '',
        orders: [],
        createdAt: state.user.createdAt
      };

      await sendCartOrderToWhatsApp(state.cart, adaptedUser, state.cart.pointsUsed);
      dispatch({ type: 'ADD_TOAST', payload: {
        id: Date.now().toString(),
        type: 'success',
        message: 'Commande envoyée !',
        avatar: avatarToast
      }});

      clearCart();
      onOrderSuccess?.();
    } catch (error) {
      dispatch({ type: 'ADD_TOAST', payload: {
        id: Date.now().toString(),
        type: 'error',
        message: 'Impossible d\'envoyer la commande. Veuillez réessayer.',
        avatar: avatarToast
      }});
    } finally {
      setIsOrdering(false);
    }
  };

  return {
    isOrdering,
    isCustomerInfoModalOpen,
    setIsCustomerInfoModalOpen,
    updateQuantity,
    removeItem,
    clearCart,
    handleOrder
  };
}