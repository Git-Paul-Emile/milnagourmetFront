import React from 'react';
import { Product, User as UserType } from '@/types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Product | UserType | null;
  type: 'product' | 'user';
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, onClose, item, type, onConfirm }: DeleteModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
        <p className="text-muted-foreground mb-6">
          Êtes-vous sûr de vouloir supprimer{' '}
          <span className="font-medium text-foreground">
            {item.name}
          </span>
          {' '}?
          <br />
          <span className="text-sm text-red-600 font-medium">
            Cette action est irréversible.
          </span>
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  );
}