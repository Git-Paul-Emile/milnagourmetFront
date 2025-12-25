import React from 'react';
import { OrderFiltersState, OrderFiltersActions, StatusFilter, DateFilter, SortBy, SortOrder } from './useOrderFilters';

interface OrderFiltersProps {
  state: OrderFiltersState;
  actions: OrderFiltersActions;
  filteredOrdersCount?: number;
}

export function OrderFilters({ state, actions, filteredOrdersCount }: OrderFiltersProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Recherche */}
        <div>
          <label className="block text-sm font-medium mb-1">Rechercher</label>
          <input
            type="text"
            placeholder="Nom client ou produit..."
            value={state.searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select
            value={state.statusFilter}
            onChange={(e) => actions.setStatusFilter(e.target.value as StatusFilter)}
            className="w-full p-2 border border-border rounded-lg"
          >
            <option value="all">Tous</option>
            <option value="recu">Reçues</option>
            <option value="livree">Livrées</option>
            <option value="annulee">Annulées</option>
          </select>
        </div>

        {/* Période */}
        <div>
          <label className="block text-sm font-medium mb-1">Période</label>
          <select
            value={state.dateFilter}
            onChange={(e) => actions.setDateFilter(e.target.value as DateFilter)}
            className="w-full p-2 border border-border rounded-lg"
          >
            <option value="all">Toutes</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>

        {/* Tri */}
        <div>
          <label className="block text-sm font-medium mb-1">Trier par</label>
          <select
            value={state.sortBy}
            onChange={(e) => actions.setSortBy(e.target.value as SortBy)}
            className="w-full p-2 border border-border rounded-lg"
          >
            <option value="date">Date</option>
            <option value="total">Montant</option>
          </select>
        </div>

        {/* Ordre de tri */}
        <div>
          <label className="block text-sm font-medium mb-1">Ordre</label>
          <select
            value={state.sortOrder}
            onChange={(e) => actions.setSortOrder(e.target.value as SortOrder)}
            className="w-full p-2 border border-border rounded-lg"
          >
            <option value="desc">Récent</option>
            <option value="asc">Ancien</option>
          </select>
        </div>
      </div>

      {/* Bouton réinitialiser */}
      <div className="flex justify-center mt-4">
        <button
          onClick={actions.resetFilters}
          className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
}