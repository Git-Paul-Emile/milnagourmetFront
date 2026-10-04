import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description?: string;
  noIndex?: boolean;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article';
}

const SITE_URL = 'https://milnagourmet.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-banner.jpg`;

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

function setPropertyMetaTag(property: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function buildCanonicalUrl(path: string): string {
  const cleanPath = path.split('?')[0]?.split('#')[0] || '/';
  return `${SITE_URL}${cleanPath === '/' ? '/' : cleanPath}`;
}

/**
 * Updates SEO tags for each SPA route.
 *
 * Crawlers often read the initial HTML first, while users navigate
 * client-side afterward. Keeping both static tags and route-level tags
 * avoids duplicated titles/descriptions across public pages.
 */
export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  noIndex = false,
  canonicalPath,
  image = DEFAULT_IMAGE,
  type = 'website',
}: SEOOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    const canonicalUrl = buildCanonicalUrl(canonicalPath ?? window.location.pathname);

    document.title = title;
    setMetaTag('description', description);
    setCanonical(canonicalUrl);

    setPropertyMetaTag('og:locale', 'fr_GA');
    setPropertyMetaTag('og:site_name', 'Milna Gourmet');
    setPropertyMetaTag('og:type', type);
    setPropertyMetaTag('og:title', title);
    setPropertyMetaTag('og:description', description);
    setPropertyMetaTag('og:url', canonicalUrl);
    setPropertyMetaTag('og:image', image);

    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    if (noIndex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else {
      setMetaTag('robots', 'index, follow');
    }

    return () => {
      document.title = previousTitle;
      setMetaTag('description', DEFAULT_DESCRIPTION);
    };
  }, [title, description, noIndex, canonicalPath, image, type]);
}

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION, SITE_URL };
