import { Toast } from '@/types';
import { AppAction } from '@/types/appState';

type ToastState = Toast[];

export function toastReducer(state: ToastState, action: AppAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.payload];
    case 'REMOVE_TOAST':
      return state.filter(toast => toast.id !== action.payload);
    default:
      return state;
  }
}