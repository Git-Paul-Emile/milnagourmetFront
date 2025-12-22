import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTop } from '@/components/Layout/ScrollToTop';
import { HeroSection } from '@/components/Home/HeroSection';
import { CatalogSection } from '@/components/Home/CatalogSection';
import { TestimonialsSection } from '@/components/Home/TestimonialsSection';
import { ContactSection } from '@/components/Home/ContactSection';

const Index = () => {
  console.log('Index page rendering');
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CatalogSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
