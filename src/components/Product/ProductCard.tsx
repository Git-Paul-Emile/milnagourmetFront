import React from 'react';
import { Product } from '@/types';
import { ShareModal } from './ShareModal';
import { cn } from '@/lib/utils';
import { useProductCard } from './hooks/useProductCard';
import { useTheme } from '@/hooks/useTheme';
import { ProductImage } from './components/ProductImage';
import { ProductInfo } from './components/ProductInfo';
import { ProductActions } from './components/ProductActions';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { isShareModalOpen, setIsShareModalOpen, cardRef, handleAddToCart, handleShare } = useProductCard({ product });
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative rounded-xl overflow-hidden',
        'hover-lift transition-all duration-500 ease-out',
        'transform-gpu',
        'bg-card border border-border bg-gradient-card hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300'
      )}
    >
      <ProductImage product={product} onViewDetails={onViewDetails} onShare={handleShare} />
      <ProductInfo product={product} />
      <div className="px-4 pb-4">
        <ProductActions product={product} onAddToCart={handleAddToCart} />
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={product}
      />
    </div>
  );
}