import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTop } from '@/components/Layout/ScrollToTop';
import { HeroSection } from '@/components/Home/HeroSection';
import { CustomCreationSection } from '@/components/Home/CustomCreationSection';
import { CatalogSection } from '@/components/Home/CatalogSection';
import { ServicesSection } from '@/components/Services/ServicesSection';
import { TestimonialsSection } from '@/components/Home/TestimonialsSection';
import { ContactSection } from '@/components/Home/ContactSection';
import { useSEO } from '@/hooks/useSEO';

const Index = () => {
  useSEO({
    title: 'Milna Gourmet - Le Salon du Yaourt | Yaourts Gourmets Faits Maison',
    description: 'Découvrez Milna Gourmet, votre salon du yaourt premium. Yaourts crémeux, liquides et créations personnalisées. Commandez via WhatsApp - Livraison rapide.'
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CatalogSection />
        <CustomCreationSection />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
