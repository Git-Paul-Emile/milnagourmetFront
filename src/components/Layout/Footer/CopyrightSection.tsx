import React from 'react';
import { cn } from '@/lib/utils';

export function CopyrightSection() {
  return (
    <div className={cn("mt-8 pt-8 text-center", "border-t border-white/20")}>
      <p className={cn("text-sm", "text-white/80")}>
        © 2025 Milna Gourmet. Tous droits réservés. Site réalisé par{' '}
        <a
          href="https://bright-selkie-bdc0a4.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white transition-colors"
        >
          PE
        </a>
      </p>
    </div>
  );
}