import { AuthMode, FormData, FieldErrors } from '../types/authTypes';
import { validatePhoneSimple } from '@/utils/phoneValidation';
import { validatePassword, validateConfirmPassword } from '@/utils/passwordValidation';

export const validatePhone = (phone: string): string => {
  return validatePhoneSimple(phone);
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