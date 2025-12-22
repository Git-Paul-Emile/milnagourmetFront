import React, { useReducer, useEffect } from 'react';
import { CartItem } from '@/types';
import { calculateDeliveryFee, initialState, appReducer } from './appContextHelpers';
import { AppContext } from './AppContextValue';

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);



  // L'utilisateur est maintenant géré uniquement via AuthContext
  // Les données utilisateur sont récupérées depuis l'API quand nécessaire

  // Mettre à jour les frais de livraison et charger le panier quand l'utilisateur change
  useEffect(() => {
    const updateDeliveryFee = async () => {
      const fee = await calculateDeliveryFee(state.user);
      dispatch({ type: 'UPDATE_DELIVERY_FEE', payload: fee });
    };

    const loadCart = async () => {
      if (state.user) {
        // Utilisateur connecté : charger depuis le backend
        try {
          const { cartService } = await import('@/services/cart');
          const backendCart = await cartService.getCart();

          if (backendCart?.items?.length > 0) {
            // Convertir les items
            const frontendCartItems = backendCart.items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              description: item.description,
              product: item.product,
              customCreation: item.customCreation,
            }));

            // Définir les items du panier sans déclencher de persistance
            dispatch({ type: 'SET_CART_ITEMS', payload: frontendCartItems });
          }
        } catch (error) {
          console.error('Erreur lors du chargement du panier utilisateur:', error);
        }
      } else {
        // Invité : charger depuis le localStorage
        try {
          const { loadCart: loadGuestCart } = await import('@/hooks/useLocalCart');
          const guestCart = loadGuestCart();

          if (guestCart?.items?.length > 0) {
            // Convertir les items
            const frontendCartItems = guestCart.items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              description: item.description,
              product: undefined,
              customCreation: undefined,
            }));

            // Définir les items du panier sans déclencher de persistance
            dispatch({ type: 'SET_CART_ITEMS', payload: frontendCartItems });
          }
        } catch (error) {
          console.error('Erreur lors du chargement du panier invité:', error);
        }
      }
    };

    updateDeliveryFee();
    loadCart();
  }, [state.user]);

  // Listen for auth logout events
  useEffect(() => {
    const handleAuthLogout = () => {
      dispatch({ type: 'SET_USER', payload: null });
    };

    window.addEventListener('authLogout', handleAuthLogout);

    return () => {
      window.removeEventListener('authLogout', handleAuthLogout);
    };
  }, []);

  // Listen for authUpdate events (login / refresh / register)
  // Note: Le chargement du panier après connexion est géré dans AuthModal.tsx pour éviter les conflits
  useEffect(() => {
    const handleAuthUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent?.detail) {
        dispatch({ type: 'SET_USER', payload: customEvent.detail });
        // Le panier est chargé dans AuthModal.tsx après la connexion
      }
    };

    window.addEventListener('authUpdated', handleAuthUpdate);

    return () => {
      window.removeEventListener('authUpdated', handleAuthUpdate);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}