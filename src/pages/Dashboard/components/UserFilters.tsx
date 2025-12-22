import React from 'react';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'active' | 'blocked';
  setStatusFilter: (filter: 'all' | 'active' | 'blocked') => void;
  sortBy: 'name' | 'email' | 'orders' | 'date';
  setSortBy: (sort: 'name' | 'email' | 'orders' | 'date') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  resetFilters: () => void;
}

export function UserFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  resetFilters,
}: UserFiltersProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche */}
        <div>
          <label className="block text-sm font-medium mb-1">Rechercher</label>
          <input
            type="text"
            placeholder="Nom ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'blocked')}
            className="w-full p-2 border border-border rounded-lg"
          >
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="blocked">Bloqués</option>
          </select>
        </div>

        {/* Tri */}
        <div>
          <label className="block text-sm font-medium mb-1">Trier par</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'email' | 'orders' | 'date')}
            className="w-full p-2 border border-border rounded-lg"
          >
            {/* Tri uniquement par date et nombre de commandes */}
            <option value="orders">Commandes</option>
            <option value="date">Date d'inscription</option>
          </select>
        </div>

        {/* Ordre de tri */}
        <div>
          <label className="block text-sm font-medium mb-1">Ordre</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="w-full p-2 border border-border rounded-lg"
          >
            <option value="asc">Croissant</option>
            <option value="desc">Décroissant</option>
          </select>
        </div>
      </div>

      {/* Bouton réinitialiser */}
      <div className="flex sm:justify-start md:justify-end mt-4">
        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
}