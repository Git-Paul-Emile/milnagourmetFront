import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { orderService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { httpClient } from '@/services';

export const useOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token existe avant de charger
    const hasToken = httpClient.hasToken();
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';

    // Ne charger que si on a un token ET l'utilisateur est authentifié, ses infos sont chargées et il est admin
    if (hasToken && isAuthenticated && user && isAdmin) {
      loadOrders();
    } else {
      // Pas de token ou utilisateur non admin
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      setOrders((response.data as Order[]) || []);
    } catch (error: unknown) {
      // Ne pas afficher d'erreur si c'est une erreur 401 (non authentifié)
      // car cela peut arriver si l'utilisateur n'est pas admin
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
        console.warn('Accès non autorisé aux commandes - droits administrateur requis');
      } else {
        console.error('Erreur lors du chargement des commandes:', error);
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], message?: string) => {
    try {
      // Appeler l'API pour mettre à jour le statut
      await orderService.updateOrderStatus(orderId, status);

      // Mettre à jour l'état local seulement si l'API a réussi
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status, notes: message || order.notes } : order
      ));
    } catch (error: unknown) {
      console.error('Erreur lors de la mise à jour du statut de la commande:', error);
      throw error; // Re-throw pour que l'appelant puisse gérer l'erreur
    }
  };

  return {
    orders,
    loading,
    loadOrders,
    updateOrderStatus
  };
};