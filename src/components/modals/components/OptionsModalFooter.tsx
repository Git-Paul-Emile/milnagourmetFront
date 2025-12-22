import React from 'react';
import { OptionType } from '../types/OptionsModal.types';
import { getAddButtonColorClass } from '../utils/optionUtils';

interface OptionsModalFooterProps {
  type: OptionType;
  optionName: string;
  bulkText: string;
  onClose: () => void;
  onBulkAdd: () => void;
}

export function OptionsModalFooter({
  type,
  optionName,
  bulkText,
  onClose,
  onBulkAdd
}: OptionsModalFooterProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
      <button
        onClick={onClose}
        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Annuler
      </button>
      <button
        onClick={onBulkAdd}
        disabled={!bulkText.trim()}
        className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md ${getAddButtonColorClass(type)}`}
      >
        Ajouter les {optionName.toLowerCase()}
      </button>
    </div>
  );
}