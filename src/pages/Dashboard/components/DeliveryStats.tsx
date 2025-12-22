import React from 'react';
import { DeliveryZone, DeliveryPerson } from '@/types/dashboard';
import { MapPin, CheckCircle, User, UserCheck } from 'lucide-react';

interface DeliveryStatsProps {
  deliveryZones: DeliveryZone[];
  deliveryPersons: DeliveryPerson[];
}

export function DeliveryStats({ deliveryZones, deliveryPersons }: DeliveryStatsProps) {
  const totalZonesCount = deliveryZones.length;
  const activeZonesCount = deliveryZones.filter(z => z.active).length;
  const totalPersonsCount = deliveryPersons.length;
  const activePersonsCount = deliveryPersons.filter(p => p.active).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-card rounded-lg p-4 border border-border">
        <MapPin className="h-8 w-8 mb-2 text-muted-foreground" />
        <div className="text-2xl font-bold">{totalZonesCount}</div>
        <div className="text-sm text-muted-foreground">Zones de livraison</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border">
        <CheckCircle className="h-8 w-8 mb-2 text-muted-foreground" />
        <div className="text-2xl font-bold">{activeZonesCount}</div>
        <div className="text-sm text-muted-foreground">Zones actives</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border">
        <User className="h-8 w-8 mb-2 text-muted-foreground" />
        <div className="text-2xl font-bold">{totalPersonsCount}</div>
        <div className="text-sm text-muted-foreground">Livreurs</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border">
        <UserCheck className="h-8 w-8 mb-2 text-muted-foreground" />
        <div className="text-2xl font-bold">{activePersonsCount}</div>
        <div className="text-sm text-muted-foreground">Livreurs actifs</div>
      </div>
    </div>
  );
}