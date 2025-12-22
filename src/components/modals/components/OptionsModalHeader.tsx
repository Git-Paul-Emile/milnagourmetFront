import React from 'react';
import { XCircle } from 'lucide-react';
import { OptionItem } from '../types/OptionsModal.types';

interface OptionsModalHeaderProps {
  optionConfig: OptionItem;
  onClose: () => void;
}

export function OptionsModalHeader({ optionConfig, onClose }: OptionsModalHeaderProps) {
  const Icon = optionConfig.icon;

  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
      <h3 className={`text-xl font-bold ${optionConfig.color} flex items-center space-x-3`}>
        <div className={`p-2 ${optionConfig.bgColor} rounded-full`}>
          <Icon className="h-6 w-6" />
        </div>
        <span>Gestion des {optionConfig.name.toLowerCase()}</span>
      </h3>
      <button
        onClick={onClose}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-full transition-colors"
      >
        <XCircle className="h-5 w-5" />
      </button>
    </div>
  );
}