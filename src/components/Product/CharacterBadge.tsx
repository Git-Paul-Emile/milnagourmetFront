import React from 'react';
import { CHARACTERS } from '@/constants/characters';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

interface CharacterBadgeProps {
  product: Product;
  className?: string;
}

export function CharacterBadge({ product, className }: CharacterBadgeProps) {
  // Determine which character matches this product
  // based on product properties
  
  // Example matching logic:
  let character = null;
  
  if (product.category === 'cremeux') {
    if ((product as any).type === 'nature') {
      character = CHARACTERS.find(c => c.id === 'le-zen');
    } else if ((product as any).type === 'simple') {
      character = CHARACTERS.find(c => c.id === 'le-copain');
    } else if ((product as any).type === 'cereales') {
      character = CHARACTERS.find(c => c.id === 'le-creatif');
    } else {
      character = CHARACTERS.find(c => c.id === 'le-gourmand');
    }
  } else if (product.category === 'liquide') {
    character = CHARACTERS.find(c => c.id === 'le-dynamique');
  } else if (product.categoryId) {
    // If we only have string category, try to match directly or fallback
    character = CHARACTERS.find(c => c.productCategory === product.category);
  }

  if (!character) return null;

  return (
    <div 
      className={cn(
        "flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm",
        "backdrop-blur-md bg-white/90 border border-white/50",
        className
      )}
      title={character.personality}
    >
      <span style={{ color: character.color }}>{character.name}</span>
    </div>
  );
}
