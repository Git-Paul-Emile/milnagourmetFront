import React, { useState } from 'react';
import { OptionsModalProps } from './types/OptionsModal.types';
import { optionTypes } from './config/optionTypes';
import { useBulkAdd } from './hooks/useBulkAdd';
import { useItemEditing } from './hooks/useItemEditing';
import { Modal } from '@/components/Modal';
import {
  OptionsModalHeader,
  OptionsModalBulkAdd,
  OptionsModalItemList,
  OptionsModalFooter
} from './components';

export function OptionsModal({
  isOpen,
  type,
  items,
  onClose,
  onAddBulk,
  onRemove,
  onEdit
}: OptionsModalProps) {
  const [itemPendingDelete, setItemPendingDelete] = useState<string | null>(null);
  const optionConfig = optionTypes[type];

  const {
    bulkText,
    setBulkText,
    handleBulkAdd,
    resetBulkText
  } = useBulkAdd({
    type,
    items,
    optionName: optionConfig.name,
    onAddBulk
  });

  const {
    editingItem,
    editValue,
    setEditValue,
    startEditing,
    saveEditing,
    cancelEditing,
    resetEditing
  } = useItemEditing({
    type,
    items,
    optionName: optionConfig.name,
    onEdit
  });

  const handleClose = () => {
    resetBulkText();
    resetEditing();
    onClose();
  };

  const openDeleteModal = (item: string) => setItemPendingDelete(item);
  const closeDeleteModal = () => setItemPendingDelete(null);

  const confirmDelete = () => {
    if (!itemPendingDelete) return;
    onRemove(itemPendingDelete);
    setItemPendingDelete(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-gray-100 p-8">
        <OptionsModalHeader
          optionConfig={optionConfig}
          onClose={handleClose}
        />

        <div className="space-y-4">
          <OptionsModalBulkAdd
            optionConfig={optionConfig}
            type={type}
            bulkText={bulkText}
            onBulkTextChange={setBulkText}
            onBulkAdd={handleBulkAdd}
          />

          <OptionsModalItemList
            optionConfig={optionConfig}
            type={type}
            items={items}
            editingItem={editingItem}
            editValue={editValue}
            onEditValueChange={setEditValue}
            onStartEditing={startEditing}
            onSaveEditing={saveEditing}
            onCancelEditing={cancelEditing}
          onRemove={openDeleteModal}
          />
        </div>

        <OptionsModalFooter
          type={type}
          optionName={optionConfig.name}
          bulkText={bulkText}
          onClose={handleClose}
          onBulkAdd={handleBulkAdd}
        />
      <Modal isOpen={!!itemPendingDelete} onClose={closeDeleteModal}>
        <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
          <p className="text-muted-foreground mb-6">
            Êtes-vous sûr de vouloir supprimer "{itemPendingDelete}" ? Cette action est irréversible.
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              onClick={closeDeleteModal}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={confirmDelete}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
}