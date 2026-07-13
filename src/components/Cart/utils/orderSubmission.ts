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
    notes: '',
  };

  // Envoyer à l'API backend via le service centralisé (gère token, credentials, refresh)
  await orderService.createOrder(orderData);
}