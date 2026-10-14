import { Download, X, Smartphone } from 'lucide-react';
import { usePwaInstall } from '@/hooks/usePwaInstall';

/**
 * Invite d'installation sur l'écran d'accueil.
 *
 * Android : bouton natif Installer.
 * iOS     : instructions Safari (Partager → Sur l'écran d'accueil → Ajouter).
 * Desktop : rien, jamais.
 *
 * Après "Plus tard", un bouton flottant reste visible pour permettre
 * l'installation à n'importe quel moment. Il disparaît si le popup revient.
 */
export function InstallPrompt() {
  const {
    visible,
    plateformeIOS,
    mobileOuTablette,
    installationDirecteDisponible,
    showScrollButton,
    installer,
    reporter,
    refuser,
    rouvrirPopup,
  } = usePwaInstall();

  if (!mobileOuTablette) return null;
  if (!plateformeIOS && !installationDirecteDisponible && !showScrollButton && !visible) return null;

  return (
    <>
      {visible && (
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
                  Installez l'application Milna Gourmet
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Retrouvez notre catalogue rapidement, même avec une connexion limitée.
                </p>
              </div>

              {plateformeIOS ? (
                <div className="space-y-2 pt-1">
                  <div className="rounded-lg bg-muted/60 px-3 py-2 text-xs leading-relaxed">
                    <p className="font-semibold text-foreground mb-1.5">Pour installer sur iPhone / iPad :</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Appuyez sur <span className="font-semibold text-foreground">Partager ⬆</span> en bas de Safari</li>
                      <li>Choisissez <span className="font-semibold text-foreground">« Sur l'écran d'accueil »</span></li>
                      <li>Confirmez avec <span className="font-semibold text-foreground">Ajouter</span></li>
                    </ol>
                  </div>
                  <button
                    onClick={reporter}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    Plus tard
                  </button>
                </div>
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
                    onClick={reporter}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    Plus tard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showScrollButton && !visible && (
        <button
          onClick={rouvrirPopup}
          aria-label="Installer l'application"
          title="Installer Milna Gourmet"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95 animate-in slide-in-from-bottom-4"
        >
          <Smartphone className="h-4 w-4" />
          Installer l'app
        </button>
      )}
    </>
  );
}
