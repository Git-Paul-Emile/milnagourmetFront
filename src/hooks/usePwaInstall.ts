import { useCallback, useEffect, useState } from 'react';

/**
 * Logique d'installation de la PWA.
 *
 * DEUX MONDES TRÈS DIFFÉRENTS
 * ---------------------------
 * • Android / Chrome / Edge : le navigateur émet un événement
 *   `beforeinstallprompt` quand il juge le site installable. On
 *   l'intercepte, on empêche l'invite native, et on déclenche la nôtre
 *   au moment choisi. L'événement n'est utilisable QU'UNE FOIS.
 *
 * • iOS / Safari : aucun événement, aucune API. L'installation passe
 *   obligatoirement par « Partager → Sur l'écran d'accueil ». La seule
 *   chose possible est d'expliquer le geste — d'où la détection d'iOS.
 *
 * Le refus est mémorisé pour ne pas harceler : une invite qui revient à
 * chaque visite fait fuir plus de clients qu'elle n'en convertit.
 */

/**
 * Type de l'événement `beforeinstallprompt`, absent des définitions
 * TypeScript standard car il n'est pas encore normalisé.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const CLE_REFUS = 'milna:pwa-invite-refusee';

/** Durée avant de reproposer l'installation après un refus : 30 jours. */
const DELAI_APRES_REFUS_MS = 30 * 24 * 60 * 60 * 1000;

/** Délai avant affichage : laisse le visiteur découvrir le site d'abord. */
const DELAI_AVANT_AFFICHAGE_MS = 20_000;

function estIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  // `MSStream` exclut les anciens Windows Phone qui usurpaient l'UA iOS.
  const iOSClassique = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
  // Depuis iPadOS 13, l'iPad se présente comme un Mac : on le distingue
  // par la présence d'un écran tactile.
  const iPadModerne = ua.includes('Macintosh') && navigator.maxTouchPoints > 1;
  return iOSClassique || iPadModerne;
}

/** L'application tourne-t-elle déjà en mode installé ? */
function estDejaInstallee(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // Propriété non standard, propre à Safari iOS.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function refusEncoreValide(): boolean {
  try {
    const brut = localStorage.getItem(CLE_REFUS);
    if (!brut) return false;
    return Date.now() - Number(brut) < DELAI_APRES_REFUS_MS;
  } catch {
    // Navigation privée ou stockage bloqué : on considère qu'il n'y a
    // pas eu de refus plutôt que de planter.
    return false;
  }
}

export function usePwaInstall() {
  const [evenementInstall, setEvenementInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [plateformeIOS] = useState(estIOS);

  useEffect(() => {
    if (estDejaInstallee() || refusEncoreValide()) return;

    let minuteur: ReturnType<typeof setTimeout>;

    const surBeforeInstallPrompt = (event: Event) => {
      // Empêche l'invite native du navigateur : c'est la nôtre qui
      // s'affichera, au moment que nous choisissons.
      event.preventDefault();
      setEvenementInstall(event as BeforeInstallPromptEvent);
      minuteur = setTimeout(() => setVisible(true), DELAI_AVANT_AFFICHAGE_MS);
    };

    const surInstallation = () => {
      // L'utilisateur a installé (éventuellement via le menu du
      // navigateur) : l'invite n'a plus lieu d'être.
      setVisible(false);
      setEvenementInstall(null);
    };

    window.addEventListener('beforeinstallprompt', surBeforeInstallPrompt);
    window.addEventListener('appinstalled', surInstallation);

    // Sur iOS aucun événement n'existe : on affiche les instructions
    // après le même délai, sans attendre quoi que ce soit.
    if (plateformeIOS) {
      minuteur = setTimeout(() => setVisible(true), DELAI_AVANT_AFFICHAGE_MS);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', surBeforeInstallPrompt);
      window.removeEventListener('appinstalled', surInstallation);
      clearTimeout(minuteur);
    };
  }, [plateformeIOS]);

  /** Déclenche l'invite native (Android uniquement). */
  const installer = useCallback(async () => {
    if (!evenementInstall) return;

    await evenementInstall.prompt();
    const { outcome } = await evenementInstall.userChoice;

    if (outcome === 'dismissed') {
      try {
        localStorage.setItem(CLE_REFUS, String(Date.now()));
      } catch {
        /* stockage indisponible : sans conséquence */
      }
    }

    // L'événement `beforeinstallprompt` n'est utilisable qu'une fois :
    // le conserver mènerait à une erreur au second appel.
    setEvenementInstall(null);
    setVisible(false);
  }, [evenementInstall]);

  /** Masque l'invite et mémorise le refus. */
  const refuser = useCallback(() => {
    try {
      localStorage.setItem(CLE_REFUS, String(Date.now()));
    } catch {
      /* stockage indisponible : sans conséquence */
    }
    setVisible(false);
  }, []);

  return {
    /** L'invite doit-elle être affichée ? */
    visible,
    /** Sur iOS on affiche des instructions, pas un bouton. */
    plateformeIOS,
    /** Un bouton « Installer » est-il réellement actionnable ? */
    installationDirecteDisponible: evenementInstall !== null,
    installer,
    refuser,
  };
}
