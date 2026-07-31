import { useContext } from 'react';
import { ShellUiContext, type ShellUiValeur } from './ShellUiContext';

/**
 * Accès à l'état d'ossature (panier, modale d'authentification).
 *
 * Le hook est dans un fichier séparé du provider : Vite exige qu'un
 * module exportant des composants n'exporte que des composants pour que
 * le rafraîchissement à chaud fonctionne (règle `react-refresh`).
 *
 * L'erreur explicite en l'absence de provider vaut mieux qu'un
 * `undefined` qui plante dix lignes plus loin sans indiquer la cause.
 */
export function useShellUi(): ShellUiValeur {
  const contexte = useContext(ShellUiContext);

  if (!contexte) {
    throw new Error(
      "useShellUi doit être utilisé à l'intérieur d'un <ShellUiProvider>."
    );
  }

  return contexte;
}
