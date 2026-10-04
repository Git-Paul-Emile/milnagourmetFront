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

  return (
    <div 
      className={cn(
        "character-card-container snap-center shrink-0 w-[300px] h-[450px] md:w-[320px] md:h-[480px] perspective-1000",
        "animate-fade-in-up group cursor-pointer"
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
        
        {/* FACE AVANT */}
        <div className="absolute inset-0 backface-hidden w-full h-full bg-card rounded-2xl shadow-soft border border-border p-6 flex flex-col items-center justify-between overflow-hidden">
          {/* Halo coloré au fond */}
          <div className="absolute top-0 inset-x-0 h-40 opacity-20 transition-opacity group-hover:opacity-40" 
               style={{ background: `linear-gradient(to bottom, ${character.color}, transparent)` }} />
          
          <div className="text-center z-10 relative mt-6">
            <h3 className="text-2xl font-bold mb-2" style={{ color: character.color }}>{character.name}</h3>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{character.description}</p>
          </div>

          {/* Espace 3D Placeholder */}
          <div className="relative w-48 h-48 my-auto flex items-center justify-center z-10">
            {/* L'id permet d'injecter facilement le viewer 3D plus tard */}
            <div id={`character-3d-${character.id}`} className="w-full h-full flex items-center justify-center">
              {/* Silhouette animée (placeholder) */}
              <div className="w-32 h-32 rounded-full animate-float-3d relative flex items-center justify-center"
                   style={{ 
                     background: `linear-gradient(135deg, ${character.colorSecondary}, ${character.color})`,
                     boxShadow: `0 10px 30px -10px ${character.color}`
                   }}>
              </div>
            </div>
          </div>

          <div className="w-full text-center z-10 pb-4">
            <p className="text-base italic text-foreground/80 font-medium px-4">"{character.tagline}"</p>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-2">
              Découvrir la personnalité
            </div>
          </div>
        </div>

        {/* FACE ARRIÈRE */}
        <div className="absolute inset-0 backface-hidden w-full h-full rounded-2xl p-6 flex flex-col rotate-y-180 text-white"
             style={{ background: `linear-gradient(145deg, ${character.colorSecondary}, ${character.color})` }}>
          
          <div className="flex-1 flex flex-col">
            <div className="mb-6 pb-6 border-b border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold">{character.name}</h3>
              </div>
              <p className="text-lg font-medium leading-relaxed drop-shadow-sm">{character.personality}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-widest text-white/70 mb-3 font-semibold">Traits de caractère</h4>
              <div className="flex flex-wrap gap-2">
                {character.traits.map(trait => (
                  <span key={trait} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <div className="bg-black/10 rounded-xl p-4 border border-white/10">
                <p className="italic text-base font-serif">"{character.philosophy}"</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
