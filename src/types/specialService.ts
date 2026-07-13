// Services spéciaux (Panier gourmand, Boîte pancake) — prix sur devis :
// le vendeur communique le prix au client après réception de la commande.

export interface ServiceComponent {
  id: number;
  name: string;
  available: boolean;
}

export interface SpecialServiceLinkedProduct {
  id: number;
  name: string;
  price: number; // toujours 0 (sur devis)
  category: string;
  available: boolean;
}

export interface SpecialService {
  id: number;
  code: 'panier' | 'pancake' | string;
  name: string;
  description?: string | null;
  image?: string | null;
  active: boolean;
  minElements: number; // minimum d'éléments, configurable par l'admin
  linkedProduct: SpecialServiceLinkedProduct | null;
  components: ServiceComponent[];
}
