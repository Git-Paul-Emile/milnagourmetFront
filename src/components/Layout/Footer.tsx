import React from 'react';
import { useFooterData } from './Footer/useFooterData';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { FooterSkeleton } from './Footer/FooterSkeleton';
import { ContactSection } from './Footer/ContactSection';
import { HoursSection } from './Footer/HoursSection';
import { SocialSection } from './Footer/SocialSection';
import { LegalSection } from './Footer/LegalSection';
import { CopyrightSection } from './Footer/CopyrightSection';

export function Footer() {
  const { contactInfo, socialMedia, loading } = useFooterData();
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';

  if (loading) {
    return <FooterSkeleton />;
  }

  return (
    <footer className={cn("border-t", isChristmasTheme ? "bg-gradient-to-r from-[#722F37] to-[#8B0000] border-white/20" : "bg-muted/50 border-border")}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ContactSection contactInfo={contactInfo} isChristmasTheme={isChristmasTheme} />
          <HoursSection contactInfo={contactInfo} isChristmasTheme={isChristmasTheme} />
          <SocialSection socialMedia={socialMedia} isChristmasTheme={isChristmasTheme} />
          <LegalSection isChristmasTheme={isChristmasTheme} />
        </div>
        <CopyrightSection isChristmasTheme={isChristmasTheme} />
      </div>
    </footer>
  );
}