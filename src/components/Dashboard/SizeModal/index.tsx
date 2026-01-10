import React, { useState, useEffect } from 'react';
import { CreationSize } from '@/types';
import { Button } from '@/components/ui/button';

interface SizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (size: Partial<CreationSize>) => void;
  mode: 'add' | 'edit';
  editingSize?: CreationSize | null;
  existingSizes: CreationSize[];
}

interface FieldErrors {
  nom?: string;
  prix?: string;
}

export function SizeModal({ isOpen, onClose, onSave, mode, editingSize, existingSizes }: SizeModalProps) {
  const [formData, setFormData] = useState<Partial<CreationSize>>({
    nom: '',
    prix: 0,
    maxFruits: 1,
    maxSauces: 1,
    cerealesAutorise: true,
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && editingSize) {
      setFormData(editingSize);
    } else if (mode === 'add') {
      setFormData({
        nom: '',
        prix: 0,
        maxFruits: 1,
        maxSauces: 1,
        cerealesAutorise: true,
        active: true
      });
    }
  }, [mode, editingSize, isOpen]);

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.nom?.trim()) {
      errors.nom = 'Le nom de la taille est obligatoire';
    }

    if (formData.prix === undefined || formData.prix < 0) {
      errors.prix = 'Le prix doit être supérieur ou égal à 0';
    }

    // Check if size name already exists (for add mode)
    if (mode === 'add' && existingSizes.some(size => size.nom.toLowerCase() === formData.nom?.toLowerCase())) {
      errors.nom = 'Cette taille existe déjà';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
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
          {mode === 'add' ? 'Ajouter une taille' : 'Modifier la taille'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la taille *</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              placeholder="Petit, Moyen, Grand..."
              className={`w-full p-2 border rounded-lg ${fieldErrors.nom ? 'border-red-500' : 'border-border'}`}
            />
            {fieldErrors.nom && <p className="text-red-500 text-sm mt-1">{fieldErrors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prix (FCFA) *</label>
            <input
              type="number"
              value={formData.prix}
              onChange={(e) => handleInputChange('prix', parseInt(e.target.value) || 0)}
              placeholder="2500"
              className={`w-full p-2 border rounded-lg ${fieldErrors.prix ? 'border-red-500' : 'border-border'}`}
            />
            {fieldErrors.prix && <p className="text-red-500 text-sm mt-1">{fieldErrors.prix}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Max fruits</label>
              <input
                type="number"
                value={formData.maxFruits}
                onChange={(e) => handleInputChange('maxFruits', parseInt(e.target.value) || 1)}
                placeholder="1"
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max sauces</label>
              <input
                type="number"
                value={formData.maxSauces}
                onChange={(e) => handleInputChange('maxSauces', parseInt(e.target.value) || 1)}
                placeholder="1"
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.cerealesAutorise}
                onChange={(e) => handleInputChange('cerealesAutorise', e.target.checked)}
              />
              <span className="text-sm">Avec céréales</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
              />
              <span className="text-sm">Taille active</span>
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
          >
            {mode === 'add' ? 'Ajouter' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
}