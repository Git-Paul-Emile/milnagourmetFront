import { Order } from '@/types';

export const sendOrderConfirmationMessage = (order: Order) => {
  const customerMessage = `✅ *Commande confirmée !*\n\n` +
                         `Merci pour votre commande ! Nous vous contacterons sous peu.\n\n` +
                         `📋 *Récapitulatif de votre commande:*\n` +
                         order.items.map((item, index) =>
                           `${index + 1}. ${item.name} x${item.quantity} - ${item.price * item.quantity} FCFA`
                         ).join('\n') +
                         `\n💰 *Total: ${order.total} FCFA*\n\n` +
                         `🍯 Milna Gourmet - Le Salon du Yaourt`;

  const phone = order.customer?.phone || order.customerInfo?.phone;
  if (phone) {
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(customerMessage)}`;
    window.open(whatsappUrl, '_blank');
  }
};

export const sendOrderCancellationMessage = (order: Order, message: string) => {
  const cancelMessage = `❌ *Commande annulée*\n\n${message}\n\n🍯 Milna Gourmet`;
  const phone = order.customer?.phone || order.customerInfo?.phone;
  if (phone) {
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(cancelMessage)}`;
    window.open(whatsappUrl, '_blank');
  }
};