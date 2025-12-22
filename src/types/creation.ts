// Types pour les créations personnalisées

export interface CreationSize {
  id: number;
  nom: string;
  prix: number;
  maxFruits: number;
  maxSauces: number;
  cerealesAutorise: boolean;
  active: boolean;
  ordreAffichage: number;
  creeLe: string;
}

export interface CreationOptions {
  fruits: string[];
  sauces: string[];
  cereales: string[];
}

export interface CustomCreation {
  size: CreationSize;
  selectedFruits: string[];
  selectedSauces: string[];
  selectedCereales: string[];
  totalPrice: number;
}