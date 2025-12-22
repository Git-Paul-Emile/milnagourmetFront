import { useTheme } from '@/hooks/useTheme';

export function HeroDecorations() {
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';
  return (
    <>
      {/* Éléments décoratifs flottants 3D améliorés */}
      <div className="absolute top-20 right-4 sm:right-20 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full animate-float hidden md:block shadow-2xl transform rotate-12 hover:rotate-45 transition-all duration-1000 hover:scale-110 hover:shadow-primary/30" />
      <div className="absolute bottom-40 left-4 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full animate-float shadow-xl transform -rotate-12 hover:rotate-0 transition-all duration-1000 hover:scale-110 hover:shadow-secondary/30" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-4 sm:right-10 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full animate-float shadow-lg transform rotate-45 hover:rotate-90 transition-all duration-1000 hover:scale-110 hover:shadow-accent/30" style={{ animationDelay: '2s' }} />

      {/* Particules flottantes améliorées */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/50 rounded-full animate-float opacity-70 hidden sm:block hover:opacity-100 transition-opacity" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-secondary/40 rounded-full animate-float opacity-60 hidden sm:block hover:opacity-100 transition-opacity" style={{ animationDelay: '2.5s', animationDuration: '5s' }} />
      <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-accent/60 rounded-full animate-float opacity-80 hidden sm:block hover:opacity-100 transition-opacity" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
      <div className="absolute bottom-1/4 right-1/3 w-2.5 h-2.5 bg-primary/40 rounded-full animate-float opacity-50 hidden sm:block hover:opacity-100 transition-opacity" style={{ animationDelay: '3.5s', animationDuration: '4.5s' }} />

      {/* Formes géométriques 3D améliorées */}
      <div className="absolute top-32 left-4 sm:left-20 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary/25 to-secondary/15 transform rotate-45 animate-float shadow-lg hidden sm:block hover:rotate-90 transition-transform duration-1000" style={{ animationDelay: '1.2s' }} />
      <div className="absolute bottom-32 right-4 sm:right-32 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-accent/30 to-primary/20 rounded-full animate-float shadow-md hidden sm:block hover:scale-125 transition-transform duration-1000" style={{ animationDelay: '2.8s' }} />
      <div className="absolute top-2/3 left-4 sm:left-16 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-secondary/35 to-accent/25 transform rotate-12 animate-float shadow-sm hidden sm:block hover:rotate-180 transition-transform duration-1000" style={{ animationDelay: '0.8s' }} />

      {/* Nouveaux éléments décoratifs */}
      <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-gradient-to-br from-primary/20 to-transparent transform rotate-45 animate-float opacity-60 hidden lg:block" style={{ animationDelay: '3.2s', animationDuration: '6s' }} />
      <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-gradient-to-br from-secondary/25 to-transparent rounded-full animate-float opacity-50 hidden lg:block" style={{ animationDelay: '4.1s', animationDuration: '5.5s' }} />

      {/* Flocons de neige pour le thème Noël */}
      {isChristmasTheme && (
        <>
          <div className="absolute top-10 left-10 w-2 h-2 bg-white/80 rounded-full animate-float opacity-90 hidden sm:block" style={{ animationDelay: '0s', animationDuration: '8s' }} />
          <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-white/80 rounded-full animate-float opacity-70 hidden sm:block" style={{ animationDelay: '1s', animationDuration: '7s' }} />
          <div className="absolute top-40 left-1/4 w-2.5 h-2.5 bg-white/80 rounded-full animate-float opacity-60 hidden sm:block" style={{ animationDelay: '2s', animationDuration: '9s' }} />
          <div className="absolute top-60 right-1/3 w-1 h-1 bg-white/80 rounded-full animate-float opacity-80 hidden sm:block" style={{ animationDelay: '3s', animationDuration: '6s' }} />
          <div className="absolute top-80 left-2/3 w-2 h-2 bg-white/80 rounded-full animate-float opacity-50 hidden sm:block" style={{ animationDelay: '4s', animationDuration: '10s' }} />
          <div className="absolute bottom-20 right-10 w-1.5 h-1.5 bg-white/80 rounded-full animate-float opacity-75 hidden sm:block" style={{ animationDelay: '5s', animationDuration: '8.5s' }} />
          <div className="absolute bottom-40 left-20 w-2 h-2 bg-white/80 rounded-full animate-float opacity-65 hidden sm:block" style={{ animationDelay: '6s', animationDuration: '7.5s' }} />
          <div className="absolute top-1/2 left-10 w-1 h-1 bg-white/80 rounded-full animate-float opacity-85 hidden sm:block" style={{ animationDelay: '7s', animationDuration: '9.5s' }} />
        </>
      )}
    </>
  );
}