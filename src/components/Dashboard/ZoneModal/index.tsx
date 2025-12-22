import React, { useState, useEffect } from 'react';
import { DeliveryZone } from '@/types';

interface ZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (zone: Partial<DeliveryZone>) => void;
  mode: 'add' | 'edit';
  editingZone?: DeliveryZone | null;
}

export function ZoneModal({ isOpen, onClose, onSave, mode, editingZone }: ZoneModalProps) {
  const [formData, setFormData] = useState<Partial<DeliveryZone>>({
    name: '',
    deliveryFee: 0,
    estimatedTime: '',
    active: true
  });

  useEffect(() => {
    if (mode === 'edit' && editingZone) {
      setFormData(editingZone);
    } else if (mode === 'add') {
      setFormData({
        name: '',
        deliveryFee: 0,
        estimatedTime: '',
        active: true
      });
    }
  }, [mode, editingZone, isOpen]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.deliveryFee || !formData.estimatedTime) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {mode === 'add' ? 'Ajouter une zone de livraison' : 'Modifier la zone de livraison'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la zone *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Centre-ville, Plateau..."
              className="w-full p-2 border border-border rounded-lg"
            />
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Frais de livraison (FCFA) *</label>
            <input
              type="number"
              value={formData.deliveryFee}
              onChange={(e) => setFormData({...formData, deliveryFee: parseInt(e.target.value) || 0})}
              placeholder="1000"
              className="w-full p-2 border border-border rounded-lg"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Temps estimé *</label>
            <input
              type="text"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
              placeholder="30-45 min"
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
              <span className="text-sm">Zone active</span>
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
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.deliveryFee || !formData.estimatedTime}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'add' ? 'Ajouter' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}