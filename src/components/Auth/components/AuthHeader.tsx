import React from 'react';
import { X } from 'lucide-react';
import { AuthMode } from '../types/authTypes';

interface AuthHeaderProps {
  mode: AuthMode;
  globalError: string;
  onClose: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ mode, globalError, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border">
      <div>
        <h2 className="text-2xl font-bold">
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </h2>
        <p className="text-muted-foreground">
          {mode === 'login'
            ? 'Connectez-vous à votre compte'
            : 'Créez votre compte Milna Gourmet'
          }
        </p>
        {globalError && <p className="text-red-500 text-sm mt-2">{globalError}</p>}
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-muted rounded-full transition-colors"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
};