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
  zoneLivraison: string;
}

export interface FieldErrors {
  [key: string]: string;
}