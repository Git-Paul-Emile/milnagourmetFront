import React from 'react';
import { MapPin, Edit, Trash2, Crown } from 'lucide-react';
import { DeliveryZone } from '@/types/dashboard';

interface DeliveryZoneCardProps {
  zone: DeliveryZone;
  isTopZone?: boolean;
  onEdit: (zone: DeliveryZone) => void;
  onRequestDelete: (zone: DeliveryZone) => void;
  onToggleStatus: (zoneId: string, currentStatus: boolean) => void;
}

export function DeliveryZoneCard({ zone, isTopZone, onEdit, onRequestDelete, onToggleStatus }: DeliveryZoneCardProps) {
  return (
    <div className={`bg-card rounded-lg border p-4 ${zone.active ? 'border-border' : 'border-red-200 opacity-60'} ${isTopZone ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          <h4 className="font-semibold">{zone.name}</h4>
        </div>
        {isTopZone ? (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium flex items-center space-x-1">
            <Crown className="h-4 w-4" />
            <span>Best</span>
          </span>
        ) : (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            zone.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {zone.active ? 'Active' : 'Inactive'}
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
       <div className="flex justify-between">
         <span className="text-muted-foreground">Frais de livraison:</span>
         <span className="font-medium">{zone.deliveryFee} FCFA</span>
       </div>
       <div className="flex justify-between">
         <span className="text-muted-foreground">Temps estimé:</span>
         <span className="font-medium">{zone.estimatedTime}</span>
       </div>
       <div className="flex justify-between">
         <span className="text-muted-foreground">Commandes:</span>
         <span className="font-medium">{zone.orderCount || 0}</span>
       </div>
     </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onToggleStatus(zone.id, zone.active)}
          className={`px-3 py-1 rounded text-xs ${
            zone.active
              ? 'bg-red-100 text-red-800 hover:bg-red-200'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          {zone.active ? 'Désactiver' : 'Activer'}
        </button>
        <button
          onClick={() => onEdit(zone)}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
        >
          Modifier
        </button>
        <button
          onClick={() => onRequestDelete(zone)}
          className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}