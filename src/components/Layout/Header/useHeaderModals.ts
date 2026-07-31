import { useState } from 'react';
import { useShellUi } from '@/contexts/useShellUi';

/**
 * État des fenêtres pilotées par l'en-tête.
 *
 * Le panier et la modale d'authentification vivent désormais dans
 * `ShellUiContext` : la barre de navigation basse doit pouvoir les ouvrir
 * elle aussi. Le reste (profil, gestion des commandes, menu mobile) reste
 * local, car seul l'en-tête s'en sert.
 *
 * L'interface publique du hook est volontairement inchangée :
 * `Header.tsx` n'a pas eu besoin d'être modifié.
 */
export function useHeaderModals() {
  const {
    panierOuvert,
    ouvrirPanier,
    fermerPanier,
    authOuverte,
    modeAuth,
    ouvrirAuth,
    definirModeAuth,
    fermerAuth,
  } = useShellUi();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderManagementOpen, setIsOrderManagementOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return {
    isCartOpen: panierOuvert,
    setIsCartOpen: (ouvert: boolean) => (ouvert ? ouvrirPanier() : fermerPanier()),

    isAuthModalOpen: authOuverte,
    /* Ouverture SANS argument : le mode vient d'être posé par
       `setAuthMode` juste au-dessus dans le même gestionnaire. Passer
       `modeAuth` ici réinjecterait la valeur du rendu précédent (donc
       périmée) et « S'inscrire » ouvrirait le formulaire de connexion. */
    setIsAuthModalOpen: (ouvert: boolean) => (ouvert ? ouvrirAuth() : fermerAuth()),

    authMode: modeAuth,
    setAuthMode: definirModeAuth,

    isProfileOpen,
    setIsProfileOpen,
    isOrderManagementOpen,
    setIsOrderManagementOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  };
}
