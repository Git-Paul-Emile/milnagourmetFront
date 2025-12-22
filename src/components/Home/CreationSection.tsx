import React from 'react';
import { CatalogSectionData } from '@/types';

interface CreationSectionProps {
  catalogData: CatalogSectionData | null;
  onCreationOpen: () => void;
}

export function CreationSection({ catalogData, onCreationOpen }: CreationSectionProps) {
  return (
    <div className="text-center py-20">
      <div className="bg-gradient-card rounded-2xl p-12 max-w-2xl mx-auto border border-border">
        <h3 className="text-2xl font-bold mb-4">{catalogData?.creationTitle || 'Création Personnalisée'}</h3>
        <p className="text-muted-foreground mb-8">
          {catalogData?.creationDescription || 'Composez votre yaourt gourmet selon vos envies ! Choisissez votre taille, vos fruits, vos sauces et vos céréales.'}
        </p>

        <button
          onClick={onCreationOpen}
          className="bg-gradient-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-glow hover:scale-105 transition-all"
        >
          {catalogData?.creationButtonText || 'Créer mon Gourmet'}
        </button>
      </div>
    </div>
  );
}