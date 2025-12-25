import React from 'react';
import { Link } from 'react-router-dom';
import { useBranding } from '@/hooks/useBranding';
import { cn } from '@/lib/utils';

interface LogoProps {
  isChristmasTheme?: boolean;
}

export function Logo({ isChristmasTheme = false }: LogoProps) {
  const { branding } = useBranding();

  return (
    <Link to="/" className="flex items-center space-x-3">
      {branding.logo && (
        <img
          src={branding.logo}
          alt="Milna Gourmet"
          className="h-12 w-12 animate-pulse-soft"
        />
      )}
      <div className='md:hidden lg:block'>
        <h1 className={cn(
          "text-xl font-bold",
          "text-primary"
        )}>Milna Gourmet</h1>
        <p className={cn(
          "text-xs",
          "text-muted-foreground"
        )}>Le Salon du Yaourt</p>
      </div>
    </Link>
  );
}