import { useState } from 'react';
import { OptionType } from '../types/OptionsModal.types';
import { getDuplicateEditMessage } from '../utils/optionUtils';

interface UseItemEditingProps {
  type: OptionType;
  items: string[];
  optionName: string;
  onEdit: (oldItem: string, newItem: string) => void;
}

export function useItemEditing({ type, items, optionName, onEdit }: UseItemEditingProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (item: string) => {
    setEditingItem(item);
    setEditValue(item);
  };

  const saveEditing = () => {
    if (!editValue.trim() || editValue.trim() === editingItem) {
      setEditingItem(null);
      return;
    }

    if (items.includes(editValue.trim())) {
      alert(getDuplicateEditMessage(type, optionName));
      return;
    }

    onEdit(editingItem!, editValue.trim());
    setEditingItem(null);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const resetEditing = () => {
    setEditingItem(null);
    setEditValue('');
  };

  return {
    editingItem,
    editValue,
    setEditValue,
    startEditing,
    saveEditing,
    cancelEditing,
    resetEditing
  };
}