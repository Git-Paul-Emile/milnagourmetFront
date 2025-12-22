import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationLinksProps {
  navigation: { name: string; href: string }[];
  isChristmasTheme?: boolean;
}

export function NavigationLinks({ navigation, isChristmasTheme = false }: NavigationLinksProps) {
  return (
    <div className="hidden md:flex items-center space-x-8">
      {navigation.map((item) => (
        <a
          key={item.name}
          href={`/${item.href}`}
          className={cn(
            "transition-colors font-medium",
            isChristmasTheme
              ? "text-white hover:text-[#FFD700]"
              : "text-foreground hover:text-primary"
          )}
        >
          {item.name}
        </a>
      ))}
    </div>
  );
}