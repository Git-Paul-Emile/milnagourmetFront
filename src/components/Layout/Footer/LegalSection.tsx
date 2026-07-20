import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function LegalSection() {
  return (
    <div className="space-y-4">
      <h3 className={cn("text-lg font-semibold", "text-white")}>Informations</h3>
      <div className={cn("space-y-2 text-sm", "text-white/80")}>
        <Link to="/politique-confidentialite" className="block">
          Politique de confidentialité
        </Link>
        <Link to="/conditions-utilisation" className="block">
          Conditions d'utilisation
        </Link>
        <Link to="/mentions-legales" className="block">
          Mentions légales
        </Link>
      </div>
    </div>
  );
}