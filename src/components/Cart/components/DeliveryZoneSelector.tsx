import React from 'react';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeliveryZone } from '@/types';

interface DeliveryZoneSelectorProps {
  deliveryZones: DeliveryZone[];
  selectedZoneId: string;
  isLoading: boolean;
  onZoneChange: (zoneId: string) => void;
}

export function DeliveryZoneSelector({
  deliveryZones,
  selectedZoneId,
  isLoading,
  onZoneChange
}: DeliveryZoneSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="deliveryZone" className="flex items-center space-x-2">
        <MapPin className="h-4 w-4" />
        <span>Zone de livraison</span>
      </Label>
      {isLoading ? (
        <div className="flex items-center space-x-2 p-3 border rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Chargement des zones...</span>
        </div>
      ) : (
        <Select value={selectedZoneId} onValueChange={onZoneChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez votre zone de livraison" />
          </SelectTrigger>
          <SelectContent>
            {deliveryZones.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{zone.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Frais: {zone.deliveryFee} FCFA
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}