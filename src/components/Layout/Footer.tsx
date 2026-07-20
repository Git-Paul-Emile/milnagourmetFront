import React from 'react';
import { useFooterData } from './Footer/useFooterData';
import { FooterSkeleton } from './Footer/FooterSkeleton';
import { SocialSection } from './Footer/SocialSection';
import { LegalSection } from './Footer/LegalSection';
import { CopyrightSection } from './Footer/CopyrightSection';

export function Footer() {
  const { socialMedia, loading } = useFooterData();

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center justify-center">
            <img src="/images/logo.png" alt="Milna Gourmet" className="h-32 w-32" />
          </div>
          <SocialSection socialMedia={socialMedia} />
          <LegalSection />
        </div>
        <CopyrightSection />
      </div>
    </footer>
  );
}