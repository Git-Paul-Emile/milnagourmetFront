// Services spéciaux (Panier Cadeau, Panier Personnalisé, Boîte Mono Saveur,
// Boîte Découverte). Les paniers ont un prix de base ("à partir de") ; les
// boîtes sont sur devis : le vendeur communique le prix après la commande.

/** Comportement du service dans le modal de commande. */
export type ServiceType =
  | 'PANIER_FIXE'   // éléments par défaut, non modifiables
  | 'PANIER_PERSO'  // défauts désélectionnables + ajouts libres
  | 'MONO_SAVEUR'   // un seul élément au choix, quantité minimum
  | 'ASSORTIMENT';  // quantité par élément, plancher = quantité par défaut

export interface ServiceComponent {
  id: number;
  name: string;
  image?: string | null;
  available: boolean;
  /** Présent d'office dans les paniers. */
  isDefault: boolean;
  /** Quantité de départ (ASSORTIMENT) — plancher côté client. */
  defaultQuantity: number;
}

export interface SpecialServiceLinkedProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

export interface SpecialService {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  image?: string | null;
  active: boolean;
  serviceType: ServiceType | string;
  /** Prix "à partir de" en FCFA ; 0 = sur devis. */
  basePrice: number;
  /** Couvertures multiples : rotation automatique sur la carte. */
  covers?: string[];
  minElements: number; // minimum d'éléments, configurable par l'admin
  linkedProduct: SpecialServiceLinkedProduct | null;
  components: ServiceComponent[];
}
