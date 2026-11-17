import { QueryClient } from '@tanstack/react-query';

/**
 * Cache des données serveur (TanStack Query).
 *
 * Ce que le cache apporte par rapport à un `useEffect` + `useState` :
 *   - deux composants qui demandent la même donnée ne déclenchent qu'UNE
 *     requête (déduplication par clé) ;
 *   - au retour sur une page, la donnée en cache s'affiche immédiatement
 *     et se rafraîchit en arrière-plan, sans squelette de chargement ;
 *   - un échec réseau est retenté une fois avant d'être signalé.
 *
 * `staleTime: 0` : une donnée est toujours revalidée à l'affichage, pour
 * qu'une modification faite dans le dashboard soit visible sans délai.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Clés de cache centralisées : une faute de frappe créerait un second cache. */
export const queryKeys = {
  catalogSection: ['site', 'catalog-section'] as const,
  products: ['products'] as const,
  productCategories: ['product-categories'] as const,
  contactSection: ['site', 'contact-section'] as const,
  hero: ['site', 'hero'] as const,
  testimonials: ['site', 'testimonials'] as const,
  contactInfo: ['site', 'contact-info'] as const,
  socialMedia: ['site', 'social-media'] as const,
  appConfig: ['config'] as const,
  activeDeliveryZones: ['delivery-zones', 'active'] as const,
  pwaStats: ['pwa-stats'] as const,
};
