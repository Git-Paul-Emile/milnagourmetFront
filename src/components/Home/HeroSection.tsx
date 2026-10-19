import { useEffect, useState } from 'react';
import { useHeroData } from './hooks/useHeroData';
import { HeroLoading } from './components/HeroLoading';
import { HeroTitle } from './components/HeroTitle';
import { HeroSubtitle } from './components/HeroSubtitle';
import { HeroCTA } from './components/HeroCTA';
import { HeroDecorations } from './components/HeroDecorations';
import { DEFAULT_BANNER_IMAGE, HERO_VIDEO } from '@/constants/media';

export function HeroSection() {
  const { heroData, loading } = useHeroData();

  // Accessibilité (WCAG 2.2.2) : une vidéo qui joue en boucle est une
  // animation automatique. On ne la lance pas si l'utilisateur a demandé
  // la réduction des animations ; l'image poster prend alors le relais.
  const [motionAllowed, setMotionAllowed] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)');
    setMotionAllowed(mq.matches);
    const onChange = () => setMotionAllowed(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !heroData) {
    return <HeroLoading />;
  }

  return (
    <section id="home" className="relative h-screen flex items-end overflow-hidden -mt-40">
      {/* Fond : vidéo en boucle, avec la bannière en image poster.
          L'image reste visible tant que la vidéo n'est pas chargée, et
          définitivement si le fichier vidéo est absent. */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={DEFAULT_BANNER_IMAGE}
          autoPlay={motionAllowed}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        {/* Filtre : noir à 10 % d'opacité. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/10" />

        {/* Fondu bas : assure la lisibilité du texte posé sur la vidéo. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
        />
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center lg:text-left">
          <HeroTitle title={heroData.title} />
          <HeroSubtitle subtitle={heroData.subtitle} />
          <HeroCTA onCatalogClick={scrollToCatalog} />
        </div>
      </div>

      <HeroDecorations />
    </section>
  );
}