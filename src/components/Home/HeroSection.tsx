import React from 'react';
import { useParallax } from './hooks/useParallax';
import { useHeroData } from './hooks/useHeroData';
import { useTheme } from '@/hooks/useTheme';
import { HeroLoading } from './components/HeroLoading';
import { HeroBadge } from './components/HeroBadge';
import { HeroTitle } from './components/HeroTitle';
import { HeroSubtitle } from './components/HeroSubtitle';
import { HeroFeatures } from './components/HeroFeatures';
import { HeroCTA } from './components/HeroCTA';
import { HeroDecorations } from './components/HeroDecorations';
import ChristmasSnow from '../ChristmasSnow';
import NewYearEffects from '../NewYearEffects';
import { getFullImageUrl } from '@/utils/imageUtils';

export function HeroSection() {
  console.log('HeroSection rendering');
  const parallaxRef = useParallax();
  const { heroData, loading } = useHeroData();
  console.log('HeroSection: heroData', heroData, 'loading', loading);
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';
  const isNewYearTheme = theme?.name === 'Nouvel An';

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !heroData) {
    return <HeroLoading />;
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden -mt-8">
      {/* Background avec parallax amélioré */}
      <div className="absolute inset-0 parallax">
        <div
          ref={parallaxRef}
          className="parallax-layer bg-cover bg-center bg-no-repeat transform-gpu transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: heroData.banner ? `url(${getFullImageUrl(heroData.banner)})` : 'none',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            height: '120%',
            width: '120%',
            top: '-10%',
            left: '-10%'
          }}
        />
        <div className={`absolute inset-0 animate-pulse-soft ${
          isNewYearTheme
            ? "bg-gradient-to-br from-[rgba(10,10,10,0.8)] via-[rgba(30,39,73,0.7)] to-[rgba(15,27,61,0.7)]"
            : "bg-gradient-to-br from-background/85 via-background/65 to-background/45"
        }`} />
        <div className={`absolute inset-0 ${
          isNewYearTheme
            ? "bg-gradient-to-t from-[rgba(30,39,73,0.3)] via-transparent to-[rgba(10,10,10,0.2)]"
            : "bg-gradient-to-t from-background/25 via-transparent to-background/15"
        }`} />
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center lg:text-left">
          <HeroBadge badge={heroData.badge} isChristmasTheme={isChristmasTheme} isNewYearTheme={isNewYearTheme} />
          <HeroTitle title={heroData.title} isChristmasTheme={isChristmasTheme} isNewYearTheme={isNewYearTheme} />
          <HeroSubtitle subtitle={heroData.subtitle} isChristmasTheme={isChristmasTheme} isNewYearTheme={isNewYearTheme} />
          <HeroFeatures features={heroData.features} isChristmasTheme={isChristmasTheme} isNewYearTheme={isNewYearTheme} />
          <HeroCTA onCatalogClick={scrollToCatalog} isChristmasTheme={isChristmasTheme} isNewYearTheme={isNewYearTheme} />
        </div>
      </div>

      <HeroDecorations />
      {isChristmasTheme && <ChristmasSnow />}
      {theme?.name === 'Nouvel An' && <NewYearEffects />}
    </section>
  );
}