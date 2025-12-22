import React from 'react';
import { AlertCircle } from 'lucide-react';
import { OptionItem, OptionType } from '../types/OptionsModal.types';
import { getGenderedArticle } from '../utils/optionUtils';

interface OptionsModalBulkAddProps {
  optionConfig: OptionItem;
  type: OptionType;
  bulkText: string;
  onBulkTextChange: (value: string) => void;
  onBulkAdd: () => void;
}

export function OptionsModalBulkAdd({
  optionConfig,
  type,
  bulkText,
  onBulkTextChange,
  onBulkAdd
}: OptionsModalBulkAddProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-3 text-gray-700">
        Ajouter plusieurs {optionConfig.name.toLowerCase()} (un{type === 'cereales' ? 'e' : type === 'sauces' ? 'e' : ''} par ligne)
      </label>
      <textarea
        value={bulkText}
        onChange={(e) => onBulkTextChange(e.target.value)}
        placeholder={`Exemple de ${optionConfig.name.toLowerCase()}...`}
        className={`w-full p-4 border ${optionConfig.borderColor} rounded-lg h-36 focus:outline-none focus:ring-2 focus:ring-current focus:border-transparent resize-none bg-gray-50/30`}
      />
      <p className="text-xs text-muted-foreground mt-2 flex items-center space-x-1">
        <AlertCircle className="h-3 w-3" />
        <span>Les doublons seront automatiquement ignorés</span>
      </p>
    </div>
  );
}