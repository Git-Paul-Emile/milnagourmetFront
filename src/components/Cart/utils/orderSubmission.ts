import { DeliveryZone, CartItem } from '@/types';
import { orderService } from '@/services';
import { CustomerInfo } from '../hooks/useCustomerInfo';

interface OrderSubmissionParams {
  cartItems: CartItem[];
  subtotal: number;
  customerInfo: CustomerInfo;
  selectedZone: DeliveryZone | undefined;
  pointsUsed?: number;
}

export async function submitOrder({
  cartItems,
  subtotal,
  customerInfo,
  selectedZone,
  pointsUsed = 0
}: OrderSubmissionParams): Promise<void> {
  if (!customerInfo.name || !customerInfo.phone || !selectedZone) {
    throw new Error('Informations client ou zone de livraison manquantes');
  }

  const deliveryFee = selectedZone.deliveryFee || 0;
  const pointsDiscount = pointsUsed * 1; // 1 point = 1 FCFA
  const totalWithDelivery = subtotal + deliveryFee - pointsDiscount;

  // Préparer les données pour l'API
  const orderData = {
    customer: null, // Pour invités
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      product: item.product,
      customCreation: item.customCreation
    })),
    total: totalWithDelivery,
    deliveryFee: deliveryFee,
    deliveryZoneId: selectedZone.id,
    pointsUsed: pointsUsed,
    pointsDiscount: pointsDiscount,
    // Les compositions des services "sur devis" sont conservées dans les notes de la
    // commande pour que l'admin les voie et que le vendeur puisse chiffrer le prix.
    notes: cartItems
      .filter((item) => item.isServiceQuote)
      .map((item) => `${item.name} : ${item.description ?? ''}`)
      .join(' | '),
  };

  // Envoyer à l'API backend via le service centralisé (gère token, credentials, refresh)
  await orderService.createOrder(orderData);
}