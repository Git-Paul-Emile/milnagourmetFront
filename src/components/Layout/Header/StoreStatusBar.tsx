import React from 'react';
import { useStoreHours } from '@/hooks/useStoreHours';
import { cn } from '@/lib/utils';

interface StoreStatusBarProps {
  isChristmasTheme?: boolean;
}

export function StoreStatusBar({ isChristmasTheme = false }: StoreStatusBarProps) {
  const storeStatus = useStoreHours();

  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-50 text-center py-2 text-sm font-medium transition-colors',
      isChristmasTheme
        ? 'bg-[#722F37] text-white'
        : storeStatus.isOpen
        ? 'bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground'
        : 'bg-gradient-to-r from-muted via-muted/90 to-muted text-muted-foreground'
    )}>
      <span className="mr-2">
        {storeStatus.isOpen ? <i className="fa-solid fa-shop text-green-500"></i> : <i className="fa-solid fa-shop text-red-500"></i>}
      </span>
      {storeStatus.message}
      {storeStatus.nextChange && (
        <span className="ml-2 text-xs opacity-80">
          • {storeStatus.nextChange}
        </span>
      )}
    </div>
  );
}