import { useEffect, useState } from 'react';

/**
 * L'application tourne-t-elle en mode installé (PWA) ?
 *
 * Deux façons de le savoir, complémentaires :
 *
 * • `display-mode: standalone` — requête média standard, respectée par
 *   Chrome, Edge, Firefox et Samsung Internet. Elle vaut `true` quand la
 *   page est lancée depuis l'icône de l'écran d'accueil, sans barre
 *   d'adresse.
 *
 * • `navigator.standalone` — propriété propriétaire d'Apple, seule
 *   indication disponible sur Safari iOS, qui n'implémente pas la requête
 *   média ci-dessus.
 *
 * La valeur peut changer en cours de session : un utilisateur peut
 * installer l'app depuis l'onglet ouvert. On écoute donc la requête média
 * plutôt que de la lire une seule fois au montage.
 */

/** Propriété non standard, propre à Safari iOS. */
type NavigateurApple = Navigator & { standalone?: boolean };

const REQUETE = '(display-mode: standalone)';

function lireEtatInitial(): boolean {
  // Garde pour un éventuel rendu hors navigateur (tests, SSR).
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia(REQUETE).matches ||
    (window.navigator as NavigateurApple).standalone === true
  );
}

export function useIsStandalone(): boolean {
  const [installee, setInstallee] = useState(lireEtatInitial);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const requete = window.matchMedia(REQUETE);

    const surChangement = (event: MediaQueryListEvent) => {
      setInstallee(
        event.matches || (window.navigator as NavigateurApple).standalone === true
      );
    };

    requete.addEventListener('change', surChangement);
    return () => requete.removeEventListener('change', surChangement);
  }, []);

  return installee;
}
