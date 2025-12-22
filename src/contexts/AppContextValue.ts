import { createContext } from 'react';
import { AppState, AppAction } from './appContextHelpers';

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);