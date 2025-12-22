import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselNavigationProps {
  scrollPrev: () => void;
  scrollNext: () => void;
  showNavigation: boolean;
}

export function CarouselNavigation({ scrollPrev, scrollNext, showNavigation }: CarouselNavigationProps) {
  if (!showNavigation) return null;

  return (
    <>
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background/90 hover:bg-background border border-border rounded-full p-3 shadow-xl transition-all hover:scale-110 hover:shadow-2xl hover:shadow-primary/20"
        aria-label="Previous testimonials"
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background/90 hover:bg-background border border-border rounded-full p-3 shadow-xl transition-all hover:scale-110 hover:shadow-2xl hover:shadow-primary/20"
        aria-label="Next testimonials"
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </button>
    </>
  );
}