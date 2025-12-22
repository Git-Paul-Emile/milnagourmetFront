import React from 'react';
import { AuthContext } from '../contexts/AuthContextCore';
import { AuthContextType } from '@/types';

// Hook personnalisé pour accéder au contexte
export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
