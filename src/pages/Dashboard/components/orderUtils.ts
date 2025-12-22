import { Order } from '@/types';

export function getStatusDisplayText(status: string): string {
   switch (status) {
     case 'RECU':
       return 'Reçue';
     case 'EN_PREPARATION':
       return 'En préparation';
     case 'LIVRAISON':
       return 'En livraison';
     case 'LIVREE':
       return 'Livrée';
     default:
       return status;
   }
 }

export function getStatusClasses(status: string): string {
   switch (status) {
     case 'RECU':
       return 'bg-blue-100 text-blue-800';
     case 'EN_PREPARATION':
       return 'bg-orange-100 text-orange-800';
     case 'LIVRAISON':
       return 'bg-green-100 text-green-800';
     case 'LIVREE':
       return 'bg-purple-100 text-purple-800';
     default:
       return 'bg-gray-100 text-gray-800';
   }
 }

export function formatOrderDate(order: Order): string {
  const date = order.date || order.createdAt || '';
  return new Date(date).toLocaleDateString('fr-FR');
}

export function formatOrderId(orderId: string): string {
  return orderId.slice(-6);
}