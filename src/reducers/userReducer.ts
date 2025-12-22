import { AuthUser } from '@/types';
import { AppAction } from '@/types/appState';

type UserState = AuthUser | null;

export function userReducer(state: UserState, action: AppAction): UserState {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'UPDATE_USER':
      return state ? { ...state, ...action.payload } : null;
    default:
      return state;
  }
}