import React, { useState } from 'react';
import { Edit, Trash2, Apple, Cookie, Wheat, Plus } from 'lucide-react';
import { CreationSize, CreationOptions } from '@/types';
import { Modal } from '@/components/Modal';

interface CreationOptionsManagementProps {
  creationSizes: CreationSize[];
  creationOptions: CreationOptions;
  onAddSize: () => void;
  onEditSize: (size: CreationSize) => void;
  onDeleteSize: (sizeName: string) => void;
  onFruitsModal: () => void;
  onSaucesModal: () => void;
  onCerealesModal: () => void;
}

export function CreationOptionsManagement({
  creationSizes,
  creationOptions,
  onAddSize,
  onEditSize,
  onDeleteSize,
  onFruitsModal,
  onSaucesModal,
  onCerealesModal
}: CreationOptionsManagementProps) {
  const [sizePendingDelete, setSizePendingDelete] = useState<CreationSize | null>(null);

  const openDeleteModal = (size: CreationSize) => {
    setSizePendingDelete(size);
  };

  const closeDeleteModal = () => setSizePendingDelete(null);

  const confirmDelete = () => {
    if (!sizePendingDelete) return;
    onDeleteSize(sizePendingDelete.nom);
    setSizePendingDelete(null);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">Options de création personnalisée</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tailles */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h4 className="font-medium">Tailles disponibles</h4>
            <button
              onClick={onAddSize}
              className="w-full sm:w-auto bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center justify-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter une taille</span>
            </button>
          </div>
          <div className="space-y-2">
            {creationSizes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune taille définie. Ajoutez-en une pour commencer.
              </p>
            ) : (
              creationSizes.map((size) => (
                <div key={size.nom} className="flex justify-between items-center p-2 border border-border rounded">
                  <div>
                    <span className="font-medium capitalize">{size.nom}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {size.prix} FCFA - {size.maxFruits} fruit{size.maxFruits > 1 ? 's' : ''}, {size.maxSauces} sauce{size.maxSauces > 1 ? 's' : ''}, {size.cerealesAutorise ? 'avec' : 'sans'} céréales
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onEditSize(size)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(size)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ingrédients */}
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-3 items-center sm:items-start">
            <h4 className="font-medium">Ingrédients disponibles</h4>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 items-center sm:items-start">
              <button
                onClick={onFruitsModal}
                className="w-full sm:w-auto bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center justify-center space-x-1"
              >
                <Apple className="h-4 w-4" />
                <span>Fruits ({creationOptions.fruits.length})</span>
              </button>
              <button
                onClick={onSaucesModal}
                className="w-full sm:w-auto bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-1"
              >
                <Cookie className="h-4 w-4" />
                <span>Sauces ({creationOptions.sauces.length})</span>
              </button>
              <button
                onClick={onCerealesModal}
                className="w-full sm:w-auto bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600 transition-colors text-sm flex items-center justify-center space-x-1"
              >
                <Wheat className="h-4 w-4" />
                <span>Céréales ({creationOptions.cereales.length})</span>
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {/* Fruits */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 border border-border rounded">
              <div className="flex items-center space-x-3">
                <Apple className="h-5 w-5 text-orange-500" />
                <div>
                  <span className="font-medium">Fruits</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {creationOptions.fruits.length} disponible{creationOptions.fruits.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1 self-end sm:self-auto">
                <button
                  onClick={onFruitsModal}
                  className="p-1 text-muted-foreground hover:text-foreground"
                  title="Gérer les fruits"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sauces */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 border border-border rounded">
              <div className="flex items-center space-x-3">
                <Cookie className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-medium">Sauces</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {creationOptions.sauces.length} disponible{creationOptions.sauces.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1 self-end sm:self-auto">
                <button
                  onClick={onSaucesModal}
                  className="p-1 text-muted-foreground hover:text-foreground"
                  title="Gérer les sauces"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Céréales */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 border border-border rounded">
              <div className="flex items-center space-x-3">
                <Wheat className="h-5 w-5 text-purple-500" />
                <div>
                  <span className="font-medium">Céréales</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {creationOptions.cereales.length} disponible{creationOptions.cereales.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1 self-end sm:self-auto">
                <button
                  onClick={onCerealesModal}
                  className="p-1 text-muted-foreground hover:text-foreground"
                  title="Gérer les céréales"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={!!sizePendingDelete} onClose={closeDeleteModal}>
        <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
          <p className="text-muted-foreground mb-6">
            Êtes-vous sûr de vouloir supprimer la taille "{sizePendingDelete?.nom}" ? Cette action est irréversible.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}