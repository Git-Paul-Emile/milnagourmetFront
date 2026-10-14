import React, { useState } from 'react';
import { CHARACTERS } from '@/constants/characters';
import { cn } from '@/lib/utils';
import { YaourtCharacter } from '@/types';

export function CharactersSection() {
  const [activeCharId, setActiveCharId] = useState<string | null>(null);

  return (
    <section id="personnages" className="pt-24 pb-8 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#212121]">
            Chaque yaourt a son caractère. <br className="hidden md:block" />
            <span className="text-primary">Lequel est le vôtre ?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Bien plus que de simples recettes, nos yaourts sont des personnalités à part entière.
            Découvrez la bande Milna Gourmet !
          </p>
        </div>

        {/* 
          Conteneur scrollable horizontalement sur mobile, 
          grille ou flex enveloppé sur desktop selon l'espace 
        */}
        <div className="flex overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar gap-6 py-4">
          {/* Spacer pour un padding initial correct sur le scroll */}
          <div className="w-[1px] shrink-0 md:hidden"></div>
          {CHARACTERS.map((char, index) => (
            <CharacterCard 
              key={char.id} 
              character={char} 
              index={index}
              isActive={activeCharId === char.id}
              onMouseEnter={() => setActiveCharId(char.id)}
              onMouseLeave={() => setActiveCharId(null)}
              onClick={() => setActiveCharId(activeCharId === char.id ? null : char.id)}
            />
          ))}
          {/* Spacer pour un padding final correct sur le scroll */}
          <div className="w-[1px] shrink-0 md:hidden"></div>
        </div>
      </div>
    </section>
  );
}

interface CharacterCardProps {
  character: YaourtCharacter;
  index: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

function CharacterCard({ character, index, isActive, onMouseEnter, onMouseLeave, onClick }: CharacterCardProps) {
  // Styles CSS variables dynamiques pour les halos de hover
  const customStyles = {
    '--char-color': character.color,
    '--char-secondary': character.colorSecondary,
  } as React.CSSProperties;

  const cardBg = character.bgGradient || `linear-gradient(145deg, ${character.colorSecondary}, ${character.color})`;

  return (
    <div 
      className={cn(
        "character-card-container snap-center shrink-0 w-[300px] h-[480px] md:w-[320px] md:h-[510px] perspective-1000",
        "animate-fade-in-up group cursor-pointer select-none"
      )}
      style={{ 
        ...customStyles, 
        animationDelay: `${index * 0.15}s` 
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className={cn(
        "character-card relative w-full h-full transition-transform duration-700 preserve-3d",
        isActive ? "rotate-y-180" : ""
      )}>
        
        {/* FACE AVANT (sans dégradé en haut ni halo autour du personnage) */}
        <div className="absolute inset-0 backface-hidden w-full h-full bg-card rounded-2xl shadow-soft border border-border p-6 flex flex-col items-center justify-between overflow-hidden">
          <div className="text-center z-10 relative mt-2">
            <h3 className="text-2xl font-bold mb-1" style={{ color: character.color }}>{character.name}</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{character.description}</p>
          </div>

          {/* Visuel du personnage épuré sans dégradé d'ambiance */}
          <div className="relative w-full h-64 my-auto flex items-center justify-center z-10 px-2">
            {character.imageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className="max-h-60 w-auto max-w-full object-contain drop-shadow-xl animate-float-3d"
                  loading="lazy"
                />
              </div>
            ) : (
              <div id={`character-3d-${character.id}`} className="w-full h-full flex items-center justify-center">
                {/* Silhouette animée (placeholder) */}
                <div 
                  className="w-32 h-32 rounded-full animate-float-3d relative flex items-center justify-center text-4xl shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${character.colorSecondary}, ${character.color})`,
                    boxShadow: `0 10px 30px -10px ${character.color}`
                  }}
                >
                  <span className="drop-shadow">{character.emoji}</span>
                </div>
              </div>
            )}
          </div>

          <div className="w-full text-center z-10 pb-2">
            <p className="text-sm italic text-foreground/80 font-medium px-3">"{character.tagline}"</p>
            <div className="mt-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Cliquer ou survoler pour découvrir</span>
              <span className="text-xs">↻</span>
            </div>
          </div>
        </div>

        {/* FACE ARRIÈRE (sans dégradé supérieur, contenu ajusté pour ne jamais couper la citation) */}
        <div 
          className="absolute inset-0 backface-hidden w-full h-full rounded-2xl p-5 md:p-6 flex flex-col rotate-y-180 text-white shadow-2xl border border-white/20 overflow-hidden"
          style={{ background: cardBg }}
        >
          <div className="flex-1 flex flex-col justify-between z-10 relative overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div>
              <div className="mb-3.5 pb-3 border-b border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  {character.imageUrl ? (
                    <img
                      src={character.imageUrl}
                      alt={character.name}
                      className="w-11 h-11 object-contain rounded-full bg-white/20 p-1 border border-white/40 shadow-md shrink-0"
                    />
                  ) : (
                    <span className="text-2xl">{character.emoji}</span>
                  )}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md">{character.name}</h3>
                    <span className="text-[11px] text-white/90 uppercase tracking-wider font-semibold">{character.description}</span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm">{character.personality}</p>
              </div>
              
              <div className="mb-3">
                <h4 className="text-[11px] uppercase tracking-widest text-white/80 mb-2 font-bold">Traits de caractère</h4>
                <div className="flex flex-wrap gap-1.5">
                  {character.traits.map(trait => (
                    <span key={trait} className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-semibold text-white shadow-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 mt-auto">
              <div className="bg-black/35 backdrop-blur-md rounded-xl p-3 md:p-3.5 border border-white/20 shadow-inner">
                <p className="italic text-xs md:text-sm font-serif text-white/95 leading-normal">"{character.philosophy}"</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
