import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '@/lib/utils';
import { ShareOption } from './constants';

interface ShareOptionsProps {
  options: ShareOption[];
  onShare: (action: () => void) => void;
  onClose: () => void;
}

export function ShareOptions({ options, onShare, onClose }: ShareOptionsProps) {
  const handleShare = (option: ShareOption) => {
    try {
      onShare(option.action);
      setTimeout(() => onClose(), 150);
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      onClose();
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-center mb-4">Choisissez une plateforme</h3>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.name}
            onClick={() => handleShare(option)}
            className={cn(
              'flex flex-col items-center justify-center p-4 rounded-lg text-white font-medium transition-all transform-gpu hover:scale-105 active:scale-95',
              option.color
            )}
          >
            <FontAwesomeIcon icon={option.icon} className="h-6 w-6 mb-2" />
            <span className="text-sm">{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}