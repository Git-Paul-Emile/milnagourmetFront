import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

/**
 * État de l'ossature de l'interface : panier et modale d'authentification.
 *
 * POURQUOI CE CONTEXTE
 * --------------------
 * L'ouverture du panier était un `useState` local au `Header`. Tant que
 * seul le Header pouvait l'ouvrir, cela suffisait. La barre de navigation
 * basse doit maintenant l'ouvrir elle aussi, depuis un autre endroit de
 * l'arbre React.
 *
 * Deux mauvaises solutions écartées :
 *   - faire remonter l'état jusqu'à un ancêtre commun et le redescendre en
 *     props à travers plusieurs niveaux (« prop drilling ») ;
 *   - dupliquer `<Cart>` dans la barre, ce qui donnerait deux paniers
 *     montés simultanément, avec deux états de saisie distincts.
 *
 * Le contexte expose uniquement des INTENTIONS (`ouvrirPanier`), jamais le
 * setter brut : les appelants ne peuvent pas mettre l'état dans une forme
 * incohérente.
 */

export type ModeAuthentification = 'login' | 'register';

export interface ShellUiValeur {
  /** Le tiroir panier est-il ouvert ? */
  panierOuvert: boolean;
  ouvrirPanier: () => void;
  fermerPanier: () => void;

  /**
   * Fenêtre de création personnalisée.
   *
   * Comme le panier, elle est déclenchée depuis deux endroits : le
   * bandeau de la page d'accueil et la barre de navigation basse. Son
   * état ne peut donc plus être local à la section.
   */
  creationOuverte: boolean;
  ouvrirCreation: () => void;
  fermerCreation: () => void;

  /** Modale de connexion / inscription. */
  authOuverte: boolean;
  modeAuth: ModeAuthentification;
  /**
   * Ouvre la modale. Sans argument, conserve le mode courant.
   *
   * Cette distinction n'est pas cosmétique : l'en-tête appelle d'abord
   * `definirModeAuth('register')` puis demande l'ouverture. Si
   * l'ouverture réimposait un mode, elle écraserait le choix qui vient
   * d'être fait — le bouton « S'inscrire » afficherait le formulaire de
   * connexion.
   */
  ouvrirAuth: (mode?: ModeAuthentification) => void;
  /** Change le mode sans ouvrir la modale. */
  definirModeAuth: (mode: ModeAuthentification) => void;
  fermerAuth: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ShellUiContext = createContext<ShellUiValeur | null>(null);

export function ShellUiProvider({ children }: { children: ReactNode }) {
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [creationOuverte, setCreationOuverte] = useState(false);
  const [authOuverte, setAuthOuverte] = useState(false);
  const [modeAuth, setModeAuth] = useState<ModeAuthentification>('login');

  const ouvrirPanier = useCallback(() => setPanierOuvert(true), []);
  const fermerPanier = useCallback(() => setPanierOuvert(false), []);

  const ouvrirCreation = useCallback(() => setCreationOuverte(true), []);
  const fermerCreation = useCallback(() => setCreationOuverte(false), []);

  const definirModeAuth = useCallback((mode: ModeAuthentification) => {
    setModeAuth(mode);
  }, []);

  const ouvrirAuth = useCallback((mode?: ModeAuthentification) => {
    // Le mode n'est touché que s'il est explicitement fourni.
    if (mode) setModeAuth(mode);
    setAuthOuverte(true);
  }, []);

  const fermerAuth = useCallback(() => setAuthOuverte(false), []);

  /* `useMemo` évite de recréer l'objet de contexte à chaque rendu du
     provider : sans lui, tous les consommateurs se re-rendraient même
     lorsque rien n'a changé. */
  const valeur = useMemo<ShellUiValeur>(
    () => ({
      panierOuvert,
      ouvrirPanier,
      fermerPanier,
      creationOuverte,
      ouvrirCreation,
      fermerCreation,
      authOuverte,
      modeAuth,
      ouvrirAuth,
      definirModeAuth,
      fermerAuth,
    }),
    [
      panierOuvert,
      ouvrirPanier,
      fermerPanier,
      creationOuverte,
      ouvrirCreation,
      fermerCreation,
      authOuverte,
      modeAuth,
      ouvrirAuth,
      definirModeAuth,
      fermerAuth,
    ]
  );

  return <ShellUiContext.Provider value={valeur}>{children}</ShellUiContext.Provider>;
}
