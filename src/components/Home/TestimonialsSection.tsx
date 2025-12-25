import React, { useState } from 'react';
import { useTestimonials } from './hooks/useTestimonials';
import { useTestimonialCarousel } from './hooks/useTestimonialCarousel';
import {
  TestimonialsHeader,
  TestimonialCard,
  CarouselNavigation,
  CarouselDots,
  AddTestimonialButton,
} from './components/Testimonials';
import { AddTestimonialModal } from './AddTestimonialModal';
import { useApp } from '@/contexts/useApp';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export function TestimonialsSection() {
  const { testimonials, loading, reloadTestimonials } = useTestimonials();
  const { emblaRef, scrollPrev, scrollNext, scrollTo, selectedIndex, scrollSnaps } = useTestimonialCarousel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state } = useApp();
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';

  if (loading) {
    return (
      <section id="testimonials" className={cn("py-20", "bg-muted/30")}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des témoignages...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="testimonials" className={cn("py-20", "bg-muted/30")}>
        <div className="container mx-auto px-4">
          <TestimonialsHeader isChristmasTheme={isChristmasTheme} />

          {/* Carousel de témoignages */}
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6 justify-center">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} isChristmasTheme={isChristmasTheme} />
                ))}
              </div>
            </div>

            <CarouselNavigation
              scrollPrev={scrollPrev}
              scrollNext={scrollNext}
              showNavigation={scrollSnaps.length > 1}
            />

            <CarouselDots
              scrollSnaps={scrollSnaps}
              selectedIndex={selectedIndex}
              scrollTo={scrollTo}
              showDots={scrollSnaps.length > 1}
            />
          </div>

          {state.user && <AddTestimonialButton onClick={() => setIsModalOpen(true)} />}
        </div>
      </section>

      {/* Add Testimonial Modal */}
      <AddTestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={reloadTestimonials}
      />
    </>
  );
}