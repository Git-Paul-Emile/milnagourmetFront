import React from 'react';
import { Menu } from 'lucide-react';
import { getTimeBasedGreeting } from '@/utils/greeting';

interface DashboardHeaderProps {
  onToggleMobileSidebar: () => void;
}

export function DashboardHeader({ onToggleMobileSidebar }: DashboardHeaderProps) {
  const greeting = getTimeBasedGreeting();

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 hover:bg-muted rounded"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-md md:text-2xl font-bold">{greeting} - Milna Gourmet Dashboard</h1>
          </div>
        </div>
      </div>
    </header>
  );
}