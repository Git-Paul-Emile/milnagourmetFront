import { Order } from '@/types';

export function getStatusDisplayText(status: string): string {
   switch (status) {
     case 'RECU':
       return 'Reçue';
     case 'LIVREE':
       return 'Livrée';
     case 'ANNULEE':
       return 'Annulée';
     default:
       return status;
   }
 }

export function getStatusClasses(status: string): string {
   switch (status) {
     case 'RECU':
       return 'bg-blue-100 text-blue-800';
     case 'LIVREE':
       return 'bg-purple-100 text-purple-800';
     case 'ANNULEE':
       return 'bg-red-100 text-red-800';
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