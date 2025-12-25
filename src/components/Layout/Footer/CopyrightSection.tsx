import React from 'react';
import { cn } from '@/lib/utils';

interface CopyrightSectionProps {
  isChristmasTheme?: boolean;
}

export function CopyrightSection({ isChristmasTheme = false }: CopyrightSectionProps) {
  return (
    <div className={cn("mt-8 pt-8 text-center", "border-t border-border")}>
      <p className={cn("text-sm", "text-muted-foreground")}>
        © 2025 Milna Gourmet. Tous droits réservés.
      </p>
    </div>
  );
}