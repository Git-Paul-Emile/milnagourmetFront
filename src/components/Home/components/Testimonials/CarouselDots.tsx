import { cn } from '@/lib/utils';

interface CarouselDotsProps {
  scrollSnaps: number[];
  selectedIndex: number;
  scrollTo: (index: number) => void;
  showDots: boolean;
}

export function CarouselDots({ scrollSnaps, selectedIndex, scrollTo, showDots }: CarouselDotsProps) {
  if (!showDots) return null;

  return (
    <div className="flex justify-center space-x-2 mt-8">
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-300',
            index === selectedIndex
              ? 'bg-button border border-button-border hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border scale-125 shadow-lg'
              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}