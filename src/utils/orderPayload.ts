import type { CartItem } from '@/types';

export function toOrderItemPayload(item: CartItem) {
  const isCreation = Boolean(item.customCreation) || item.id.startsWith('creation');
  const productId = item.product?.id ? String(item.product.id) : item.id.split('-')[0];

  return {
    id: isCreation ? item.id : productId,
    name: item.name,
    description: item.description,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    product: item.product ? { ...item.product, id: String(item.product.id) } : undefined,
    customCreation: item.customCreation
  };
}
