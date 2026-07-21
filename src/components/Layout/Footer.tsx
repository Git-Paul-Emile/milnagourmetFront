import React from 'react';
import { useFooterData } from './Footer/useFooterData';
import { FooterSkeleton } from './Footer/FooterSkeleton';
import { LegalSection } from './Footer/LegalSection';
import { CopyrightSection } from './Footer/CopyrightSection';

export function Footer() {
  const { loading } = useFooterData();

  if (loading) {
    return <FooterSkeleton />;
  }

  return (
    <footer
      className="relative bg-cover bg-top flex items-end"
      style={{
        backgroundImage: "url('/images/footer-bg.png')",
        aspectRatio: '633 / 197',
      }}
    >
      <div className="container relative mx-auto w-full px-4 pt-12 pb-[98px]">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)]">
          <div className="flex items-center justify-start">
            <img src="/images/logo.png" alt="Milna Gourmet" className="h-32 w-32" />
          </div>
          <div className="flex justify-center md:justify-center">
            <LegalSection />
          </div>
        </div>
        <CopyrightSection />
      </div>
    </footer>
  );
}