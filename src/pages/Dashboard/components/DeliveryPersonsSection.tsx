import React, { useState } from 'react';
import { Plus, User } from 'lucide-react';
import { DeliveryPerson, DeliveryZone } from '@/types/dashboard';
import { DeliveryPersonCard } from './DeliveryPersonCard';
import { DeliveryPersonModal } from '@/components/Dashboard/DeliveryPersonModal';
import { DeleteModal } from '@/components/modals/DeleteModal';

interface DeliveryPersonsSectionProps {
  persons: DeliveryPerson[];
  editingPerson: DeliveryPerson | null;
  onEditPerson: (person: DeliveryPerson | null) => void;
  onAddPerson: (personData: Partial<DeliveryPerson>) => void;
  onSavePerson: (personData: Partial<DeliveryPerson>) => void;
  onDeletePerson: (personId: string, personName: string) => void;
  onTogglePersonStatus: (personId: string, currentStatus: boolean) => void;
}

export function DeliveryPersonsSection({
  persons,
  editingPerson,
  onEditPerson,
  onAddPerson,
  onSavePerson,
  onDeletePerson,
  onTogglePersonStatus
}: DeliveryPersonsSectionProps) {
  const [addPersonModal, setAddPersonModal] = useState(false);
  const [deletingPerson, setDeletingPerson] = useState<DeliveryPerson | null>(null);

  const handleRequestDelete = (personId: string, personName: string) => {
    const person = persons.find(p => p.id === personId);
    if (person) {
      setDeletingPerson(person);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingPerson) {
      onDeletePerson(deletingPerson.id, deletingPerson.nomComplet);
      setDeletingPerson(null);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold">Livreurs</h3>
        <button
          onClick={() => setAddPersonModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2 inline" />
          Ajouter un livreur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {persons.map((person) => (
          <DeliveryPersonCard
            key={person.id}
            person={person}
            onEdit={onEditPerson}
            onDelete={handleRequestDelete}
            onToggleStatus={onTogglePersonStatus}
          />
        ))}
      </div>

      {persons.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun livreur configuré</p>
        </div>
      )}

      <DeliveryPersonModal
        isOpen={addPersonModal}
        onClose={() => setAddPersonModal(false)}
        onSave={onAddPerson}
        mode="add"
      />

      <DeliveryPersonModal
        isOpen={!!editingPerson}
        onClose={() => onEditPerson(null)}
        onSave={onSavePerson}
        mode="edit"
        editingPerson={editingPerson}
      />

      <DeleteModal
        isOpen={!!deletingPerson}
        item={deletingPerson}
        type="deliveryPerson"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingPerson(null)}
      />
    </div>
  );
}