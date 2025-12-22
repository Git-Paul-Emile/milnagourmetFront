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
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  deliveryFee?: number;
  totalWithDelivery?: number;
}