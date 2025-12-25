import React, { useState, useEffect } from 'react';
import { ProductCategoryItem } from '@/types';
import { Button } from '@/components/ui/button';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Partial<ProductCategoryItem>) => void;
  mode: 'add' | 'edit';
  editingCategory?: ProductCategoryItem | null;
}

export function CategoryModal({ isOpen, onClose, onSave, mode, editingCategory }: CategoryModalProps) {
  const [formData, setFormData] = useState<Partial<ProductCategoryItem>>({
    name: '',
    active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && editingCategory) {
      setFormData(editingCategory);
    } else if (mode === 'add') {
      setFormData({
        name: '',
        active: true
      });
    }
  }, [mode, editingCategory, isOpen]);

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('Veuillez saisir un nom pour la catégorie');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {mode === 'add' ? 'Ajouter une catégorie' : 'Modifier la catégorie'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la catégorie *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Crèmeux, Fruité..."
              className="w-full p-2 border border-border rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
              />
              <span className="text-sm">Catégorie active</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!formData.name}
          >
            {mode === 'add' ? 'Ajouter' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
}