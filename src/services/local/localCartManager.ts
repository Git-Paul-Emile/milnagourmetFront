import { LocalCartItem, persistCart, clearLocalCart, getLocalCartItems } from '../../hooks/useLocalCart';
import { CartResponse } from '../types/cart';

export class LocalCartManager {
  getCart(): CartResponse | null {
    const items = getLocalCartItems();
    if (items.length === 0) return null;
    return {
      id: 'guest',
      userId: 'guest',
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  addToCart(item: LocalCartItem): void {
    const currentCart = getLocalCartItems();
    const existingItem = currentCart.find(i => i.id === item.id);
    let newCartItems;

    if (existingItem) {
      newCartItems = currentCart.map(i => i.id === item.id ? { ...i, quantity: item.quantity } : i);
    } else {
      newCartItems = [...currentCart, item];
    }
    persistCart({ items: newCartItems, updatedAt: Date.now() });
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentCart = getLocalCartItems();
    const newCartItems = currentCart.map(i => i.id === productId ? { ...i, quantity } : i);
    persistCart({ items: newCartItems, updatedAt: Date.now() });
  }

  removeFromCart(productId: string): void {
    const currentCart = getLocalCartItems();
    const newCartItems = currentCart.filter(i => i.id !== productId);
    if (newCartItems.length === 0) {
      clearLocalCart();
    } else {
      persistCart({ items: newCartItems, updatedAt: Date.now() });
    }
  }

  clearCart(): void {
    clearLocalCart();
  }
}