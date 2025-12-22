/**
 * Service pour gérer les salutations basées sur l'heure locale
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? 'Bonsoir' : 'Bonjour';
};