import React, { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { DeliveryZone } from '@/types/dashboard';
import { DeliveryZoneCard } from './DeliveryZoneCard';
import { ZoneModal } from '@/components/Dashboard/ZoneModal';
import { DeleteModal } from '@/components/modals/DeleteModal';

interface DeliveryZonesSectionProps {
  zones: DeliveryZone[];
  editingZone: DeliveryZone | null;
  onEditZone: (zone: DeliveryZone | null) => void;
  onAddZone: (zoneData: Partial<DeliveryZone>) => void;
  onSaveZone: (zoneData: Partial<DeliveryZone>) => void;
  onDeleteZone: (zoneId: string, zoneName: string) => void;
  onToggleZoneStatus: (zoneId: string, currentStatus: boolean) => void;
}

export function DeliveryZonesSection({
  zones,
  editingZone,
  onEditZone,
  onAddZone,
  onSaveZone,
  onDeleteZone,
  onToggleZoneStatus
}: DeliveryZonesSectionProps) {
  const [addZoneModal, setAddZoneModal] = useState(false);
  const [deletingZone, setDeletingZone] = useState<DeliveryZone | null>(null);

  const handleRequestDelete = (zone: DeliveryZone) => {
    setDeletingZone(zone);
  };

  const handleConfirmDelete = async () => {
    if (deletingZone) {
      onDeleteZone(deletingZone.id, deletingZone.name);
      setDeletingZone(null);
    }
  };

  // Trouver la zone active avec le plus de commandes
  const activeZones = zones.filter(zone => zone.active);
  let topZoneId: string | undefined;

  if (activeZones.length > 0) {
    // Filtrer les zones actives qui ont au moins une commande
    const activeZonesWithOrders = activeZones.filter(zone => (zone.orderCount || 0) > 0);

    if (activeZonesWithOrders.length > 0) {
      const maxOrderCount = Math.max(...activeZonesWithOrders.map(zone => zone.orderCount || 0));

      // Parmi les zones avec le nombre max de commandes, prendre celle avec le revenu total le plus élevé
      const candidates = activeZonesWithOrders.filter(zone => (zone.orderCount || 0) === maxOrderCount);
      const topZone = candidates.reduce((prev, current) =>
        (prev.totalRevenue || 0) > (current.totalRevenue || 0) ? prev : current
      );

      topZoneId = topZone.id;
    }
    // Si aucune zone active n'a de commandes, topZoneId reste undefined
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold">Zones de livraison</h3>
        <button
          onClick={() => setAddZoneModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2 inline" />
          Ajouter une zone
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => (
          <DeliveryZoneCard
            key={zone.id}
            zone={zone}
            isTopZone={zone.id === topZoneId}
            onEdit={onEditZone}
            onRequestDelete={handleRequestDelete}
            onToggleStatus={onToggleZoneStatus}
          />
        ))}
      </div>

      {zones.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucune zone de livraison configurée</p>
        </div>
      )}

      <ZoneModal
        isOpen={addZoneModal}
        onClose={() => setAddZoneModal(false)}
        onSave={onAddZone}
        mode="add"
      />

      <ZoneModal
        isOpen={!!editingZone}
        onClose={() => onEditZone(null)}
        onSave={onSaveZone}
        mode="edit"
        editingZone={editingZone}
      />

      <DeleteModal
        isOpen={!!deletingZone}
        item={deletingZone}
        type="deliveryZone"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingZone(null)}
      />
    </div>
  );
}