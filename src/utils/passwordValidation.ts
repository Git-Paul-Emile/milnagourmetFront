/**
 * Validation des mots de passe
 * Longueur minimale : 4 caractères
 */

export function validatePassword(password: string): string {
  if (!password || !password.trim()) {
    return 'Le mot de passe est obligatoire';
  }
  if (password.length < 4) {
    return 'Le mot de passe doit contenir au moins 4 caractères';
  }
  return '';
}

export function validateConfirmPassword(password: string, confirmPassword: string): string {
  if (!confirmPassword || !confirmPassword.trim()) {
    return 'La confirmation du mot de passe est obligatoire';
  }
  if (password !== confirmPassword) {
    return 'Les mots de passe ne correspondent pas';
  }
  return '';
}