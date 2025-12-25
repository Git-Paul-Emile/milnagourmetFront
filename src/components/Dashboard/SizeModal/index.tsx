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

export function SizeModal({ isOpen, onClose, onSave, mode, editingSize, existingSizes }: SizeModalProps) {
  const [formData, setFormData] = useState<Partial<CreationSize>>({
    nom: '',
    prix: 0,
    maxFruits: 1,
    maxSauces: 1,
    cerealesAutorise: true,
    active: true
  });
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

  const handleSubmit = async () => {
    if (!formData.nom || formData.prix === undefined || formData.prix < 0) {
      alert('Veuillez saisir un nom et un prix valide pour la taille');
      return;
    }

    // Check if size name already exists (for add mode)
    if (mode === 'add' && existingSizes.some(size => size.nom.toLowerCase() === formData.nom?.toLowerCase())) {
      alert('Cette taille existe déjà');
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
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              placeholder="Petit, Moyen, Grand..."
              className="w-full p-2 border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prix (FCFA) *</label>
            <input
              type="number"
              value={formData.prix}
              onChange={(e) => setFormData({...formData, prix: parseInt(e.target.value) || 0})}
              placeholder="2500"
              min="0"
              className="w-full p-2 border border-border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Max fruits</label>
              <input
                type="number"
                value={formData.maxFruits}
                onChange={(e) => setFormData({...formData, maxFruits: parseInt(e.target.value) || 1})}
                placeholder="1"
                min="1"
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max sauces</label>
              <input
                type="number"
                value={formData.maxSauces}
                onChange={(e) => setFormData({...formData, maxSauces: parseInt(e.target.value) || 1})}
                placeholder="1"
                min="1"
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.cerealesAutorise}
                onChange={(e) => setFormData({...formData, cerealesAutorise: e.target.checked})}
              />
              <span className="text-sm">Avec céréales</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
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
            disabled={!formData.nom || formData.prix === undefined || formData.prix < 0}
          >
            {mode === 'add' ? 'Ajouter' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
}