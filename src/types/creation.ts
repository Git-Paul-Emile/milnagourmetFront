// Types pour les créations personnalisées

export interface CreationSize {
  id: number;
  nom: string;
  prix: number;
  image?: string | null;
  maxFruits: number;
  maxSauces: number;
  cerealesAutorise: boolean;
  active: boolean;
  ordreAffichage: number;
}

// Une option de création (fruit, sauce, céréale) avec sa vignette.
export interface CreationOptionItem {
  nom: string;
  image?: string | null;
}

export interface CreationOptions {
  fruits: CreationOptionItem[];
  sauces: CreationOptionItem[];
  cereales: CreationOptionItem[];
}

export interface CustomCreation {
  size: CreationSize;
  selectedFruits: string[];
  selectedSauces: string[];
  selectedCereales: string[];
  totalPrice: number;
}