/**
 * Validation des numéros de téléphone gabonais
 * Formats acceptés :
 * - National : 0XXXXXXXX (8 ou 9 chiffres)
 * - International : +241XXXXXXXX ou 241XXXXXXXX (11 ou 12 chiffres)
 */

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
}

/**
 * Valide un numéro de téléphone gabonais
 * @param phone Le numéro de téléphone à valider
 * @returns Résultat de validation avec message d'erreur si invalide
 */
export function validateGabonesePhone(phone: string): PhoneValidationResult {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Le numéro de téléphone est obligatoire' };
  }

  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '');

  // Format national : 0 suivi de 7 ou 8 chiffres
  const nationalRegex = /^0\d{7,8}$/;
  if (nationalRegex.test(cleaned)) {
    return { isValid: true, formatted: cleaned };
  }

  // Format international : +241 ou 241 suivi de 8 chiffres
  const internationalRegex = /^(\+241|241)\d{8}$/;
  if (internationalRegex.test(cleaned)) {
    return { isValid: true, formatted: cleaned };
  }

  return {
    isValid: false,
    error: 'Format invalide.'
  };
}

/**
 * Version simplifiée pour compatibilité avec les validateurs existants
 * @param phone Le numéro de téléphone
 * @returns Message d'erreur ou chaîne vide si valide
 */
export function validatePhoneSimple(phone: string): string {
  const result = validateGabonesePhone(phone);
  return result.isValid ? '' : result.error!;
}