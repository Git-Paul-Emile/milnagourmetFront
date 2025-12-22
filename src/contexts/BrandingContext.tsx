import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { siteService } from '@/services';
import { BrandingContext, BrandingData } from './BrandingContextDefinition';

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingData>({ logo: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const loadBranding = useCallback(async () => {
    try {
      setLoading(true);
      const response = await siteService.getBranding();
      if (response.status === 'success' && response.data) {
        const logo = (response.data as { logo: string }).logo;
        let finalLogo = null;
        if (logo) {
          if (logo.startsWith('/uploads/')) {
            finalLogo = `${API_URL}${logo}`;
          } else {
            finalLogo = logo;
          }
        }
        setBranding({ logo: finalLogo });
      } else {
        setBranding({ logo: null });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du branding:', error);
      setBranding({ logo: null });
      setError('Erreur lors du chargement du logo');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const refreshBranding = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    loadBranding();
  }, [loadBranding, refreshKey]);

  // Écouter les changements de thème pour recharger le branding
  useEffect(() => {
    const handleThemeChange = () => {
      refreshBranding();
    };

    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, [refreshBranding]);

  return (
    <BrandingContext.Provider value={{ branding, loading, error, refreshBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}