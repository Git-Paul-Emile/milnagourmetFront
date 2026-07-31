export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export type AuthMode = 'login' | 'register';

export interface FormData {
  password: string;
  confirmPassword: string;
  nomComplet: string;
  telephone: string;
  /**
   * Adresse email, facultative à l'inscription.
   * Elle conditionne la possibilité de réinitialiser son mot de passe :
   * le formulaire le signale explicitement à l'utilisateur.
   */
  email: string;
  zoneLivraison: string;
}

export interface FieldErrors {
  [key: string]: string;
}