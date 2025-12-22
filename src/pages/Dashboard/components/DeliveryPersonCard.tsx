import React from 'react';
import { User, Truck, Bike, Car, CheckCircle, XCircle, Phone, Edit, Trash2 } from 'lucide-react';
import { DeliveryPerson } from '@/types';

interface DeliveryPersonCardProps {
  person: DeliveryPerson;
  onEdit: (person: DeliveryPerson) => void;
  onDelete: (personId: string, personName: string) => void;
  onToggleStatus: (personId: string, currentStatus: boolean) => void;
}

export function DeliveryPersonCard({ person, onEdit, onDelete, onToggleStatus }: DeliveryPersonCardProps) {
  const getVehicleIcon = (vehicle: string) => {
    const vehicleLower = vehicle.toLowerCase();
    if (vehicleLower.includes('moto')) {
      return <Bike className="h-4 w-4 text-muted-foreground" />;
    } else if (vehicleLower.includes('voiture') || vehicleLower.includes('car')) {
      return <Car className="h-4 w-4 text-muted-foreground" />;
    } else if (vehicleLower.includes('vélo') || vehicleLower.includes('velo') || vehicleLower.includes('bike')) {
      return <Bike className="h-4 w-4 text-muted-foreground" />;
    } else {
      return <Truck className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={`bg-card rounded-lg border p-4 ${person.active ? 'border-border' : 'border-red-200 opacity-60'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-green-500" />
          <h4 className="font-semibold">{person.nomComplet}</h4>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          person.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {person.active ? 'Actif' : 'Inactif'}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{person.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          {getVehicleIcon(person.vehicle)}
          <span>{person.vehicle}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onToggleStatus(person.id, person.active)}
          className={`px-3 py-1 rounded text-xs ${
            person.active
              ? 'bg-red-100 text-red-800 hover:bg-red-200'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          {person.active ? 'Désactiver' : 'Activer'}
        </button>
        <button
          onClick={() => onEdit(person)}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(person.id, person.nomComplet)}
          className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}