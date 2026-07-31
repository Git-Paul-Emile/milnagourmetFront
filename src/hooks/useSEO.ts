import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE =
  'Milna Gourmet - Le Salon du Yaourt à Libreville | Yaourts Gourmets Faits Maison';
const DEFAULT_DESCRIPTION =
  'Milna Gourmet, votre salon du yaourt premium à Libreville, Gabon. Yaourts crémeux, liquides et créations personnalisées. Commande en ligne, paiement à la livraison.';

function setMetaTag(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Gère le titre et la meta description par page.
 *
 * Une SPA rend toutes ses pages depuis le même index.html : sans ce hook,
 * `/mentions-legales` hériterait du titre de l'accueil, ce que les moteurs
 * de recherche pénalisent (contenu dupliqué au niveau des métadonnées).
 *
 * Les balises Open Graph / Twitter ne sont volontairement plus gérées :
 * la fonctionnalité de partage social a été retirée du produit.
 */
export function useSEO({ title, description = DEFAULT_DESCRIPTION, noIndex = false }: SEOOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    setMetaTag('description', description);

    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noIndex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else if (robots) {
      robots.remove();
    }

    // Restauration à la sortie de la page : évite qu'un titre de page
    // secondaire « colle » lors d'une navigation client.
    return () => {
      document.title = previousTitle;
      setMetaTag('description', DEFAULT_DESCRIPTION);
    };
  }, [title, description, noIndex]);
}

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION };
