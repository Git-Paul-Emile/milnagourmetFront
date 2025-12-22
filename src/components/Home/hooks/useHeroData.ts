import { useEffect, useState } from 'react';
import { siteService } from '@/services';
import { HeroData } from '@/types';

export function useHeroData() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        setLoading(true);

        const data = await siteService.getHeroData();
        setHeroData(data.data as HeroData);
      } catch (error) {
        console.error('Erreur lors du chargement des données Hero:', error);
        setHeroData(null);
      } finally {
        setLoading(false);
      }
    };

    loadHeroData();
  }, []);

  return { heroData, loading };
}