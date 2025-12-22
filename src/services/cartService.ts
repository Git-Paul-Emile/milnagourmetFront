import { LocalCartItem, getLocalCartItems, clearLocalCart } from '../hooks/useLocalCart';
import { CartResponse } from './types/cart';
import { CartApi } from './api/cartApi';
import { LocalCartManager } from './local/localCartManager';
import { UnauthenticatedError } from './errors/UnauthenticatedError';

export class CartService {
  private api: CartApi;
  private local: LocalCartManager;

  constructor() {
    this.api = new CartApi();
    this.local = new LocalCartManager();
  }

  /**
   * Obtenir le panier (connecté ou guest)
   */
  async getCart(): Promise<CartResponse | null> {
    try {
      return await this.api.getCart();
    } catch (error) {
      if (error instanceof UnauthenticatedError) {
        return this.local.getCart();
      }
      console.error('Erreur lors de la récupération du panier:', error);
      return null;
    }
  }

  /**
   * Ajouter un article au panier
   */
  async addToCart(item: LocalCartItem): Promise<void> {
    try {
      await this.api.addToCart(item.id, item.quantity);
    } catch (error) {
      if (error instanceof UnauthenticatedError) {
        this.local.addToCart(item);
      } else {
        console.error('Erreur lors de l\'ajout au panier:', error);
        this.local.addToCart(item);
      }
    }
  }

  /**
   * Mettre à jour la quantité d'un article
   */
  async updateQuantity(productId: string, quantity: number): Promise<void> {
    try {
      await this.api.updateQuantity(productId, quantity);
    } catch (error) {
      if (error instanceof UnauthenticatedError) {
        this.local.updateQuantity(productId, quantity);
      } else {
        console.error('Erreur lors de la mise à jour du panier:', error);
        this.local.updateQuantity(productId, quantity);
      }
    }
  }

  /**
   * Supprimer un article du panier
   */
  async removeFromCart(productId: string): Promise<void> {
    try {
      await this.api.removeFromCart(productId);
    } catch (error) {
      if (error instanceof UnauthenticatedError) {
        this.local.removeFromCart(productId);
      } else {
        console.error('Erreur lors de la suppression du panier:', error);
        this.local.removeFromCart(productId);
      }
    }
  }

  /**
   * Vider le panier
   */
  async clearCart(): Promise<void> {
    try {
      await this.api.clearCart();
    } catch (error) {
      if (error instanceof UnauthenticatedError) {
        this.local.clearCart();
      } else {
        console.error('Erreur lors du vidage du panier:', error);
        this.local.clearCart();
      }
    }
  }

  /**
   * Procédure de checkout
   */
  async checkout(): Promise<{ orderId: number; totalAmount: number }> {
    try {
      return await this.api.checkout();
    } catch (error) {
      console.error('Erreur lors du checkout:', error);
      throw error;
    }
  }

  /**
   * Fusionner le panier guest avec le panier utilisateur
   */
  async mergeGuestCart(): Promise<void> {
    try {
      const guestItems = getLocalCartItems();
      if (guestItems.length === 0) {
        return;
      }

      // Ajouter chaque article du panier guest au panier utilisateur
      for (const item of guestItems) {
        await this.addToCart(item);
      }

      // Vider le panier guest
      clearLocalCart();
    } catch (error) {
      console.error('Erreur lors de la fusion du panier:', error);
    }
  }
}

export const cartService = new CartService();
