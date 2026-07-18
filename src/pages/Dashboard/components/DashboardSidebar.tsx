import React from 'react';
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Settings,
  MapPin,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  activeTab: 'overview' | 'orders' | 'products' | 'users' | 'customers' | 'analytics' | 'delivery' | 'promotions' | 'settings';
  setActiveTab: (tab: 'overview' | 'orders' | 'products' | 'users' | 'customers' | 'analytics' | 'delivery' | 'promotions' | 'settings') => void;
  stats: {
    pendingOrders: number;
  };
}

export function DashboardSidebar({ activeTab, setActiveTab, stats }: DashboardSidebarProps) {
  return (
    <div className="lg:w-64">
      <div className="bg-card rounded-lg border border-border p-4">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              activeTab === 'overview'
                ? 'bg-button border border-button-border hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground'
                : 'hover:bg-muted'
            )}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Vue d'ensemble</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              activeTab === 'orders'
                ? 'bg-button border border-button-border hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground'
                : 'hover:bg-muted'
            )}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Commandes</span>
            {stats.pendingOrders > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">
                {stats.pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              activeTab === 'products'
                ? 'bg-button border border-button-border hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground'
                : 'hover:bg-muted'
            )}
          >
            <Package className="h-5 w-5" />
            <span>Produits</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              activeTab === 'users'
                ? 'bg-button border border-button-border hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground'
                : 'hover:bg-muted'
            )}
          >
            <Users className="h-5 w-5" />
            <span>Utilisateurs</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              activeTab === 'customers'
                ? 'bg-button border border-button-border hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground'
                : 'hover:bg-muted'
            )}
          >
            <Users className="h-5 w-5" />
            <span>Clients</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              activeTab === 'analytics'
                ? 'bg-button border border-button-border hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground'
                : 'hover:bg-muted'
            )}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Statistiques</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              activeTab === 'delivery'
                ? 'bg-button border border-button-border hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground'
                : 'hover:bg-muted'
            )}
          >
            <MapPin className="h-5 w-5" />
            <span>Livraison</span>
          </button>

          <button
            onClick={() => setActiveTab('promotions')}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              activeTab === 'promotions'
                ? 'bg-button border border-button-border hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground'
                : 'hover:bg-muted'
            )}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Promotions</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              activeTab === 'settings'
                ? 'bg-button border border-button-border hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border text-button-foreground'
                : 'hover:bg-muted'
            )}
          >
            <Settings className="h-5 w-5" />
            <span>Paramètres</span>
          </button>
        </nav>
      </div>
    </div>
  );
}