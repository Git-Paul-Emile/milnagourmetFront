import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Bandeau « Nouvelle version disponible » et indicateur hors connexion.
 *
 * LE PIÈGE QUE CE COMPOSANT ÉVITE
 * -------------------------------
 * Un service worker installé sert l'application depuis son cache. Quand
 * vous déployez, le nouveau service worker est téléchargé mais reste en
 * attente : tant que l'utilisateur ne ferme pas tous les onglets, il
 * continue de voir l'ANCIENNE version. Sur une app installée, qui n'est
 * jamais vraiment fermée, cela peut durer des semaines — le client
 * signale des bugs déjà corrigés depuis longtemps.
 *
 * `useRegisterSW` détecte cet état et expose `updateServiceWorker()`,
 * qui active le nouveau worker et recharge la page. On demande l'accord
 * plutôt que de recharger d'office : un rechargement surprise en plein
 * tunnel de commande ferait perdre le panier.
 */
export function UpdatePrompt() {
  const {
    needRefresh: [besoinMiseAJour, setBesoinMiseAJour],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(url, registration) {
      /* Le navigateur ne vérifie les mises à jour qu'à intervalles
         irréguliers. Sur une app installée qui reste ouverte des jours,
         cela peut ne jamais arriver : on force donc une vérification
         toutes les heures. */
      if (!registration) return;
      setInterval(() => void registration.update(), 60 * 60 * 1000);
    },
  });

  const [horsLigne, setHorsLigne] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const enLigne = () => setHorsLigne(false);
    const deconnecte = () => setHorsLigne(true);

    window.addEventListener('online', enLigne);
    window.addEventListener('offline', deconnecte);
    return () => {
      window.removeEventListener('online', enLigne);
      window.removeEventListener('offline', deconnecte);
    };
  }, []);

  return (
    <>
      {/* Indicateur hors connexion — bandeau haut, non masquable.
          Il explique pourquoi la commande est indisponible, plutôt que
          de laisser le client face à un bouton qui échoue sans raison. */}
      {horsLigne && (
        <div
          role="status"
          className="fixed inset-x-0 top-0 z-[60] bg-amber-500 px-4 py-1.5 text-center text-xs font-medium text-amber-950"
        >
          Hors connexion — vous consultez la version enregistrée. La commande
          nécessite une connexion.
        </div>
      )}

      {/* Invite de mise à jour */}
      {besoinMiseAJour && (
        <div
          role="dialog"
          aria-labelledby="titre-maj"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-xl border border-border bg-card p-4 shadow-2xl sm:inset-x-auto sm:left-4 animate-in slide-in-from-bottom-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <RefreshCw className="h-4 w-4 text-primary" />
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <p id="titre-maj" className="text-sm font-semibold text-foreground">
                  Nouvelle version disponible
                </p>
                <p className="text-xs text-muted-foreground">
                  Mettez à jour pour bénéficier des dernières améliorations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => void updateServiceWorker(true)}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Mettre à jour
                </button>
                <button
                  onClick={() => setBesoinMiseAJour(false)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  Plus tard
                </button>
              </div>
            </div>

            <button
              onClick={() => setBesoinMiseAJour(false)}
              aria-label="Fermer"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
