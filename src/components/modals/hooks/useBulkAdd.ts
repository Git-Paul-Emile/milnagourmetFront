import { useState } from 'react';
import { OptionType } from '../types/OptionsModal.types';
import { processBulkText, getBulkAddMessage } from '../utils/optionUtils';

interface UseBulkAddProps {
  type: OptionType;
  items: string[];
  optionName: string;
  onAddBulk: (newItems: string[]) => void;
}

export function useBulkAdd({ type, items, optionName, onAddBulk }: UseBulkAddProps) {
  const [bulkText, setBulkText] = useState('');

  const handleBulkAdd = () => {
    if (!bulkText.trim()) return;

    const newItems = processBulkText(bulkText, items);

    if (newItems.length === 0) {
      alert(getBulkAddMessage(type, optionName, newItems.length));
      return;
    }

    onAddBulk(newItems);
    setBulkText('');
  };

  const resetBulkText = () => {
    setBulkText('');
  };

  return {
    bulkText,
    setBulkText,
    handleBulkAdd,
    resetBulkText
  };
}