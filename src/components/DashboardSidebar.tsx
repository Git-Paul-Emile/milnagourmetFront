import React from 'react';
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  MapPin,
  Settings,
  MessageSquare,
  LogOut,
  X,
  Image,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBranding } from '@/hooks/useBranding';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingOrdersCount: number;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
  onLogout: () => void;
}

export function DashboardSidebar({ activeTab, onTabChange, pendingOrdersCount, isMobileOpen, onToggleMobile, onLogout }: DashboardSidebarProps) {
  const { branding } = useBranding();

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'testimonials', label: 'Témoignages', icon: MessageSquare },
    { id: 'gallery', label: 'Galerie', icon: Image },
    { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
    { id: 'delivery', label: 'Livraison', icon: MapPin },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onToggleMobile}></div>
          <div className="absolute left-0 top-0 h-screen w-64 bg-card border-r border-border p-4 overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button onClick={onToggleMobile} className="p-1 hover:bg-muted rounded">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <img src={branding.logo} alt="Milna Gourmet" className="h-[95px]" />
            </div>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { onTabChange(tab.id); onToggleMobile(); }}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {tab.badge && tab.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-border mt-4 pt-4">
              <button
                onClick={() => { onLogout(); onToggleMobile(); }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-muted"
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4 overflow-y-auto">
        <div className="flex justify-center mb-4">
          <img src={branding.logo} alt="Milna Gourmet" className="h-[95px]" />
        </div>
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border mt-4 pt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-muted"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}