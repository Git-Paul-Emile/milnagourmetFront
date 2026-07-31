import { Download, X, Share } from 'lucide-react';
import { usePwaInstall } from '@/hooks/usePwaInstall';

/**
 * Invite d'installation sur l'écran d'accueil.
 *
 * Affichée en bas de l'écran, après 20 secondes de navigation, une fois
 * tous les 30 jours au maximum. Deux variantes selon la plateforme :
 * bouton d'installation sur Android, marche à suivre sur iOS où aucune
 * API n'existe.
 */
export function InstallPrompt() {
  const { visible, plateformeIOS, installationDirecteDisponible, installer, refuser } =
    usePwaInstall();

  if (!visible) return null;

  // Sur Android, sans événement d'installation capté, le bouton serait
  // inopérant : mieux vaut ne rien afficher qu'un bouton mort.
  if (!plateformeIOS && !installationDirecteDisponible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="titre-installation"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-xl border border-border bg-card p-4 shadow-2xl sm:inset-x-auto sm:right-4 animate-in slide-in-from-bottom-4"
    >
      <button
        onClick={refuser}
        aria-label="Fermer"
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <img
          src="/icons/icon-192.png"
          alt=""
          aria-hidden="true"
          className="h-12 w-12 shrink-0 rounded-lg"
        />

        <div className="space-y-2">
          <div>
            <p id="titre-installation" className="text-sm font-semibold text-foreground">
              Installer Milna Gourmet
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Accédez au catalogue en un geste, même avec une connexion faible.
            </p>
          </div>

          {plateformeIOS ? (
            /* iOS n'expose aucune API d'installation : on décrit le
               geste, seul moyen d'y parvenir sur iPhone et iPad. */
            <p className="flex flex-wrap items-center gap-1 text-xs text-foreground">
              Appuyez sur
              <Share className="inline h-3.5 w-3.5" aria-label="Partager" />
              <span className="font-medium">Partager</span>
              <span>puis</span>
              <span className="font-medium">« Sur l'écran d'accueil »</span>
            </p>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => void installer()}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Download className="h-3.5 w-3.5" />
                Installer
              </button>
              <button
                onClick={refuser}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                Plus tard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
