export const validatePassword = (password: string): string => {
  if (password && password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (password && !confirmPassword) return 'La confirmation du mot de passe est obligatoire';
  if (password && password !== confirmPassword) return 'Les mots de passe ne correspondent pas';
  return '';
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPrice = (price: number) => {
  return `${price.toLocaleString('fr-FR')}F`;
};