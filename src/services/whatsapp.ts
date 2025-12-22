import { CartItem, Cart, User, CustomerInfo, Product, DeliveryZone } from '@/types';
import { orderService } from './index';
import { getContactInfo } from './contactInfoService';
import { buildOrderMessage, buildCartOrderMessage, buildProductShareMessage, buildContactMessage } from './messageBuilder';
import { addOrderToUserHistory } from './orderHistoryManager';
import { callMilna } from './phoneService';

export async function sendOrderToWhatsApp(items: CartItem[], total: number, customerInfo: CustomerInfo, deliveryZone?: DeliveryZone): Promise<void> {
  const contactInfo = await getContactInfo();
  const whatsappNumber = contactInfo.whatsapp || '+24106610304';

  const message = buildOrderMessage(items, total, customerInfo, deliveryZone);

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

export async function sendCartOrderToWhatsApp(cart: Cart, user?: User | null): Promise<void> {
  // Créer la commande dans l'API
  const orderData = {
    id: Date.now().toString(),
    customer: user ? {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email
    } : null,
    items: cart.items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      product: item.product,
      customCreation: item.customCreation
    })),
    total: user ? cart.totalWithDelivery || cart.total : cart.total,
    deliveryFee: user ? cart.deliveryFee || 0 : 0,
    status: 'pending',
    date: new Date().toISOString(),
    notes: ''
  };

  // Enregistrer la commande dans l'API
  const savedOrder = await orderService.createOrder(orderData);

  // Si l'utilisateur est connecté, ajouter la commande à son historique local
  if (user) {
    addOrderToUserHistory(user, cart);
  }

  // Ouvrir WhatsApp pour notifier le propriétaire
  const message = await buildCartOrderMessage(cart, user);

  const contactInfo = await getContactInfo();
  const whatsappNumber = contactInfo?.whatsapp || '+24106610304';

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
}

export function shareProductOnWhatsApp(product: Product): void {
  const message = buildProductShareMessage(product);

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
}

export async function contactMilnaWhatsApp(message: string = ''): Promise<void> {
  const contactInfo = await getContactInfo();
  const whatsappNumber = contactInfo.whatsapp || '+24106610304';

  const defaultMessage = buildContactMessage(message);
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
}

// Re-export pour compatibilité
export { callMilna } from './phoneService';