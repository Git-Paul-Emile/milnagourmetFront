import { createContext } from 'react';

export interface BrandingData {
  logo: string | null;
}

export interface BrandingContextType {
  branding: BrandingData;
  loading: boolean;
  error: string | null;
  refreshBranding: () => void;
}

export const BrandingContext = createContext<BrandingContextType | undefined>(undefined);