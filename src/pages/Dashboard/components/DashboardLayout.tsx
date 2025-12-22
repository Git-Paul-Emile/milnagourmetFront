import React from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
  activeTab: 'overview' | 'orders' | 'products' | 'users' | 'customers' | 'analytics' | 'delivery' | 'promotions' | 'settings';
  setActiveTab: (tab: 'overview' | 'orders' | 'products' | 'users' | 'customers' | 'analytics' | 'delivery' | 'promotions' | 'settings') => void;
  stats: {
    pendingOrders: number;
  };
  onLogout: () => void;
  children: React.ReactNode;
}

export function DashboardLayout({ activeTab, setActiveTab, stats, onLogout, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onLogout={onLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />

          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}