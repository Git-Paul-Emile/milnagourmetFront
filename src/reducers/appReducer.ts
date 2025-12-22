import { AppState, AppAction } from '@/types/appState';
import { cartReducer } from './cartReducer';
import { userReducer } from './userReducer';
import { toastReducer } from './toastReducer';
import { storeReducer } from './storeReducer';

// Reducer
export function appReducer(state: AppState, action: AppAction): AppState {
  return {
    cart: cartReducer(state.cart, action, state.user),
    user: userReducer(state.user, action),
    toasts: toastReducer(state.toasts, action),
    isStoreOpen: storeReducer(state.isStoreOpen, action),
  };
}