/**
 * Validation des mots de passe.
 *
 * La longueur minimale ne s'applique qu'à la CRÉATION d'un mot de passe
 * (inscription, changement). À la connexion on vérifie seulement qu'il
 * est saisi : imposer la règle bloquerait les comptes existants dont le
 * mot de passe est plus court.
 */
export const PASSWORD_MIN_LENGTH = 8;

export function validateLoginPassword(password: string): string {
  if (!password || !password.trim()) {
    return 'Le mot de passe est obligatoire';
  }
  return '';
}

export function validatePassword(password: string): string {
  const requis = validateLoginPassword(password);
  if (requis) return requis;

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`;
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
