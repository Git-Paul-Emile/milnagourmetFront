import { useState, useEffect } from 'react';

const CART_STORAGE_KEY = 'milna-guest-cart';
const CART_EXPIRY_KEY = 'milna-guest-cart-expiry';
const CART_EXPIRY_DAYS = 7;

export interface LocalCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export interface LocalCart {
  items: LocalCartItem[];
  updatedAt: number;
}

/**
 * Persister le panier dans localStorage avec expiration
 */
export function persistCart(cart: LocalCart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    const expiryTime = Date.now() + CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(CART_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier:', error);
  }
}

/**
 * Charger le panier depuis localStorage, en vérifiant l'expiration
 */
export function loadCart(): LocalCart | null {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const expiry = localStorage.getItem(CART_EXPIRY_KEY);

    if (!stored || !expiry) {
      return null;
    }

    // Vérifier l'expiration
    const expiryTime = parseInt(expiry, 10);
    if (Date.now() > expiryTime) {
      // Panier expiré
      clearLocalCart();
      return null;
    }

    const parsed = JSON.parse(stored) as LocalCart;
    return parsed;
  } catch (error) {
    console.error('Erreur lors du chargement du panier:', error);
    return null;
  }
}

/**
 * Vider complètement le panier
 */
export function clearLocalCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(CART_EXPIRY_KEY);
}

/**
 * Obtenir tous les articles du panier local
 */
export function getLocalCartItems(): LocalCartItem[] {
  const cart = loadCart();
  return cart?.items || [];
}

/**
 * Hook pour gérer le panier en localStorage
 * Utilisé pour les utilisateurs non connectés (guests)
 */
export function useLocalCart() {
  const [cart, setCart] = useState<LocalCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialiser le panier depuis localStorage
  useEffect(() => {
    const loadedCart = loadCart();
    setCart(loadedCart);
    setIsLoading(false);
  }, []);

  /**
   * Ajouter ou mettre à jour un article dans le panier
   */
  const addItem = (item: LocalCartItem) => {
    setCart(prev => {
      const newCart = prev || { items: [], updatedAt: Date.now() };
      
      // Logique de fusion: si l'ID existe, mettre à jour la quantité
      const existingIndex = newCart.items.findIndex(i => i.id === item.id);

      if (existingIndex >= 0) {
        // Mettre à jour la quantité
        newCart.items[existingIndex].quantity = item.quantity;
      } else {
        // Ajouter un nouvel article
        newCart.items.push(item);
      }

      newCart.updatedAt = Date.now();
      persistCart(newCart);
      return newCart;
    });
  };

  /**
   * Supprimer un article du panier
   */
  const removeItem = (productId: string) => {
    setCart(prev => {
      if (!prev) return null;

      const newCart = {
        ...prev,
        items: prev.items.filter(i => i.id !== productId),
        updatedAt: Date.now(),
      };

      if (newCart.items.length === 0) {
        clearLocalCart();
        return null;
      }

      persistCart(newCart);
      return newCart;
    });
  };

  /**
   * Mettre à jour la quantité d'un article
   */
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(prev => {
      if (!prev) return null;

      const newCart = {
        ...prev,
        items: prev.items.map(i =>
          i.id === productId ? { ...i, quantity } : i
        ),
        updatedAt: Date.now(),
      };

      persistCart(newCart);
      return newCart;
    });
  };

  /**
   * Vider complètement le panier
   */
  const clearCart = () => {
    clearLocalCart();
    setCart(null);
  };

  /**
   * Obtenir le panier actuel
   */
  const getCart = (): LocalCart | null => cart;

  /**
   * Obtenir tous les articles du panier
   */
  const getItems = (): LocalCartItem[] => cart?.items || [];

  /**
   * Calculer le total du panier
   */
  const getTotal = (): number => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  /**
   * Obtenir le nombre d'articles dans le panier
   */
  const getItemCount = (): number => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cart,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCart,
    getItems,
    getTotal,
    getItemCount,
  };
}
