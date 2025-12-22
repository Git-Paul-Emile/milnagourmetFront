import { DeliveryZone, CartItem } from '@/types';
import { CustomerInfo } from '../hooks/useCustomerInfo';

interface OrderSubmissionParams {
  cartItems: CartItem[];
  subtotal: number;
  customerInfo: CustomerInfo;
  selectedZone: DeliveryZone | undefined;
}

export async function submitOrder({
  cartItems,
  subtotal,
  customerInfo,
  selectedZone
}: OrderSubmissionParams): Promise<void> {
  if (!customerInfo.name || !customerInfo.phone || !selectedZone) {
    throw new Error('Informations client ou zone de livraison manquantes');
  }

  const totalWithDelivery = subtotal + (selectedZone.deliveryFee || 0);

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
    deliveryFee: selectedZone.deliveryFee || 0,
    notes: '',
  };

  // Envoyer à l'API backend
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erreur lors de la commande');
  }
}