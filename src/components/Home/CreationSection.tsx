import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CatalogSectionData } from '@/types';

interface CreationSectionProps {
  catalogData: CatalogSectionData | null;
  onCreationOpen: () => void;
}

/**
 * Bandeau "Créez vos desserts" en pleine largeur, photo en fond.
 *
 * Photo : Wesual Click / Unsplash (fraises, myrtilles et yaourt) —
 * https://unsplash.com/photos/LymX5D2sSWM — servie par le CDN Unsplash,
 * recadrée et compressée à la volée via ses paramètres d'URL.
 *
 * Lisibilité : la photo est claire et très texturée, donc un voile sombre
 * est posé par-dessus. Sans lui, le texte blanc passerait sous le seuil de
 * contraste par endroits selon la zone de l'image.
 */

const BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1530259152377-3a014e1092e0?fm=jpg&q=70&w=2400&auto=format&fit=crop';

export function CreationSection({ catalogData, onCreationOpen }: CreationSectionProps) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Photo de fond */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
      />

      {/* Voile sombre : garantit le contraste du texte quelle que soit la
          zone de la photo qui se trouve derrière. */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/60" />

      {/* Contenu — py-[155px] = les 80px d'origine + 75px, soit 150px de
          hauteur supplémentaire au total pour la section. */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-[155px] text-center">
        {/* 65px sur grand écran ; tailles réduites en dessous, car 65px
            déborderait sur mobile. */}
        {/* Titre fixé ici volontairement : le champ "titre" du back-office
            contient encore l'ancien libellé et écraserait celui-ci. */}
        <h2 className="text-[38px] sm:text-[50px] lg:text-[65px] font-bold leading-tight text-white">
          Créez vos desserts
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90">
          {catalogData?.creationDescription ||
            'Composez votre yaourt gourmet selon vos envies ! Choisissez votre taille, vos fruits et vos sauces.'}
        </p>

        <button
          onClick={onCreationOpen}
          className="group relative inline-flex items-center justify-center space-x-2 mt-10 border border-[#43A2F2] bg-[#43A2F2] text-white px-8 py-3 rounded-lg font-semibold transform-gpu hover:scale-105 transition-all duration-500 ease-out animate-pulse-soft hover:border-[#4bb069] hover:bg-[#4bb069] hover:shadow-2xl hover:-translate-y-1"
        >
          <span className="relative z-10">{catalogData?.creationButtonText || 'Créer mon Gourmet'}</span>
          <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          <div className="absolute inset-0 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/30 to-primary-light/30" />
        </button>
      </div>
    </div>
  );
}
