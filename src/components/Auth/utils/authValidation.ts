import { AuthMode, FormData, FieldErrors } from '../types/authTypes';

export const validatePhone = (phone: string): string => {
  if (!phone.trim()) return 'Le N° de téléphone est obligatoire';
  if (!/^[+]?[\d\s-()]+$/.test(phone)) return 'Ce format est invalide';
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password.trim()) return 'Le mot de passe est obligatoire';
  if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword.trim()) return 'La confirmation du mot de passe est obligatoire';
  if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas';
  return '';
};

export const validateForm = (mode: AuthMode, formData: FormData): FieldErrors => {
  const errors: FieldErrors = {};

  if (mode === 'login') {
    const phoneError = validatePhone(formData.telephone);
    if (phoneError) errors.telephone = phoneError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
  } else { // register
    if (!formData.nomComplet.trim()) {
      errors.nomComplet = 'Le nom complet est obligatoire';
    }

    const phoneError = validatePhone(formData.telephone);
    if (phoneError) errors.telephone = phoneError;

    if (!formData.zoneLivraison) {
      errors.zoneLivraison = 'La zone de livraison est obligatoire';
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmError) errors.confirmPassword = confirmError;
  }

  return errors;
};