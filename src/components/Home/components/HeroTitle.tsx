import { cn } from '@/lib/utils';

interface HeroTitleProps {
  title: string;
}

export function HeroTitle({ title }: HeroTitleProps) {
  return (
    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up transform-gpu">
      <span className={cn(
        "drop-shadow-2xl text-stroke",
        "text-white")}>
        {title}
      </span>
      
    </h1>
  );
}