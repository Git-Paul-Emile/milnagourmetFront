import { useEffect, useState } from 'react';
import { useIsStandalone } from '@/hooks/useIsStandalone';

/**
 * Écran de lancement de l'application installée.
 *
 * DEUX ÉCRANS SE SUCCÈDENT AU DÉMARRAGE
 * -------------------------------------
 * 1. Celui du système, généré par Android à partir du manifeste. Il
 *    affiche l'icône, la couleur de fond et le `name` de l'application.
 *    Ce texte n'est pas supprimable : aucune API ne le permet. La seule
 *    marge de manœuvre est de raccourcir `name`, ce qui a été fait
 *    (« Milna Gourmet » au lieu du nom complet avec la baseline).
 *
 * 2. Celui-ci, rendu par l'application dès son premier affichage. Il
 *    prend le relais sans transition visible — même fond, même icône —
 *    mais sans aucun texte, avec un logo plus grand et animé.
 *
 * L'enchaînement des deux donne l'impression d'un seul écran de
 * lancement, dont seule la toute première fraction de seconde échappe à
 * notre contrôle.
 *
 * POURQUOI SEULEMENT EN PWA
 * -------------------------
 * Dans un navigateur, ce voile retarderait l'affichage du contenu sans
 * rien apporter : il n'y a pas d'écran système à prolonger.
 */

/** Durée minimale d'affichage : en deçà, l'écran clignote. */
const DUREE_MINIMALE_MS = 700;
/** Filet de sécurité si la page met du temps à finir de charger. */
const DUREE_MAXIMALE_MS = 2000;
/** Doit correspondre à la durée de la transition d'opacité ci-dessous. */
const DUREE_FONDU_MS = 400;

export function AppSplash() {
  const estInstallee = useIsStandalone();

  const [monte, setMonte] = useState(estInstallee);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!estInstallee) return;

    let minuteurFondu: ReturnType<typeof setTimeout>;
    let minuteurRetrait: ReturnType<typeof setTimeout>;

    const masquer = () => {
      setVisible(false);
      // On attend la fin du fondu avant de retirer l'élément du DOM :
      // le démonter immédiatement ferait disparaître le voile d'un coup.
      minuteurRetrait = setTimeout(() => setMonte(false), DUREE_FONDU_MS);
    };

    const debut = performance.now();

    /* On masque quand la page a fini de charger, sans jamais descendre
       sous la durée minimale ni dépasser la durée maximale. */
    const planifierMasquage = () => {
      const ecoule = performance.now() - debut;
      minuteurFondu = setTimeout(masquer, Math.max(0, DUREE_MINIMALE_MS - ecoule));
    };

    if (document.readyState === 'complete') {
      planifierMasquage();
    } else {
      window.addEventListener('load', planifierMasquage, { once: true });
    }

    const secours = setTimeout(masquer, DUREE_MAXIMALE_MS);

    return () => {
      window.removeEventListener('load', planifierMasquage);
      clearTimeout(minuteurFondu);
      clearTimeout(minuteurRetrait);
      clearTimeout(secours);
    };
  }, [estInstallee]);

  if (!estInstallee || !monte) return null;

  return (
    <div
      // `aria-hidden` : purement décoratif, rien à annoncer aux lecteurs
      // d'écran, qui doivent atteindre directement le contenu.
      aria-hidden="true"
      className={[
        'fixed inset-0 z-[100] flex items-center justify-center bg-background',
        'transition-opacity ease-out',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
      style={{ transitionDuration: `${DUREE_FONDU_MS}ms` }}
    >
      {/* Icône locale et précachée plutôt que le logo distant du
          branding : au démarrage hors connexion, une image servie par
          l'API ne s'afficherait pas. */}
      <img
        src="/icons/icon-192.png"
        alt=""
        width={192}
        height={192}
        className="h-40 w-40 animate-heartbeat select-none"
      />
    </div>
  );
}
