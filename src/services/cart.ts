import { httpClient } from './httpClient';
import { CartItem } from '@/types';

export interface CartData {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  productId: string;
  quantity: number;
}

export interface AddCustomCreationData {
  tailleId: number;
  quantity: number;
  price: number;
  fruits?: string[];
  sauces?: string[];
  cereales?: string[];
}

export interface UpdateCustomCreationData {
  creationId: number;
  quantity?: number;
  price?: number;
  fruits?: string[];
  sauces?: string[];
  cereales?: string[];
}

class CartService {
  // Récupérer le panier de l'utilisateur
  async getCart(): Promise<CartData | null> {
    const response = await httpClient.get<CartData>('/api/cart');
    return response.data || null;
  }

  // Ajouter un produit au panier
  async addToCart(data: AddToCartData): Promise<void> {
    await httpClient.post('/api/cart', data);
  }

  // Mettre à jour la quantité d'un produit dans le panier
  async updateCartItem(data: UpdateCartItemData): Promise<void> {
    await httpClient.put('/api/cart', data);
  }

  // Supprimer un produit du panier
  async removeFromCart(productId: string): Promise<void> {
    await httpClient.delete(`/api/cart/${productId}`);
  }

  // Vider le panier
  async clearCart(): Promise<void> {
    await httpClient.delete('/api/cart');
  }

  // Ajouter une création personnalisée au panier
  async addCustomCreation(data: AddCustomCreationData): Promise<void> {
    await httpClient.post('/api/cart/custom', data);
  }

  // Mettre à jour une création personnalisée dans le panier
  async updateCustomCreation(data: UpdateCustomCreationData): Promise<void> {
    await httpClient.put('/api/cart/custom', data);
  }

  // Supprimer une création personnalisée du panier
  async removeCustomCreation(creationId: string): Promise<void> {
    await httpClient.delete(`/api/cart/custom/${creationId}`);
  }
}

export const cartService = new CartService();