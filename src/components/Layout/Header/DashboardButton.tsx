import React from 'react';
import { Settings } from 'lucide-react';

export function DashboardButton() {
  return (
    <button
      onClick={() => window.open('/dashboard', '_blank')}
      className="p-2 text-foreground hover:text-primary transition-colors"
      title="Tableau de bord"
    >
      <Settings className="h-6 w-6" />
    </button>
  );
}