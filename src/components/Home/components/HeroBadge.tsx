import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroBadgeProps {
  badge: string;
  isChristmasTheme?: boolean;
  isNewYearTheme?: boolean;
}

export function HeroBadge({ badge, isChristmasTheme = false, isNewYearTheme = false }: HeroBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 animate-fade-in-up mx-auto lg:mx-0",
      isChristmasTheme
        ? "bg-[#FFD700] text-[#8B0000]"
        : isNewYearTheme
        ? "bg-[#FFD700] text-[#0A0A0A] border-2 border-[#C0C0C0] animate-pulse shadow-[0_0_20px_rgba(255,215,0,0.6)]"
        : "bg-primary/10 text-primary"
    )}>
      <Star className="h-4 w-4 fill-current" />
      <span className="text-sm font-medium">{badge}</span>
    </div>
  );
}