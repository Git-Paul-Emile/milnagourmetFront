import { useState } from 'react';
import { DeliveryZone } from '../../types';

export function useDeliveryZones() {
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [addZoneModal, setAddZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [newZone, setNewZone] = useState<Partial<DeliveryZone>>({
    name: '',
    areas: [],
    deliveryFee: 0,
    estimatedTime: '',
    active: true
  });
  const [zoneAreasInput, setZoneAreasInput] = useState('');

  const handleAddZone = async (zoneData: Partial<DeliveryZone>) => {
    const areas = zoneAreasInput.split(',').map(area => area.trim()).filter(area => area.length > 0);
    if (areas.length === 0) {
      alert('Veuillez ajouter au moins une zone');
      return;
    }

    const zoneToCreate: DeliveryZone = {
      id: Date.now().toString(),
      name: zoneData.name || '',
      areas: areas,
      deliveryFee: zoneData.deliveryFee || 0,
      estimatedTime: zoneData.estimatedTime || '',
      active: zoneData.active ?? true
    };

    // Simulation d'ajout local
    setDeliveryZones(prev => [...prev, zoneToCreate]);
    setNewZone({
      name: '',
      areas: [],
      deliveryFee: 0,
      estimatedTime: '',
      active: true
    });
    setZoneAreasInput('');
    setAddZoneModal(false);
  };

  const handleEditZone = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setZoneAreasInput(zone.areas.join(', '));
  };

  const handleSaveZone = async (zoneData: Partial<DeliveryZone>) => {
    if (!editingZone) return;

    const areas = zoneAreasInput.split(',').map(area => area.trim()).filter(area => area.length > 0);

    const updatedZone = {
      ...editingZone,
      ...zoneData,
      areas
    };

    // Simulation de modification locale
    setDeliveryZones(prev => prev.map(zone => zone.id === updatedZone.id ? updatedZone : zone));
    setEditingZone(null);
    setZoneAreasInput('');
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) return;

    // Simulation de suppression locale
    setDeliveryZones(prev => prev.filter(zone => zone.id !== zoneId));
  };

  const handleToggleZoneStatus = async (zoneId: string, currentStatus: boolean) => {
    // Simulation de mise à jour locale
    setDeliveryZones(prev => prev.map(zone =>
      zone.id === zoneId ? { ...zone, active: !currentStatus } : zone
    ));
  };

  return {
    deliveryZones,
    setDeliveryZones,
    addZoneModal,
    setAddZoneModal,
    editingZone,
    setEditingZone,
    newZone,
    setNewZone,
    zoneAreasInput,
    setZoneAreasInput,
    handleAddZone,
    handleEditZone,
    handleSaveZone,
    handleDeleteZone,
    handleToggleZoneStatus
  };
}