import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationLinksProps {
  navigation: { name: string; href: string }[];
}

export function NavigationLinks({ navigation }: NavigationLinksProps) {
  return (
    <div className="hidden md:flex items-center space-x-8">
      {navigation.map((item) => (
        <a
          key={item.name}
          href={`/${item.href}`}
          className={cn(
            "transition-colors font-medium",
            /* Liens du menu en #212121 ; le survol garde une indication
               visuelle en passant en semi-opaque. */
            "text-[#212121] hover:text-[#212121]/70"
          )}
        >
          {item.name}
        </a>
      ))}
    </div>
  );
}