import { useState, useEffect } from 'react';
import { siteService } from '@/services';

export function useNavigation() {
  const [navigation, setNavigation] = useState<{ name: string; href: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        const navData = await siteService.getNavigation();
        setNavigation(navData.data as { name: string; href: string }[]);
      } catch (error) {
        console.error('Erreur lors du chargement de la navigation:', error);
        setNavigation([
          { name: 'Accueil', href: '#home' },
          { name: 'Catalogue', href: '#catalog' },
          { name: 'Témoignages', href: '#testimonials' },
          { name: 'Contact', href: '#contact' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadNavigation();
  }, []);

  return { navigation, loading };
}