import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LegalSectionProps {
  isChristmasTheme?: boolean;
}

export function LegalSection({ isChristmasTheme = false }: LegalSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className={cn("text-lg font-semibold", "text-foreground")}>Informations</h3>
      <div className={cn("space-y-2 text-sm", "text-muted-foreground")}>
        <Link to="/politique-confidentialite" className={cn("block transition-colors", "hover:text-primary")}>
          Politique de confidentialité
        </Link>
        <Link to="/conditions-utilisation" className={cn("block transition-colors", "hover:text-primary")}>
          Conditions d'utilisation
        </Link>
        <Link to="/mentions-legales" className={cn("block transition-colors", "hover:text-primary")}>
          Mentions légales
        </Link>
      </div>
    </div>
  );
}