import { pwaService, type PwaEventType, type PwaPlateforme, type PwaSource } from '@/services/pwaService';

/**
 * Suivi anonyme des scans de QR code et des installations de la PWA.
 *
 * Le QR code pointe vers `/?installer=1`. À l'arrivée, la provenance est
 * mémorisée sur l'appareil : l'installation qui suit, même plusieurs jours
 * après, est alors attribuée au QR code. Seul un identifiant aléatoire
 * d'appareil est envoyé, aucune donnée personnelle.
 */

/** Paramètre d'URL porté par le QR code. */
export const PARAM_QR_CODE = 'installer';

const CLE_APPAREIL = 'milna:pwa-appareil';
const CLE_SOURCE = 'milna:pwa-source';
const CLE_SESSION_QR = 'milna:pwa-arrivee-qr';
const cleEnvoye = (type: PwaEventType) => `milna:pwa-suivi-${type.toLowerCase()}`;

function lire(stockage: Storage, cle: string): string | null {
  try { return stockage.getItem(cle); } catch { return null; }
}

function ecrire(stockage: Storage, cle: string, valeur: string): void {
  try { stockage.setItem(cle, valeur); } catch { /* stockage indisponible (navigation privée) */ }
}

export function estIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOSClassique = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
  const iPadModerne = ua.includes('Macintosh') && navigator.maxTouchPoints > 1;
  return iOSClassique || iPadModerne;
}

export function estDejaInstallee(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function plateforme(): PwaPlateforme {
  if (estIOS()) return 'ios';
  return /Android/i.test(navigator.userAgent) ? 'android' : 'autre';
}

function appareilId(): string {
  const existant = lire(localStorage, CLE_APPAREIL);
  if (existant) return existant;
  const nouveau = crypto.randomUUID();
  ecrire(localStorage, CLE_APPAREIL, nouveau);
  return nouveau;
}

/** Envoie un événement une seule fois par appareil. Silencieux en cas d'échec. */
function envoyerUneFois(type: PwaEventType): void {
  if (lire(localStorage, cleEnvoye(type))) return;
  const source = (lire(localStorage, CLE_SOURCE) as PwaSource | null) ?? 'DIRECT';

  pwaService
    .enregistrerEvenement({ appareilId: appareilId(), type, source, plateforme: plateforme() })
    .then(() => ecrire(localStorage, cleEnvoye(type), '1'))
    // Statistique non essentielle : un échec ne doit jamais gêner le visiteur.
    // L'événement sera retenté à la prochaine visite.
    .catch(() => undefined);
}

/**
 * Détecte une arrivée via le QR code : mémorise la provenance, enregistre
 * le scan et retire le paramètre de l'URL. Idempotent pendant la session.
 */
export function arriveeParQrCode(): boolean {
  if (typeof window === 'undefined') return false;
  const url = new URL(window.location.href);

  if (url.searchParams.get(PARAM_QR_CODE) === '1') {
    ecrire(localStorage, CLE_SOURCE, 'QRCODE');
    ecrire(sessionStorage, CLE_SESSION_QR, '1');
    envoyerUneFois('SCAN');
    url.searchParams.delete(PARAM_QR_CODE);
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  }

  return lire(sessionStorage, CLE_SESSION_QR) === '1';
}

/** Enregistre l'installation de l'application (une fois par appareil). */
export function suivreInstallation(): void {
  envoyerUneFois('INSTALLATION');
}
