// Types pour les commandes

import { CartItem } from './cart';

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  deliveryFee: number;
  estimatedTime: string;
  active: boolean;
}

export interface Order {
  id: string;
  customer?: {
    id?: string;
    name?: string;
    phone?: string;
    address?: string;
    email?: string;
  } | null;
  items: CartItem[];
  total: number;
  status: 'recu' | 'livree' | 'annulee' | 'confirmed';
  date: string;
  notes: string;
  // Propriétés pour la compatibilité descendante
  userId?: string;
  createdAt?: string | Date;
  customerInfo?: CustomerInfo;
  // Nouveaux champs pour la gestion des commandes
  deliveryLocation?: string; // Lieu de livraison (si collecté)
  whatsappLink?: string; // Lien de la conversation WhatsApp
  whatsappStatus?: 'pending' | 'sent'; // Statut de l'envoi WhatsApp
  deliveryZone?: DeliveryZone | null; // Zone de livraison avec frais
}