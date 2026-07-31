import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Bouton « retour en haut ».
 *
 * RÉSERVÉ AU DESKTOP
 * ------------------
 * Il est masqué sur mobile et en mode installé, pour deux raisons :
 *
 *   - le geste de remontée rapide existe déjà nativement sur téléphone
 *     (appui sur la barre d'état iOS, défilement inertiel ailleurs) ;
 *   - en PWA, il entrerait en concurrence visuelle avec le bouton panier
 *     de la barre de navigation basse, dans la même zone du pouce.
 *
 * Le masquage se fait en CSS (`hidden lg:flex`) plutôt qu'en JavaScript :
 * pas de rendu conditionnel à recalculer, et le comportement suit
 * immédiatement une rotation d'écran ou un redimensionnement.
 */
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        // Masqué en dessous de 1024 px : mobile, tablette et PWA installée.
        'hidden lg:flex',
        'fixed bottom-8 right-8 z-50 items-center justify-center p-3 bg-button border-0 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-button hover:text-white hover:border-0 hover:scale-110',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      )}
      aria-label="Retour en haut"
    >
      <ArrowUp className="h-6 w-6 text-white" />
    </button>
  );
}
