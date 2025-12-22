// Re-export des types
export type { AppState, AppAction } from '@/types/appState';
export { initialState } from '@/types/appState';

// Re-export des utilitaires de calcul
export { calculateDeliveryFee, calculateCartTotals } from '@/utils/cartCalculations';

// Re-export de la persistance
export { persistCartActionToBackend } from '@/utils/cartPersistence';

// Re-export du reducer
export { appReducer } from '@/reducers/appReducer';