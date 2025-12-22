import { useContext } from 'react';
import { BrandingContext } from '@/contexts/BrandingContextDefinition';

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}