import { useState, useRef, useEffect } from 'react';
import { Product } from '@/types';
import { useApp } from '@/contexts/useApp';
import { useAvatarToast } from '@/hooks/useAvatarToast';

interface UseProductCardProps {
  product: Product;
}

export function useProductCard({ product }: UseProductCardProps) {
  const { dispatch } = useApp();
  const avatarToast = useAvatarToast();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fermer le modal si on clique en dehors de la carte
  useEffect(() => {
    if (!isShareModalOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsShareModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isShareModalOpen]);

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

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return {
    isShareModalOpen,
    setIsShareModalOpen,
    cardRef,
    handleAddToCart,
    handleShare
  };
}