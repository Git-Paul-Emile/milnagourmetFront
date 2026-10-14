import { useCallback, useEffect, useState } from 'react';

/**
 * Logique d'installation de la PWA.
 *
 * TROIS CAS
 * ---------
 * • Android / Chrome / Edge : événement `beforeinstallprompt` capté,
 *   on déclenche l'invite native au moment choisi.
 *
 * • iOS / Safari : aucun événement, aucune API. On affiche une popup
 *   identique à Android avec les instructions pour ajouter à l'écran
 *   d'accueil via le menu Partager.
 *
 * • Desktop (PC) : aucune invite, jamais.
 *
 * Le refus est mémorisé 30 jours. Après "Plus tard", un bouton flottant
 * reste visible pour permettre l'installation à tout moment.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const CLE_REFUS = 'milna:pwa-invite-refusee';
const CLE_REPORTE = 'milna:pwa-invite-reportee';

/** Durée avant de reproposer l'installation après un refus : 30 jours. */
const DELAI_APRES_REFUS_MS = 30 * 24 * 60 * 60 * 1000;

/** Délai avant affichage : laisse le visiteur découvrir le site d'abord. */
const DELAI_AVANT_AFFICHAGE_MS = 20_000;

function estIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOSClassique = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
  const iPadModerne = ua.includes('Macintosh') && navigator.maxTouchPoints > 1;
  return iOSClassique || iPadModerne;
}

/** Détecte un appareil mobile ou tablette (exclut les desktops). */
function estMobileOuTablette(): boolean {
  if (typeof navigator === 'undefined') return false;
  // Vérification via User-Agent
  const uaMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
    navigator.userAgent
  );
  // Vérification via touch (tablette sans UA mobile possible)
  const touchDisponible = navigator.maxTouchPoints > 0;
  // Vérification via taille d'écran (≤ 1024px considéré mobile/tablette)
  const petitEcran = typeof window !== 'undefined' && window.innerWidth <= 1024;

  return uaMobile || (touchDisponible && petitEcran);
}

function estDejaInstallee(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function refusEncoreValide(): boolean {
  try {
    const brut = localStorage.getItem(CLE_REFUS);
    if (!brut) return false;
    return Date.now() - Number(brut) < DELAI_APRES_REFUS_MS;
  } catch {
    return false;
  }
}

function estReporte(): boolean {
  try {
    return localStorage.getItem(CLE_REPORTE) === '1';
  } catch {
    return false;
  }
}

export function usePwaInstall() {
  const [evenementInstall, setEvenementInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [plateformeIOS] = useState(estIOS);
  const [mobileOuTablette] = useState(estMobileOuTablette);
  /** Bouton flottant affiché après "Plus tard" pour rappeler l'installation. */
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    // Sur desktop, aucune invite
    if (!mobileOuTablette) return;
    if (estDejaInstallee() || refusEncoreValide()) return;

    let minuteur: ReturnType<typeof setTimeout>;

    const surBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setEvenementInstall(event as BeforeInstallPromptEvent);
      if (!estReporte()) {
        minuteur = setTimeout(() => {
          setVisible(true);
          setShowScrollButton(false);
        }, DELAI_AVANT_AFFICHAGE_MS);
      }
    };

    const surInstallation = () => {
      setVisible(false);
      setShowScrollButton(false);
      setEvenementInstall(null);
      try { localStorage.removeItem(CLE_REPORTE); } catch { /* */ }
    };

    window.addEventListener('beforeinstallprompt', surBeforeInstallPrompt);
    window.addEventListener('appinstalled', surInstallation);

    // Sur iOS, pas d'événement : on affiche le popup après le délai
    if (plateformeIOS && !estReporte()) {
      minuteur = setTimeout(() => {
        setVisible(true);
        setShowScrollButton(false);
      }, DELAI_AVANT_AFFICHAGE_MS);
    }

    // Si déjà reporté, afficher le bouton flottant immédiatement
    if (estReporte()) {
      setShowScrollButton(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', surBeforeInstallPrompt);
      window.removeEventListener('appinstalled', surInstallation);
      clearTimeout(minuteur);
    };
  }, [plateformeIOS, mobileOuTablette]);

  /** Déclenche l'invite native (Android) ou affiche les instructions (iOS). */
  const installer = useCallback(async () => {
    if (!evenementInstall) return;

    await evenementInstall.prompt();
    const { outcome } = await evenementInstall.userChoice;

    if (outcome === 'dismissed') {
      try {
        localStorage.setItem(CLE_REFUS, String(Date.now()));
      } catch { /* */ }
    }

    setEvenementInstall(null);
    setVisible(false);
    setShowScrollButton(false);
    try { localStorage.removeItem(CLE_REPORTE); } catch { /* */ }
  }, [evenementInstall]);

  /** "Plus tard" : masque le popup et affiche le bouton flottant. */
  const reporter = useCallback(() => {
    try {
      localStorage.setItem(CLE_REPORTE, '1');
    } catch { /* */ }
    setVisible(false);
    setShowScrollButton(true);
  }, []);

  /** Refus définitif (30 jours). */
  const refuser = useCallback(() => {
    try {
      localStorage.setItem(CLE_REFUS, String(Date.now()));
      localStorage.removeItem(CLE_REPORTE);
    } catch { /* */ }
    setVisible(false);
    setShowScrollButton(false);
  }, []);

  /** Rouvre le popup depuis le bouton flottant. */
  const rouvrirPopup = useCallback(() => {
    setShowScrollButton(false);
    setVisible(true);
  }, []);

  return {
    visible,
    plateformeIOS,
    mobileOuTablette,
    installationDirecteDisponible: evenementInstall !== null,
    showScrollButton,
    installer,
    reporter,
    refuser,
    rouvrirPopup,
  };
}
