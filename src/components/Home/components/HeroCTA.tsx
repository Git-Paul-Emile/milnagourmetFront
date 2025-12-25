import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroCTAProps {
  onCatalogClick: () => void;
  isChristmasTheme?: boolean;
  isNewYearTheme?: boolean;
}

export function HeroCTA({ onCatalogClick, isChristmasTheme = false, isNewYearTheme = false }: HeroCTAProps) {
  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up justify-center lg:justify-start max-w-full">
      <button
        onClick={onCatalogClick}
        className={cn(
          'group relative inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-4 rounded-lg font-semibold text-base sm:text-lg w-full sm:w-auto',
          'transform-gpu',
          'hover:scale-105',
          'transition-all duration-500 ease-out',
          'animate-pulse-soft',
          isNewYearTheme
            ? 'bg-gradient-to-r from-[#FFD700] to-[#F7E7CE] border-2 border-[#FFD700] text-[#0A0A0A] hover:bg-[#6A0DAD] hover:shadow-[0_6px_30px_rgba(106,13,173,0.5)] shadow-[0_4px_20px_rgba(255,215,0,0.4)]'
            : 'bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 text-primary-foreground hover:shadow-primary/25 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-primary/20 before:to-secondary/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 hover:shadow-2xl hover:-translate-y-1'
        )}
      >
        <span className="relative z-10">Découvrir le Catalogue</span>
        <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
        <div className={cn(
          "absolute inset-0 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          isNewYearTheme
            ? "bg-[#FFD700]/30"
            : "bg-gradient-to-r from-primary/30 to-secondary/30"
        )} />
      </button>
    </div>
  );
}