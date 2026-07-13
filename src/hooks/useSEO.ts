import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE = 'Milna Gourmet - Le Salon du Yaourt | Yaourts Gourmets Faits Maison';
const DEFAULT_DESCRIPTION =
  'Découvrez Milna Gourmet, votre salon du yaourt premium à Dakar. Yaourts crémeux, liquides et créations personnalisées. Commandez via WhatsApp - Livraison rapide au Sénégal.';

function setMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

// Gère le titre et les meta SEO par page (une SPA doit avoir un titre/description
// distincts par route pour un référencement correct - règle 9 des standards du projet).
export function useSEO({ title, description = DEFAULT_DESCRIPTION, noIndex = false }: SEOOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    setMetaTag('description', description);
    setMetaTag('og:title', title, 'property');
    setMetaTag('og:description', description, 'property');

    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noIndex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else if (robots) {
      robots.remove();
    }

    return () => {
      document.title = previousTitle;
      setMetaTag('description', DEFAULT_DESCRIPTION);
    };
  }, [title, description, noIndex]);
}

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION };
