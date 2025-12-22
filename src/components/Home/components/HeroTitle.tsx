import { cn } from '@/lib/utils';

interface HeroTitleProps {
  title: string;
  isChristmasTheme?: boolean;
  isNewYearTheme?: boolean;
}

export function HeroTitle({ title, isChristmasTheme = false, isNewYearTheme = false }: HeroTitleProps) {
  return (
    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up transform-gpu">
      <span className={cn(
        "drop-shadow-2xl text-stroke",
        isChristmasTheme ? "text-white" : isNewYearTheme ? "text-[#E8E8E8]" : "text-white"
      )}>
        {isChristmasTheme || isNewYearTheme ? "Bienvenue à Milina" : title}
      </span>
      <br className="hidden sm:block" />
      <span className={cn(
        "sm:ml-0 lg:ml-0 animate-pulse-soft relative drop-shadow-2xl",
        isChristmasTheme
          ? "text-[#FFD700]"
          : isNewYearTheme
          ? "text-[#FFD700] [text-shadow:0_0_30px_rgba(255,215,0,0.5)]"
          : "bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent"
      )}>
        {(isChristmasTheme || isNewYearTheme) ? "Gourmet" : "Milna Gourmet"}
        {!isChristmasTheme && !isNewYearTheme && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-yellow-100/30 to-white/30 blur-xl opacity-70 animate-pulse-soft" />
        )}
      </span>
    </h1>
  );
}