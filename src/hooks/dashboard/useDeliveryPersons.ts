import { useState } from 'react';
import { DeliveryPerson } from '../../types';

export function useDeliveryPersons(deliveryZones: { id: string; name: string }[]) {
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [addDeliveryPersonModal, setAddDeliveryPersonModal] = useState(false);
  const [editingDeliveryPerson, setEditingDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [newDeliveryPerson, setNewDeliveryPerson] = useState<Partial<DeliveryPerson>>({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    zones: [],
    active: true,
    rating: 0,
    totalDeliveries: 0
  });
  const [deliveryPersonZonesInput, setDeliveryPersonZonesInput] = useState<string[]>([]);

  const handleAddDeliveryPerson = async (personData: Partial<DeliveryPerson>) => {
    if (!personData.name || !personData.phone || !personData.vehicle) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const personToCreate: DeliveryPerson = {
      id: Date.now().toString(),
      name: personData.name,
      phone: personData.phone,
      email: personData.email || '',
      vehicle: personData.vehicle,
      zones: deliveryPersonZonesInput,
      active: personData.active ?? true,
      rating: personData.rating || 0,
      totalDeliveries: personData.totalDeliveries || 0,
      createdAt: new Date().toISOString()
    };

    // Simulation d'ajout local
    setDeliveryPersons(prev => [...prev, personToCreate]);
    setNewDeliveryPerson({
      name: '',
      phone: '',
      email: '',
      vehicle: '',
      zones: [],
      active: true,
      rating: 0,
      totalDeliveries: 0
    });
    setDeliveryPersonZonesInput([]);
    setAddDeliveryPersonModal(false);
  };

  const handleEditDeliveryPerson = (person: DeliveryPerson) => {
    setEditingDeliveryPerson(person);
    setDeliveryPersonZonesInput(person.zones);
  };

  const handleSaveDeliveryPerson = async (personData: Partial<DeliveryPerson>) => {
    if (!editingDeliveryPerson) return;

    const updatedPerson = {
      ...editingDeliveryPerson,
      ...personData,
      zones: deliveryPersonZonesInput
    };

    // Simulation de modification locale
    setDeliveryPersons(prev => prev.map(person => person.id === updatedPerson.id ? updatedPerson : person));
    setEditingDeliveryPerson(null);
    setDeliveryPersonZonesInput([]);
  };

  const handleDeleteDeliveryPerson = async (personId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?')) return;

    // Simulation de suppression locale
    setDeliveryPersons(prev => prev.filter(person => person.id !== personId));
  };

  const handleToggleDeliveryPersonStatus = async (personId: string, currentStatus: boolean) => {
    // Simulation de mise à jour locale
    setDeliveryPersons(prev => prev.map(person =>
      person.id === personId ? { ...person, active: !currentStatus } : person
    ));
  };

  return {
    deliveryPersons,
    setDeliveryPersons,
    addDeliveryPersonModal,
    setAddDeliveryPersonModal,
    editingDeliveryPerson,
    setEditingDeliveryPerson,
    newDeliveryPerson,
    setNewDeliveryPerson,
    deliveryPersonZonesInput,
    setDeliveryPersonZonesInput,
    handleAddDeliveryPerson,
    handleEditDeliveryPerson,
    handleSaveDeliveryPerson,
    handleDeleteDeliveryPerson,
    handleToggleDeliveryPersonStatus
  };
}