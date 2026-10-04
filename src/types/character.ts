// Types pour les personnages de la gamme Milna Gourmet

export interface YaourtCharacter {
  id: string;
  name: string;
  tagline: string;
  description: string;
  personality: string;
  philosophy: string;
  traits: string[];
  /** Code couleur principal du personnage (CSS hsl string) */
  color: string;
  /** Couleur secondaire pour les dégradés */
  colorSecondary: string;
  /** Emoji ou icône symbolique */
  emoji: string;
  /** Nom de la catégorie de produit associée (ex: 'nature', 'simple', 'cremeux') */
  productCategory: string;
  /** URL du modèle 3D — null tant que non fourni */
  model3dUrl: string | null;
}
