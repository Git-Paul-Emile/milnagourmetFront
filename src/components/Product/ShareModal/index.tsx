import React from 'react';
import { Product } from '@/types';
import { ShareModalContent } from './ShareModalContent';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function ShareModal({ isOpen, onClose, product }: ShareModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <ShareModalContent product={product} onClose={onClose} />
      </div>
    </>
  );
}