import { CartItem, AuthUser, Toast } from '@/types';

// Types pour le context
export interface AppState {
  cart: {
    items: CartItem[];
    total: number;
    itemCount: number;
    deliveryFee: number;
    totalWithDelivery: number;
  };
  user: AuthUser | null;
  toasts: Toast[];
  isStoreOpen: boolean;
}

export type AppAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_CART_LOCAL' }
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'UPDATE_USER'; payload: Partial<AuthUser> }
  | { type: 'UPDATE_DELIVERY_FEE'; payload: number }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_STORE_STATUS'; payload: boolean };

// État initial
export const initialState: AppState = {
  cart: {
    items: [],
    total: 0,
    itemCount: 0,
    deliveryFee: 0,
    totalWithDelivery: 0
  },
  user: null,
  toasts: [],
  isStoreOpen: true
};