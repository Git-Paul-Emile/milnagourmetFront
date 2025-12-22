import React from 'react';
import { Clock } from 'lucide-react';
import { StoreHours } from '@/types';

interface StoreHoursSectionProps {
  editingHours: StoreHours[];
  onHourChange: (dayIndex: number, field: 'open' | 'close', value: string) => void;
  onClosedChange: (dayIndex: number, closed: boolean) => void;
  onSave: (hours: StoreHours[]) => Promise<void>;
  isSaving: boolean;
  displaySuccessToast: (message: string) => void;
  onInitializeHours?: () => void;
}

export function StoreHoursSection({
  editingHours,
  onHourChange,
  onClosedChange,
  onSave,
  isSaving,
  displaySuccessToast,
  onInitializeHours
}: StoreHoursSectionProps) {
  const handleUpdateStoreHours = async () => {
    try {
      await onSave(editingHours);
      displaySuccessToast('Horaires d\'ouverture mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des horaires:', error);
      displaySuccessToast('Erreur lors de la mise à jour des horaires');
    }
  };

  // État vide : aucun horaire défini
  if (editingHours.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Horaires d'ouverture</h3>
        </div>

        <div className="text-center py-8 px-4">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun horaire défini</h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Configurez les horaires d'ouverture de votre établissement pour informer vos clients.
          </p>
          {onInitializeHours && (
            <button
              onClick={onInitializeHours}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
            >
              Définir les horaires
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Horaires d'ouverture</h3>
      </div>

      <div className="space-y-4">
        {editingHours.map((day, index) => (
          <div key={day.day} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 border border-border rounded-lg">
            <div className="w-full sm:w-24 font-medium capitalize">
              {day.day}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={day.closed}
                  onChange={(e) => onClosedChange(index, e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Fermé</span>
              </div>
              {!day.closed && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <label className="text-sm font-medium">Ouverture:</label>
                    <input
                      type="time"
                      value={day.open}
                      onChange={(e) => onHourChange(index, 'open', e.target.value)}
                      className="p-2 border border-border rounded-lg w-full sm:w-auto"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <label className="text-sm font-medium">Fermeture:</label>
                    <input
                      type="time"
                      value={day.close}
                      onChange={(e) => onHourChange(index, 'close', e.target.value)}
                      className="p-2 border border-border rounded-lg w-full sm:w-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center sm:justify-end mt-6">
        <button
          onClick={handleUpdateStoreHours}
          disabled={isSaving}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          Sauvegarder les horaires
        </button>
      </div>
    </div>
  );
}