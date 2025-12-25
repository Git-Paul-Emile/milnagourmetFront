import React from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  isChristmasTheme?: boolean;
}

export function MobileMenuToggle({ isOpen, onToggle, isChristmasTheme = false }: MobileMenuToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "md:hidden p-2 transition-colors",
        ""
      )}
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );
}