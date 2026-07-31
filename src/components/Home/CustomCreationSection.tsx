import React, { useEffect, useState } from 'react';
import { CatalogSectionData } from '@/types';
import { siteService } from '@/services';
import { CustomCreation } from '@/components/Product/CustomCreation';
import { useShellUi } from '@/contexts/useShellUi';
import { CreationSection } from './CreationSection';

/**
 * Section "Création personnalisée" autonome.
 *
 * Auparavant, la création était un onglet à l'intérieur du catalogue.
 * Elle est désormais une section à part entière, placée avant le catalogue.
 * Ce composant charge uniquement les libellés (titre, description, bouton)
 * depuis l'API et gère l'ouverture du modal de création sur mesure.
 */
export function CustomCreationSection() {
  const [catalogData, setCatalogData] = useState<CatalogSectionData | null>(null);

  /* L'ouverture vient du contexte et non d'un état local : la barre de
     navigation basse déclenche la même fenêtre depuis son entrée
     « Créer ». Un état local ici obligerait à monter une seconde
     instance du modal ailleurs dans l'arbre. */
  const { creationOuverte, ouvrirCreation, fermerCreation } = useShellUi();

  useEffect(() => {
    let cancelled = false;
    siteService
      .getCatalogSectionData()
      .then((res) => {
        if (!cancelled) setCatalogData((res.data as CatalogSectionData) ?? null);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des données de création:', error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    /* Pas de conteneur centré ici : le bandeau occupe 100 % de la largeur,
       la photo de fond va donc d'un bord à l'autre de l'écran. */
    <section id="creation" className="w-full">
      <CreationSection catalogData={catalogData} onCreationOpen={ouvrirCreation} />

      <CustomCreation isOpen={creationOuverte} onClose={fermerCreation} />
    </section>
  );
}
