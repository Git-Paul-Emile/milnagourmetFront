import React from 'react';
import { DeliveryZone, DeliveryPerson } from '@/types/dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeliveryStats } from './DeliveryStats';
import { DeliveryZonesSection } from './DeliveryZonesSection';
import { DeliveryPersonsSection } from './DeliveryPersonsSection';
import { useDeliveryZones } from './useDeliveryZones';
import { useDeliveryPersons } from './useDeliveryPersons';
import { MapPin, User } from 'lucide-react';

interface DeliveryTabProps {
  deliveryZones: DeliveryZone[];
  deliveryPersons: DeliveryPerson[];
  loadDashboardData: () => Promise<void>;
  displaySuccessToast: (message: string) => void;
}

export function DeliveryTab({ deliveryZones, deliveryPersons, loadDashboardData, displaySuccessToast }: DeliveryTabProps) {
  const {
    zones,
    editingZone,
    setEditingZone,
    handleAddZone,
    handleSaveZone,
    handleDeleteZone,
    handleToggleZoneStatus
  } = useDeliveryZones(deliveryZones, displaySuccessToast, loadDashboardData);

  const {
    persons,
    editingPerson,
    setEditingPerson,
    handleAddDeliveryPerson,
    handleSaveDeliveryPerson,
    handleDeleteDeliveryPerson,
    handleToggleDeliveryPersonStatus
  } = useDeliveryPersons(deliveryPersons, displaySuccessToast, loadDashboardData);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des livraisons</h2>

      <DeliveryStats deliveryZones={zones} deliveryPersons={persons} />

      <div className="space-y-6">

        <Tabs defaultValue="zones" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="zones" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Zones de livraison</span>
            </TabsTrigger>
            <TabsTrigger value="persons" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Livreurs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="zones" className="space-y-6">
            <DeliveryZonesSection
              zones={zones}
              editingZone={editingZone}
              onEditZone={setEditingZone}
              onAddZone={handleAddZone}
              onSaveZone={handleSaveZone}
              onDeleteZone={handleDeleteZone}
              onToggleZoneStatus={handleToggleZoneStatus}
            />
          </TabsContent>

          <TabsContent value="persons" className="space-y-6">
            <DeliveryPersonsSection
              persons={persons}
              editingPerson={editingPerson}
              onEditPerson={setEditingPerson}
              onAddPerson={handleAddDeliveryPerson}
              onSavePerson={handleSaveDeliveryPerson}
              onDeletePerson={handleDeleteDeliveryPerson}
              onTogglePersonStatus={handleToggleDeliveryPersonStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}