import { CartResponse } from '../types/cart';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';

const API_BASE_URL = '/api';

export class CartApi {
  async getCart(): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 401) throw new UnauthenticatedError();

    if (!response.ok) throw new Error('Erreur lors de la récupération du panier');

    const data = await response.json();
    return data.data;
  }

  async addToCart(productId: string, quantity: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    if (response.status === 401) throw new UnauthenticatedError();

    if (!response.ok) throw new Error('Erreur lors de l\'ajout au panier');
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    if (response.status === 401) throw new UnauthenticatedError();

    if (!response.ok) throw new Error('Erreur lors de la mise à jour du panier');
  }

  async removeFromCart(productId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 401) throw new UnauthenticatedError();

    if (!response.ok) throw new Error('Erreur lors de la suppression du panier');
  }

  async clearCart(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 401) throw new UnauthenticatedError();

    if (!response.ok) throw new Error('Erreur lors du vidage du panier');
  }

  async checkout(): Promise<{ orderId: number; totalAmount: number }> {
    const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors du checkout');
    }

    const data = await response.json();
    return data.data;
  }
}