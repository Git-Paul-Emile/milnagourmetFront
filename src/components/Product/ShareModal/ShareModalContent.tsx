import React from 'react';
import { X, Share2 } from 'lucide-react';
import { Product } from '@/types';
import { ProductPreview } from './ProductPreview';
import { ShareOptions } from './ShareOptions';
import { ShareOption, createShareOptions } from './constants';

interface ShareModalContentProps {
  product: Product;
  onClose: () => void;
}

export function ShareModalContent({ product, onClose }: ShareModalContentProps) {
  const shareOptions = createShareOptions(product);

  const handleShare = (action: () => void) => {
    action();
  };

  return (
    <div
      className="bg-background rounded-2xl max-w-md w-full border border-border shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Share2 className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold">Partager</h2>
            <p className="text-sm text-muted-foreground">{product.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <ProductPreview product={product} />
        <ShareOptions
          options={shareOptions}
          onShare={handleShare}
          onClose={onClose}
        />
      </div>
    </div>
  );
}