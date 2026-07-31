import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Interface de repli personnalisée (facultatif). */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * Filet de sécurité de l'interface.
 *
 * POURQUOI C'EST INDISPENSABLE
 * ----------------------------
 * Depuis React 16, une exception non capturée pendant le rendu démonte
 * TOUT l'arbre de composants. Le visiteur n'obtient pas un message
 * d'erreur : il obtient une page entièrement blanche, sans explication ni
 * bouton. Il ferme l'onglet et ne revient pas.
 *
 * Un ErrorBoundary intercepte l'exception et affiche une interface de
 * repli à la place de la branche fautive. Le reste de l'application
 * continue de fonctionner.
 *
 * POURQUOI UNE CLASSE ET PAS UN HOOK
 * ----------------------------------
 * React n'expose pas d'équivalent en composant fonction : les deux
 * méthodes de cycle de vie utilisées ici (`getDerivedStateFromError` et
 * `componentDidCatch`) n'ont pas de contrepartie en hook. C'est le seul
 * cas où une classe reste obligatoire en React moderne.
 *
 * CE QU'IL N'ATTRAPE PAS
 * ----------------------
 * Les erreurs dans les gestionnaires d'événements (onClick…), le code
 * asynchrone (setTimeout, promesses) et le rendu côté serveur. Ces cas
 * doivent être traités par des try/catch classiques.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  /**
   * Appelée dès qu'un composant enfant lève une exception.
   * Son unique rôle est de mettre à jour l'état pour déclencher
   * l'affichage de l'interface de repli au rendu suivant.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  /**
   * Appelée avec le détail de l'erreur et la pile de composants.
   * C'est ici que se branche un outil de suivi d'erreurs (Sentry…) le
   * jour où vous en ajouterez un.
   */
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Erreur React non capturée :', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Une erreur est survenue
          </h1>
          <p className="max-w-md text-muted-foreground">
            Nous sommes désolés, cette page n'a pas pu s'afficher correctement.
            Rechargez la page ou revenez à l'accueil.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RotateCcw className="h-4 w-4" />
            Recharger la page
          </button>
          <button
            onClick={this.handleHome}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </button>
        </div>

        {/* Détail technique réservé au développement : en production il
            n'apporte rien au visiteur et peut révéler du code interne. */}
        {import.meta.env.DEV && this.state.message && (
          <pre className="mt-2 max-w-xl overflow-auto rounded-md bg-muted p-3 text-left text-xs text-muted-foreground">
            {this.state.message}
          </pre>
        )}
      </div>
    );
  }
}
