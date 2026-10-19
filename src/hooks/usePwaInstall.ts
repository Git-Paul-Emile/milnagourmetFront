import { useCallback, useEffect, useState } from 'react';
import { arriveeParQrCode, estDejaInstallee, estIOS, suivreInstallation } from '@/lib/pwaTracking';

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
 *
 * Arrivée via le QR code (`/?installer=1`) : l'invite s'affiche aussitôt,
 * même après un refus ou un report antérieur.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const CLE_REFUS = 'milna:pwa-invite-refusee';
const CLE_REPORTE = 'milna:pwa-invite-reportee';

/** Durée avant de reproposer l'installation après un refus : 30 jours. */
const DELAI_APRES_REFUS_MS = 30 * 24 * 60 * 60 * 1000;

/** Court délai avant affichage : laisse la page se peindre d'abord. */
const DELAI_AVANT_AFFICHAGE_MS = 2_000;

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
  const [installationEnCours, setInstallationEnCours] = useState(false);
  const [viaQrCode] = useState(arriveeParQrCode);

  useEffect(() => {
    // Premier lancement de l'app installée : c'est là qu'on la compte
    // (seul signal disponible sur iOS).
    if (estDejaInstallee()) {
      suivreInstallation();
      return;
    }
    // Sur desktop, aucune invite
    if (!mobileOuTablette) return;
    if (!viaQrCode && refusEncoreValide()) return;

    const afficherInvite = viaQrCode || !estReporte();
    const delai = viaQrCode ? 0 : DELAI_AVANT_AFFICHAGE_MS;
    let minuteur: ReturnType<typeof setTimeout>;

    const programmerAffichage = () => {
      minuteur = setTimeout(() => {
        setVisible(true);
        setShowScrollButton(false);
      }, delai);
    };

    const surBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setEvenementInstall(event as BeforeInstallPromptEvent);
      if (afficherInvite) programmerAffichage();
    };

    const surInstallation = () => {
      suivreInstallation();
      setInstallationEnCours(false);
      setVisible(false);
      setShowScrollButton(false);
      setEvenementInstall(null);
      try { localStorage.removeItem(CLE_REPORTE); } catch { /* */ }
    };

    window.addEventListener('beforeinstallprompt', surBeforeInstallPrompt);
    window.addEventListener('appinstalled', surInstallation);

    // Sur iOS, pas d'événement : on affiche le popup après le délai
    if (plateformeIOS && afficherInvite) programmerAffichage();

    // Si déjà reporté, afficher le bouton flottant immédiatement
    if (!afficherInvite) setShowScrollButton(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', surBeforeInstallPrompt);
      window.removeEventListener('appinstalled', surInstallation);
      clearTimeout(minuteur);
    };
  }, [plateformeIOS, mobileOuTablette, viaQrCode]);

  /** Déclenche l'invite native (Android) ou affiche les instructions (iOS). */
  const installer = useCallback(async () => {
    if (!evenementInstall || installationEnCours) return;

    setInstallationEnCours(true);
    try {
      await evenementInstall.prompt();
      const { outcome } = await evenementInstall.userChoice;
      setEvenementInstall(null);

      /* Acceptée : le bouton reste « en cours » jusqu'à l'événement
         `appinstalled`, qui ferme l'invite une fois l'app réellement installée. */
      if (outcome === 'accepted') return;

      try { localStorage.setItem(CLE_REFUS, String(Date.now())); } catch { /* */ }
    } catch {
      /* Invite native indisponible : on rend la main à l'utilisateur. */
    }
    setInstallationEnCours(false);
    setVisible(false);
    setShowScrollButton(false);
    try { localStorage.removeItem(CLE_REPORTE); } catch { /* */ }
  }, [evenementInstall, installationEnCours]);

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
    installationEnCours,
    installer,
    reporter,
    refuser,
    rouvrirPopup,
  };
}
