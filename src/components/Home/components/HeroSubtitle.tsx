interface HeroSubtitleProps {
  subtitle: string;
  isChristmasTheme?: boolean;
  isNewYearTheme?: boolean;
}

export function HeroSubtitle({ subtitle, isChristmasTheme = false, isNewYearTheme = false }: HeroSubtitleProps) {
  return (
    <p className={`text-base sm:text-lg md:text-xl mb-8 max-w-2xl animate-fade-in-up transform-gpu drop-shadow-xl mx-auto lg:mx-0 font-medium ${
      isNewYearTheme ? "text-[#C0C0C0]" : "text-white/90"
    }`}>
      {subtitle}
    </p>
  );
}