import React from 'react';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { AuthUser } from '@/types';

interface Category {
  id: string | number;
  name: string;
}

interface CategoryFiltersProps {
  displayCategories: Category[];
  activeCategory: string | number;
  setActiveCategory: (category: string | number) => void;
  user: AuthUser | null;
  onAddCategoryClick: () => void;
  isChristmasTheme?: boolean;
}

export function CategoryFilters({
  displayCategories,
  activeCategory,
  setActiveCategory,
  user,
  onAddCategoryClick,
  isChristmasTheme = false,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {displayCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={cn(
            'flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300',
            activeCategory === category.id
              ? 'bg-gradient-primary text-primary-foreground shadow-glow'
              : 'bg-card text-foreground hover:bg-primary/10 hover:text-primary border border-border'
          )}
        >
          <span>{category.name}</span>
        </button>
      ))}

      {/* Bouton d'ajout de catégorie pour les admins */}
      {user?.role === 'admin' && (
        <button
          onClick={onAddCategoryClick}
          className="flex items-center space-x-2 px-4 py-3 rounded-full font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border border-dashed transition-all duration-300"
          title="Ajouter une catégorie"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Ajouter</span>
        </button>
      )}
    </div>
  );
}