import React, { useEffect, useState } from 'react';
import { useTestimonials } from './hooks/useTestimonials';
import { useTestimonialCarousel } from './hooks/useTestimonialCarousel';
import {
  TestimonialsHeader,
  TestimonialCard,
  CarouselNavigation,
  AddTestimonialButton,
} from './components/Testimonials';
import { AddTestimonialModal } from './AddTestimonialModal';
import { useApp } from '@/contexts/useApp';
import { useShellUi } from '@/contexts/useShellUi';
import { cn } from '@/lib/utils';

export function TestimonialsSection() {
  const { testimonials, loading, reloadTestimonials } = useTestimonials();
  const { emblaRef, scrollPrev, scrollNext, scrollSnaps } = useTestimonialCarousel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state } = useApp();
  const { ouvrirAuth, authOuverte } = useShellUi();

  /**
   * Intention mémorisée : « je voulais témoigner, on m'a demandé de me
   * connecter ».
   *
   * Sans elle, l'utilisateur se connecte puis se retrouve exactement là
   * où il était, sans rien de plus — il doit rechercher le bouton et
   * recliquer. C'est le moment où l'on perd le plus de contributions.
   */
  const [temoignageEnAttente, setTemoignageEnAttente] = useState(false);

  const handleAjouterTemoignage = () => {
    if (state.user) {
      setIsModalOpen(true);
      return;
    }
    // Visiteur non connecté : on affiche le formulaire de connexion et on
    // retient son intention pour enchaîner juste après.
    setTemoignageEnAttente(true);
    ouvrirAuth('login');
  };

  /* La connexion a abouti alors qu'un témoignage était en attente : on
     enchaîne sur le formulaire. On attend que la modale de connexion
     soit refermée (`!authOuverte`), sinon les deux fenêtres se
     superposeraient l'espace d'un rendu. */
  useEffect(() => {
    if (temoignageEnAttente && state.user && !authOuverte) {
      setTemoignageEnAttente(false);
      setIsModalOpen(true);
    }
  }, [temoignageEnAttente, state.user, authOuverte]);

  // La modale de connexion a été fermée sans connexion : on oublie
  // l'intention, sinon le formulaire de témoignage surgirait plus tard,
  // sans rapport avec l'action en cours.
  useEffect(() => {
    if (temoignageEnAttente && !authOuverte && !state.user) {
      setTemoignageEnAttente(false);
    }
  }, [temoignageEnAttente, authOuverte, state.user]);

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
          <TestimonialsHeader />

          {/* Carousel de témoignages */}
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6 justify-center">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                ))}
              </div>
            </div>

            <CarouselNavigation
              scrollPrev={scrollPrev}
              scrollNext={scrollNext}
              showNavigation={scrollSnaps.length > 1}
            />
          </div>

          {/* Visible pour tout le monde : masquer le bouton aux visiteurs
              non connectés rendait la fonctionnalité invisible à ceux-là
              mêmes qu'on cherche à convertir. */}
          <AddTestimonialButton onClick={handleAjouterTemoignage} />
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