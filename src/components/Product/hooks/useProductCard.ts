import { useRef } from 'react';
import { Product } from '@/types';
import { useApp } from '@/contexts/useApp';
import { useAvatarToast } from '@/hooks/useAvatarToast';

interface UseProductCardProps {
  product: Product;
}

export function useProductCard({ product }: UseProductCardProps) {
  const { dispatch } = useApp();
  const avatarToast = useAvatarToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.image
      }
    });

    dispatch({
      type: 'ADD_TOAST',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        message: `${product.name} ajouté au panier !`,
        avatar: avatarToast
      }
    });
  };

  return {
    cardRef,
    handleAddToCart
  };
}
