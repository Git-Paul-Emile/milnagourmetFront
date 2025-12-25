import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Product, User as UserType, DeliveryPerson, DeliveryZone } from '@/types';
import { Button } from '@/components/ui/button';

interface ImageItem {
  value: string;
  label: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  item?: Product | UserType | DeliveryPerson | DeliveryZone | ImageItem;
  type: 'product' | 'user' | 'deliveryPerson' | 'deliveryZone' | 'image';
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteModal({ isOpen, item, type, onConfirm, onCancel }: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center space-x-3 mb-4">
          <Trash2 className="h-6 w-6 text-red-500" />
          <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Êtes-vous sûr de vouloir supprimer{' '}
          <span className="font-medium text-foreground">
            {item && ('name' in item ? item.name : 'nomComplet' in item ? item.nomComplet : 'label' in item ? item.label : '')}
          </span>
          {' '}?
          <br />
          <span className="text-sm text-red-600 font-medium">
            Cette action est irréversible.
          </span>
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <Button
            onClick={handleConfirm}
            loading={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Supprimer définitivement
          </Button>
        </div>
      </div>
    </div>
  );
}