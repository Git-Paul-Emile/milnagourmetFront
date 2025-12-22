import { CartItem, Cart, User, CustomerInfo, DeliveryZone, Product } from '@/types';
import { getTimeBasedGreeting } from '@/utils/greeting';
import { deliveryZoneService } from './deliveryZone';

export function buildOrderMessage(items: CartItem[], total: number, customerInfo: CustomerInfo, deliveryZone?: DeliveryZone): string {
  const greeting = getTimeBasedGreeting();
  let message = `${greeting} Milna Gourmet 👋, je souhaite commander :\n\n`;
  items.forEach((item) => {
    const qty = item.quantity;
    const isCreation = !!item.customCreation;
    if (isCreation && item.customCreation) {
      const fruits = (item.customCreation.selectedFruits || []).join(', ');
      const sauces = (item.customCreation.selectedSauces || []).join(', ');
      const detailsParts: string[] = [];
      if (fruits) detailsParts.push(`fruit : ${fruits}`);
      if (sauces) detailsParts.push(`sauce : ${sauces}`);
      const details = detailsParts.length ? ` (${detailsParts.join(', ')})` : '';
      message += `${qty} Création${details}\n`;
    } else {
      const name = item.name;
      const details = item.description ? ` (${item.description})` : '';
      message += `${qty} ${name}${details}\n`;
    }
  });
  const totalQuantity = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  message += `Nombre d'articles : ${totalQuantity}\n`;
  message += `Sous-total : ${items.reduce((sum, item) => sum + (item.price * item.quantity), 0)} FCFA`;
  if (deliveryZone && deliveryZone.deliveryFee > 0) {
    message += `\nFrais de livraison : ${deliveryZone.deliveryFee} FCFA`;
  }
  message += `\nTotal : ${total} FCFA`;
  message += `\n\n`;
  message += `Nom : ${customerInfo.name}`;
  message += `\nTéléphone : ${customerInfo.phone}`;
  if (deliveryZone) {
    message += `\nZone de livraison : ${deliveryZone.name}`;
    if (deliveryZone.estimatedTime) {
      message += `\nTemps de livraison estimé : ${deliveryZone.estimatedTime}`;
    }
  }
  message += `\nDate : ${new Date().toLocaleDateString('fr-FR')}`;
  message += `\nHeure : ${new Date().toLocaleTimeString('fr-FR')}`;

  return message;
}

export async function buildCartOrderMessage(cart: Cart, user?: User | null): Promise<string> {
  const greeting = getTimeBasedGreeting();
  let message = `${greeting} Milna Gourmet 👋, je souhaite commander :\n\n`;
  cart.items.forEach((item) => {
    const qty = item.quantity;
    const isCreation = !!item.customCreation;
    if (isCreation && item.customCreation) {
      const fruits = (item.customCreation.selectedFruits || []).join(', ');
      const sauces = (item.customCreation.selectedSauces || []).join(', ');
      const detailsParts: string[] = [];
      if (fruits) detailsParts.push(`fruit : ${fruits}`);
      if (sauces) detailsParts.push(`sauce : ${sauces}`);
      const details = detailsParts.length ? ` (${detailsParts.join(', ')})` : '';
      message += `${qty} Création${details}\n`;
    } else {
      const name = item.name;
      const details = item.description ? ` (${item.description})` : '';
      message += `${qty} ${name}${details}\n`;
    }
  });
  const totalQuantityCart = cart.items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  message += `Nombre d'articles : ${totalQuantityCart}\n`;
  message += `Sous-total : ${cart.total} FCFA`;
  if (user && cart.deliveryFee > 0) {
    message += `\nFrais de livraison : ${cart.deliveryFee} FCFA`;
  }
  message += `\nTotal : ${user ? cart.totalWithDelivery || cart.total : cart.total} FCFA`;
  message += `\n\n`;
  const customerName = user?.name || 'À confirmer';
  const customerPhone = user?.phone || 'À confirmer';

  // Get delivery zone name if user has deliveryZoneId
  let deliveryZoneName = 'À confirmer';
  if (user?.deliveryZoneId) {
    try {
      const zone = await deliveryZoneService.getDeliveryZoneById(user.deliveryZoneId) as DeliveryZone;
      deliveryZoneName = zone.name;
    } catch (error) {
      console.error('Erreur lors de la récupération de la zone de livraison:', error);
    }
  }

  message += `Nom : ${customerName}`;
  message += `\nTéléphone : ${customerPhone}`;
  message += `\nZone de livraison : ${deliveryZoneName}`;
  message += `\nDate : ${new Date().toLocaleDateString('fr-FR')}`;
  message += `\nHeure : ${new Date().toLocaleTimeString('fr-FR')}`;

  return message;
}

export function buildProductShareMessage(product: Product): string {
  return `🍯 *${product.name}* - Milna Gourmet\n\n` +
         `💰 Prix: ${product.price} F\n` +
         `📝 ${product.description}\n\n` +
         `🛍️ Commandez maintenant chez Milna Gourmet - Le Salon du Yaourt !\n` +
         `📞 Contactez-nous sur WhatsApp`;
}

export function buildContactMessage(message: string = ''): string {
  if (message) return message;
  const greeting = getTimeBasedGreeting();
  return `${greeting} Milna Gourmet ! J'aimerais avoir plus d'informations sur vos produits.`;
}