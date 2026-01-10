import React, { useState, useEffect } from 'react';
import { DeliveryZone } from '@/types';
import { Button } from '@/components/ui/button';

interface ZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (zone: Partial<DeliveryZone>) => void;
  mode: 'add' | 'edit';
  editingZone?: DeliveryZone | null;
}

interface FieldErrors {
  name?: string;
  deliveryFee?: string;
  estimatedTime?: string;
}

export function ZoneModal({ isOpen, onClose, onSave, mode, editingZone }: ZoneModalProps) {
  const [formData, setFormData] = useState<Partial<DeliveryZone>>({
    name: '',
    deliveryFee: 0,
    estimatedTime: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Le nom de la zone est obligatoire';
    }

    if (!formData.deliveryFee || formData.deliveryFee <= 0) {
      errors.deliveryFee = 'Les frais de livraison doivent être supérieurs à 0';
    }

    if (!formData.estimatedTime?.trim()) {
      errors.estimatedTime = 'Le temps estimé est obligatoire';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    setGlobalError('');
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setGlobalError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {mode === 'add' ? 'Ajouter une zone de livraison' : 'Modifier la zone de livraison'}
        </h3>

        {globalError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{globalError}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la zone *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Centre-ville, Plateau..."
              className={`w-full p-2 border rounded-lg ${fieldErrors.name ? 'border-red-500' : 'border-border'}`}
            />
            {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Frais de livraison (FCFA) *</label>
            <input
              type="number"
              value={formData.deliveryFee}
              onChange={(e) => handleInputChange('deliveryFee', parseInt(e.target.value) || 0)}
              placeholder="1000"
              className={`w-full p-2 border rounded-lg ${fieldErrors.deliveryFee ? 'border-red-500' : 'border-border'}`}
            />
            {fieldErrors.deliveryFee && <p className="text-red-500 text-sm mt-1">{fieldErrors.deliveryFee}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Temps estimé *</label>
            <input
              type="text"
              value={formData.estimatedTime}
              onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
              placeholder="30-45 min"
              className={`w-full p-2 border rounded-lg ${fieldErrors.estimatedTime ? 'border-red-500' : 'border-border'}`}
            />
            {fieldErrors.estimatedTime && <p className="text-red-500 text-sm mt-1">{fieldErrors.estimatedTime}</p>}
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
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!formData.name || !formData.deliveryFee || !formData.estimatedTime}
          >
            {mode === 'add' ? 'Ajouter' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
}