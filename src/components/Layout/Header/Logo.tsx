import React from 'react';
import { Link } from 'react-router-dom';
import { useBranding } from '@/hooks/useBranding';
import { cn } from '@/lib/utils';

export function Logo() {
  const { branding } = useBranding();

  return (
    <Link to="/" className="flex items-center space-x-3">
      {branding.logo && (
        <img
          src={branding.logo}
          alt="Milna Gourmet"
          /* Pas d'animation ici : le battement est réservé à l'écran de
             lancement. Répété en permanence dans l'en-tête, il attire
             l'œil en continu et fatigue à la lecture. */
          className="h-12 w-12"
        />
      )}
      {/* Texte de marque : masqué sur mobile/PWA (logo seul), conservé en desktop large */}
      <div className="hidden lg:block">
        <h1 className={cn(
          "text-xl font-bold",
          "text-primary"
        )}>Milna Gourmet</h1>
        <p className={cn(
          "text-xs",
          "text-muted-foreground"
        )}>Le Salon du Yaourt</p>
      </div>
    </Link>
  );
}