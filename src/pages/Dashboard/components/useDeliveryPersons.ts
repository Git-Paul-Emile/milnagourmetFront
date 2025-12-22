import { useState } from 'react';
import { DeliveryPerson } from '@/types';
import { deliveryPersonService } from '@/services/deliveryPerson';

export function useDeliveryPersons(initialPersons: DeliveryPerson[], displaySuccessToast: (message: string) => void, loadDashboardData: () => Promise<void>) {
  const [persons, setPersons] = useState<DeliveryPerson[]>(initialPersons);
  const [editingPerson, setEditingPerson] = useState<DeliveryPerson | null>(null);

  const handleAddDeliveryPerson = async (personData: Partial<DeliveryPerson>) => {
    if (!personData.nomComplet || !personData.phone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await deliveryPersonService.create(personData);
      displaySuccessToast(`Livreur "${personData.nomComplet}" ajouté avec succès`);
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du livreur:', error);
    }
  };

  const handleSaveDeliveryPerson = async (personData: Partial<DeliveryPerson>) => {
    if (!editingPerson) return;

    try {
      await deliveryPersonService.update(editingPerson.id, personData);
      displaySuccessToast(`Livreur "${editingPerson.nomComplet}" modifié avec succès`);
      setEditingPerson(null);
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de la modification du livreur:', error);
    }
  };

  const handleDeleteDeliveryPerson = async (personId: string, personName: string) => {
    try {
      await deliveryPersonService.delete(personId);
      displaySuccessToast(`Livreur "${personName}" supprimé avec succès`);
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de la suppression du livreur:', error);
    }
  };

  const handleToggleDeliveryPersonStatus = async (personId: string, currentStatus: boolean) => {
    try {
      await deliveryPersonService.update(personId, { active: !currentStatus } as Partial<DeliveryPerson>);
      displaySuccessToast(`Livreur ${!currentStatus ? 'activé' : 'désactivé'}`);
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du livreur:', error);
    }
  };

  return {
    persons,
    editingPerson,
    setEditingPerson,
    handleAddDeliveryPerson,
    handleSaveDeliveryPerson,
    handleDeleteDeliveryPerson,
    handleToggleDeliveryPersonStatus
  };
}