import { createContext } from 'react';
import { Theme, ThemeColors } from '@/services/themeService';

export interface ThemeContextType {
  theme: Theme | null;
  themes: Theme[];
  loading: boolean;
  error: string | null;
  applyTheme: (theme: Theme) => void;
  refreshThemes: () => void;
  setActiveTheme: (themeId: number) => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);