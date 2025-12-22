import React from 'react';
import { ProductCard } from '@/components/Product/ProductCard';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EmblaViewportRefType } from 'embla-carousel-react';

interface ProductCarouselProps {
  filteredProducts: Product[];
  emblaRef: EmblaViewportRefType;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedIndex: number;
  scrollSnaps: number[];
}

export function ProductCarousel({
  filteredProducts,
  emblaRef,
  scrollPrev,
  scrollNext,
  scrollTo,
  selectedIndex,
  scrollSnaps,
}: ProductCarouselProps) {
  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      {scrollSnaps.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background/90 hover:bg-background border border-border rounded-full p-3 shadow-xl transition-all hover:scale-110 hover:shadow-2xl hover:shadow-primary/20"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5 text-primary" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background/90 hover:bg-background border border-border rounded-full p-3 shadow-xl transition-all hover:scale-110 hover:shadow-2xl hover:shadow-primary/20"
            aria-label="Next products"
          >
            <ChevronRight className="h-5 w-5 text-primary" />
          </button>
        </>
      )}

      {/* Dots indicators */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300',
                index === selectedIndex
                  ? 'bg-primary scale-125 shadow-lg'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}