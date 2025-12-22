import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { OptionItem } from '../types/OptionsModal.types';

interface OptionsModalItemCardProps {
  item: string;
  optionConfig: OptionItem;
  isEditing: boolean;
  editValue: string;
  onEditValueChange: (value: string) => void;
  onStartEditing: () => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onRemove: () => void;
}

export function OptionsModalItemCard({
  item,
  optionConfig,
  isEditing,
  editValue,
  onEditValueChange,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onRemove
}: OptionsModalItemCardProps) {
  const Icon = optionConfig.icon;

  if (isEditing) {
    return (
      <div className={`bg-gradient-to-r from-gray-50 to-gray-100/50 border ${optionConfig.borderColor} rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            className={`w-full flex-1 min-w-0 text-sm px-3 py-2 border ${optionConfig.borderColor.replace('border-', 'border-').replace('200', '300')} rounded-md focus:outline-none focus:ring-2 focus:ring-current focus:border-transparent`}
            onKeyPress={(e) => {
              if (e.key === 'Enter') onSaveEditing();
              if (e.key === 'Escape') onCancelEditing();
            }}
            autoFocus
          />
          <div className="flex justify-end sm:justify-start gap-2">
            <button
              onClick={onSaveEditing}
              className="text-green-600 hover:text-green-800 p-2 rounded-md hover:bg-green-100 transition-colors shrink-0"
              title="Sauvegarder"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
            <button
              onClick={onCancelEditing}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100 transition-colors shrink-0"
              title="Annuler"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-gray-50 to-gray-100/50 border ${optionConfig.borderColor} rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Icon className={`h-4 w-4 ${optionConfig.buttonColor.split(' ')[0]}`} />
          <span className="font-medium text-sm">{item}</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={onStartEditing}
            className={`${optionConfig.buttonColor} p-2 rounded-md transition-colors ${optionConfig.buttonHoverColor}`}
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 p-2 rounded-md transition-colors hover:bg-red-100"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}