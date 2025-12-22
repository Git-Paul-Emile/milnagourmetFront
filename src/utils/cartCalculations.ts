import { CartItem, AuthUser } from '@/types';
import { deliveryZoneService } from '@/services/deliveryZone';

// Fonction helper pour calculer les frais de livraison
export const calculateDeliveryFee = async (user: AuthUser | null): Promise<number> => {
  if (!user || !user.zoneLivraisonId) return 0;

  try {
    // Récupérer la zone par ID
    const zone = await deliveryZoneService.getDeliveryZoneById(user.zoneLivraisonId);
    return zone ? zone.deliveryFee : 0;
  } catch (error) {
    console.error('Erreur lors du calcul des frais de livraison:', error);
    return 0;
  }
};

// Fonction helper pour calculer les totaux du panier
export const calculateCartTotals = (items: CartItem[], deliveryFee: number = 0) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalWithDelivery = total + deliveryFee;

  return { total, itemCount, deliveryFee, totalWithDelivery };
};