import { useState, useEffect } from 'react';
import { configService, type AppConfig } from '@/services/configService';

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const appConfig = await configService.getAllConfig();
        setConfig(appConfig);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement de la configuration:', err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
}




