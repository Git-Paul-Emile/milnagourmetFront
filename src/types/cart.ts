// Types pour le panier

import { Product } from './product';
import { CustomCreation } from './creation';

export interface CartItem {
  id: string;
  product?: Product;
  customCreation?: CustomCreation;
  quantity: number;
  price: number;
  name: string;
  description?: string;
  image?: string;
  /** Article "sur devis" (services spéciaux) : prix 0, communiqué par le vendeur après commande */
  isServiceQuote?: boolean;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  deliveryFee?: number;
  totalWithDelivery?: number;
  pointsUsed?: number;
  pointsDiscount?: number;
  totalWithDiscount?: number;
}