// Types pour les utilisateurs

import { Order } from './order';

export interface User {
  id: string;
  email?: string;
  name: string;
  phone: string;
  orders: Order[];
  createdAt?: string | Date;
  blocked?: boolean; // Nouveau champ pour bloquer les utilisateurs
  role?: 'user' | 'admin' | 'delivery'; // Nouveau champ pour les rôles
  deliveryZoneId?: string; // ID de la zone de livraison
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string; // obligatoire
  email?: string;
  address?: string;
  orderHistory: Order[];
  purchaseFrequency: number; // fréquence d'achat (calculée)
  preferences: {
    favoriteYogurtTypes: string[]; // types de yaourt souvent commandés
  };
  status: 'regular' | 'new'; // client régulier / nouveau
  whatsappOffersEnabled: boolean; // option d'envoi d'offres spéciales via WhatsApp
  createdAt: string | Date;
  lastOrderDate?: string | Date;
  totalOrders: number;
  totalSpent: number;
}