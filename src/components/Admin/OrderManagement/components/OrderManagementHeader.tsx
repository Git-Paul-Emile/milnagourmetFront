import React from 'react';
import { XCircle, Download, Filter } from 'lucide-react';

interface OrderManagementHeaderProps {
  onToggleFilters: () => void;
  showFilters: boolean;
  onExport: () => void;
  onClose: () => void;
}

export function OrderManagementHeader({
  onToggleFilters,
  showFilters,
  onExport,
  onClose,
}: OrderManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-border space-y-4 sm:space-y-0">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Gestion des Commandes</h2>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onToggleFilters}
          className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden md:inline">Filtres</span>
        </button>
        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Exporter</span>
        </button>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </div>
  );
}