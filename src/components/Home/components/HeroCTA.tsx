import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroCTAProps {
  onCatalogClick: () => void;
}

export function HeroCTA({ onCatalogClick }: HeroCTAProps) {
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
          'bg-[#43A2F2] border border-[#43A2F2] hover:bg-[#4bb069] hover:border-[#4bb069] text-white before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-button/20 before:to-button/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 hover:shadow-2xl hover:-translate-y-1')}
      >
        <span className="relative z-10">Découvrir le Catalogue</span>
        <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
        <div className={cn(
          "absolute inset-0 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          "bg-gradient-to-r from-primary/30 to-primary-light/30")} />
      </button>
    </div>
  );
}