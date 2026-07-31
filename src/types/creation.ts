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

/**
 * Même donnée, réduite aux seuls noms.
 *
 * Le dashboard n'affiche que des libellés (listes de gestion, compteurs)
 * et n'a pas besoin des vignettes. Il manipulait jusqu'ici des `string[]`
 * tout en les déclarant `CreationOptionItem[]` : le type mentait sur le
 * contenu réel. Ce type distinct rétablit la correspondance sans
 * alourdir la vitrine, qui a bien besoin des images.
 */
export interface CreationOptionNames {
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