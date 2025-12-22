import React from 'react';
import { ShoppingCart, Package, Users } from 'lucide-react';

interface QuickActionsProps {
  setActiveTab: (tab: 'overview' | 'orders' | 'products' | 'users' | 'customers' | 'analytics' | 'delivery' | 'promotions' | 'settings') => void;
  setIsOrderManagementOpen: (open: boolean) => void;
}

export const QuickActions = ({ setActiveTab, setIsOrderManagementOpen }: QuickActionsProps) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        onClick={() => setIsOrderManagementOpen(true)}
        className="flex items-center space-x-3 p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
      >
        <ShoppingCart className="h-6 w-6 text-primary" />
        <div>
          <p className="font-medium">Gérer les commandes</p>
          <p className="text-sm text-muted-foreground">Voir et traiter les commandes</p>
        </div>
      </button>

      <button
        onClick={() => setActiveTab('products')}
        className="flex items-center space-x-3 p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
      >
        <Package className="h-6 w-6 text-primary" />
        <div>
          <p className="font-medium">Gérer les produits</p>
          <p className="text-sm text-muted-foreground">Ajouter/modifier les produits</p>
        </div>
      </button>

      <button
        onClick={() => setActiveTab('users')}
        className="flex items-center space-x-3 p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
      >
        <Users className="h-6 w-6 text-primary" />
        <div>
          <p className="font-medium">Gérer les utilisateurs</p>
          <p className="text-sm text-muted-foreground">Voir les clients inscrits</p>
        </div>
      </button>
    </div>
  </div>
);