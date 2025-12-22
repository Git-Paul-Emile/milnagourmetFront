import { AppAction } from '@/types/appState';

type StoreState = boolean;

export function storeReducer(state: StoreState, action: AppAction): StoreState {
  switch (action.type) {
    case 'SET_STORE_STATUS':
      return action.payload;
    default:
      return state;
  }
}