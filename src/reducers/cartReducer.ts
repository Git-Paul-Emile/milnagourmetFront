import { CartItem, AuthUser } from '@/types';
import { AppAction } from '@/types/appState';
import { calculateCartTotals } from '@/utils/cartCalculations';
import { persistCartActionToBackend } from '@/utils/cartPersistence';
import { persistCart, clearLocalCart } from '@/hooks/useLocalCart';

type CartState = {
  items: CartItem[];
  total: number;
  itemCount: number;
  deliveryFee: number;
  totalWithDelivery: number;
};

export function cartReducer(state: CartState, action: AppAction, user?: AuthUser | null): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let newItems;

      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      const totals = calculateCartTotals(newItems, state.deliveryFee);

      const newState = { items: newItems, ...totals };

      // Persister en backend si utilisateur connecté
      if (user) {
        if (existingItem) {
          const updatedItem = newItems.find(item => item.id === action.payload.id);
          if (updatedItem) {
            persistCartActionToBackend('update', updatedItem, user);
          }
        } else {
          persistCartActionToBackend('add', action.payload, user);
        }
      } else if (typeof window !== 'undefined') {
        // Persister pour les invités dans localStorage
        const localCartItems = newState.items.map(item => ({
          id: item.id,
          name: item.name || '',
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          description: item.description || ''
        }));

        const localCart = {
          items: localCartItems,
          updatedAt: Date.now()
        };

        try {
          persistCart(localCart);
        } catch (error) {
          console.error('Erreur lors de la persistance du panier invité:', error);
        }
      }

      return newState;
    }

    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totals = calculateCartTotals(newItems, state.deliveryFee);

      const newState = { items: newItems, ...totals };

      // Persister en backend si utilisateur connecté
      if (user && itemToRemove) {
        persistCartActionToBackend('remove', itemToRemove, user);
      } else if (typeof window !== 'undefined') {
        // Persister pour les invités dans localStorage
        const localCartItems = newState.items.map(item => ({
          id: item.id,
          name: item.name || '',
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          description: item.description || ''
        }));

        const localCart = {
          items: localCartItems,
          updatedAt: Date.now()
        };

        try {
          persistCart(localCart);
        } catch (error) {
          console.error('Erreur lors de la persistance du panier invité:', error);
        }
      }

      return newState;
    }

    case 'UPDATE_CART_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);

      const totals = calculateCartTotals(newItems, state.deliveryFee);

      const updatedItem = newItems.find(item => item.id === action.payload.id) ||
                          state.items.find(item => item.id === action.payload.id);

      const newState = { items: newItems, ...totals };

      // Persister en backend si utilisateur connecté
      if (user && updatedItem) {
        if (action.payload.quantity > 0) {
          persistCartActionToBackend('update', { ...updatedItem, quantity: action.payload.quantity }, user);
        } else {
          persistCartActionToBackend('remove', { id: action.payload.id } as CartItem, user);
        }
      } else if (typeof window !== 'undefined') {
        // Persister pour les invités dans localStorage
        const localCartItems = newState.items.map(item => ({
          id: item.id,
          name: item.name || '',
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          description: item.description || ''
        }));

        const localCart = {
          items: localCartItems,
          updatedAt: Date.now()
        };

        try {
          persistCart(localCart);
        } catch (error) {
          console.error('Erreur lors de la persistance du panier invité:', error);
        }
      }

      return newState;
    }

    case 'CLEAR_CART': {
      const newState = { items: [], total: 0, itemCount: 0, deliveryFee: 0, totalWithDelivery: 0 };

      // Persister en backend si utilisateur connecté
      if (user) {
        persistCartActionToBackend('clear', undefined, user);
      }

      // Vider le localStorage pour éviter que le panier se recharge au refresh
      if (typeof window !== 'undefined') {
        if (user) {
          // Pour les utilisateurs connectés, vider l'ancien localStorage si présent
          localStorage.removeItem('milna-cart');
        } else {
          // Pour les invités, vider le panier guest
          clearLocalCart();
        }
      }

      return newState;
    }

    case 'SET_CART_ITEMS': {
      const totals = calculateCartTotals(action.payload, state.deliveryFee);
      return { items: action.payload, ...totals };
    }

    case 'CLEAR_CART_LOCAL': {
      return { items: [], total: 0, itemCount: 0, deliveryFee: 0, totalWithDelivery: 0 };
    }

    case 'UPDATE_DELIVERY_FEE': {
      const totals = calculateCartTotals(state.items, action.payload);
      return { ...state, ...totals };
    }

    default:
      return state;
  }
}