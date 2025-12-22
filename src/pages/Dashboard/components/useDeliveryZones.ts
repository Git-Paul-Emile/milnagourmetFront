import { useState, useEffect } from 'react';
import { DeliveryZone } from '@/types/dashboard';
import { deliveryZoneService } from '@/services/deliveryZone';

export function useDeliveryZones(initialZones: DeliveryZone[], displaySuccessToast: (message: string) => void, loadDashboardData: () => Promise<void>) {
  const [zones, setZones] = useState<DeliveryZone[]>(initialZones);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);

  // Synchroniser les zones avec les données initiales quand elles changent
  useEffect(() => {
    setZones(initialZones);
  }, [initialZones]);

  const handleAddZone = async (zoneData: Partial<DeliveryZone>) => {
    if (!zoneData.name) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await deliveryZoneService.create(zoneData);
      displaySuccessToast(`Zone "${zoneData.name}" ajoutée avec succès`);
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la zone:', error);
    }
  };

  const handleSaveZone = async (zoneData: Partial<DeliveryZone>) => {
    if (!editingZone) return;

    try {
      await deliveryZoneService.update(editingZone.id, zoneData);
      displaySuccessToast(`Zone "${editingZone.name}" modifiée avec succès`);
      setEditingZone(null);
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de la modification de la zone:', error);
      alert('Erreur lors de la modification de la zone');
    }
  };

  const handleDeleteZone = async (zoneId: string, zoneName: string) => {
    try {
      await deliveryZoneService.delete(zoneId);
      displaySuccessToast(`Zone "${zoneName}" supprimée avec succès`);
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de la suppression de la zone:', error);
    }
  };

  const handleToggleZoneStatus = async (zoneId: string, currentStatus: boolean) => {
    try {
      await deliveryZoneService.update(zoneId, { active: !currentStatus } as Partial<DeliveryZone>);
      displaySuccessToast(`Zone ${!currentStatus ? 'activée' : 'désactivée'}`);
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la zone:', error);
    }
  };

  return {
    zones,
    editingZone,
    setEditingZone,
    handleAddZone,
    handleSaveZone,
    handleDeleteZone,
    handleToggleZoneStatus
  };
}