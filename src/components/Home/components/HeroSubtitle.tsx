interface HeroSubtitleProps {
  subtitle: string;
}

export function HeroSubtitle({ subtitle }: HeroSubtitleProps) {
  return (
    <p className={`text-base sm:text-lg md:text-xl mb-8 max-w-2xl animate-fade-in-up transform-gpu drop-shadow-xl mx-auto lg:mx-0 font-medium ${
      "text-white/90"}`}>
      {subtitle}
    </p>
  );
}