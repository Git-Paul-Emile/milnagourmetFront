import React from 'react';

interface OrderFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'recu' | 'livree' | 'annulee';
  setStatusFilter: (filter: 'all' | 'recu' | 'livree' | 'annulee') => void;
  dateFilter: 'all' | 'today' | 'week' | 'month';
  setDateFilter: (filter: 'all' | 'today' | 'week' | 'month') => void;
}

export function OrderFilters({
  showFilters,
  setShowFilters,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter
}: OrderFiltersProps) {
  if (!showFilters) return null;

  return (
    <div className="bg-muted/50 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rechercher</label>
          <input
            type="text"
            placeholder="Nom client, produit, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'recu' | 'livree' | 'annulee')}
            className="w-full p-2 border border-border rounded-lg"
          >
            <option value="all">Tous</option>
            <option value="recu">Reçues</option>
            <option value="livree">Livrées</option>
            <option value="annulee">Annulées</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Période</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
            className="w-full p-2 border border-border rounded-lg"
          >
            <option value="all">Toutes</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setDateFilter('all');
          }}
          className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}