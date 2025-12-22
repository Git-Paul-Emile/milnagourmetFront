import React from 'react';
import { OptionItem, OptionType } from '../types/OptionsModal.types';
import { OptionsModalItemCard } from './OptionsModalItemCard';
import { getPluralSuffix } from '../utils/optionUtils';

interface OptionsModalItemListProps {
  optionConfig: OptionItem;
  type: OptionType;
  items: string[];
  editingItem: string | null;
  editValue: string;
  onEditValueChange: (value: string) => void;
  onStartEditing: (item: string) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onRemove: (item: string) => void;
}

export function OptionsModalItemList({
  optionConfig,
  type,
  items,
  editingItem,
  editValue,
  onEditValueChange,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onRemove
}: OptionsModalItemListProps) {
  return (
    <div>
      <h4 className="font-medium mb-3 text-sm text-muted-foreground">
        {optionConfig.name} existant{getPluralSuffix(type)} ({items.length})
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <OptionsModalItemCard
            key={item}
            item={item}
            optionConfig={optionConfig}
            isEditing={editingItem === item}
            editValue={editValue}
            onEditValueChange={onEditValueChange}
            onStartEditing={() => onStartEditing(item)}
            onSaveEditing={onSaveEditing}
            onCancelEditing={onCancelEditing}
            onRemove={() => onRemove(item)}
          />
        ))}
      </div>
    </div>
  );
}