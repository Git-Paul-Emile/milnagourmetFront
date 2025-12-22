import { useContext } from 'react';
import { AppContext } from './AppContextValue';

// Hook personnalisé
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé dans un AppProvider');
  }
  return context;
}