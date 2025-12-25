import React, { useState, useEffect } from 'react';
import { DeliveryPerson } from '@/types';
import { Button } from '@/components/ui/button';

interface DeliveryZoneOption {
  id: string;
  name: string;
}

interface DeliveryPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (person: Partial<DeliveryPerson>) => void;
  mode: 'add' | 'edit';
  editingPerson?: DeliveryPerson | null;
}

export function DeliveryPersonModal({
  isOpen,
  onClose,
  onSave,
  mode,
  editingPerson
}: DeliveryPersonModalProps) {
  const [formData, setFormData] = useState<Partial<DeliveryPerson>>({
    nomComplet: '',
    phone: '',
    vehicle: '',
    active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && editingPerson) {
      setFormData(editingPerson);
    } else if (mode === 'add') {
      setFormData({
        nomComplet: '',
        phone: '',
        vehicle: '',
        active: true
      });
    }
  }, [mode, editingPerson, isOpen]);

  const handleSubmit = async () => {
    if (!formData.nomComplet || !formData.phone || !formData.vehicle) {
      alert('Veuillez remplir tous les champs obligatoires');
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
          {mode === 'add' ? 'Ajouter un livreur' : 'Modifier le livreur'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet *</label>
            <input
              type="text"
              value={formData.nomComplet}
              onChange={(e) => setFormData({...formData, nomComplet: e.target.value})}
              placeholder="Jean Dupont"
              className="w-full p-2 border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone *</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+241 77 110 135"
              className="w-full p-2 border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Véhicule *</label>
            <input
              type="text"
              value={formData.vehicle}
              onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
              placeholder="Moto, Voiture, Vélo..."
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
              <span className="text-sm">Livreur actif</span>
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
            disabled={!formData.nomComplet || !formData.phone || !formData.vehicle}
          >
            {mode === 'add' ? 'Ajouter' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
}