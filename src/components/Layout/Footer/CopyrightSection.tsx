import React from 'react';
import { cn } from '@/lib/utils';

export function CopyrightSection() {
  return (
    <div className={cn("mt-8 pt-8 text-center", "border-t border-white/20")}>
      <p className={cn("text-sm", "text-white/80")}>
        © 2025 Milna Gourmet. Tous droits réservés.
      </p>
    </div>
  );
}