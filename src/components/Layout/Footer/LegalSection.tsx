import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function LegalSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h3 className={cn("text-lg font-semibold", "text-white")}>Informations</h3>
      <div className={cn("mt-4 flex flex-wrap items-center justify-center gap-4 text-sm", "text-white/80")}> 
        <Link to="/politique-confidentialite" className="transition-colors hover:text-white">
          Politique de confidentialité
        </Link>
        <Link to="/conditions-utilisation" className="transition-colors hover:text-white">
          Conditions d'utilisation
        </Link>
        <Link to="/mentions-legales" className="transition-colors hover:text-white">
          Mentions légales
        </Link>
      </div>
    </div>
  );
}