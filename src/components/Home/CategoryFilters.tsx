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
}

export function CategoryFilters({ displayCategories, activeCategory, setActiveCategory, user, onAddCategoryClick }: CategoryFiltersProps) {
  return (
    /*
     * Deux niveaux volontaires :
     *
     * 1. Le conteneur extérieur porte le défilement horizontal. Les
     *    marges négatives `-mx-4` annulent le padding de la section pour
     *    que la zone défilante aille d'un bord à l'autre de l'écran —
     *    sinon le dernier filtre semble coupé au milieu du vide.
     *
     * 2. La rangée intérieure combine `w-max` et `min-w-full` :
     *    - quand les filtres tiennent, `min-w-full` l'étire et
     *      `justify-center` les centre ;
     *    - quand ils débordent, `w-max` la laisse s'étendre et le
     *      centrage n'a plus d'effet, ce qui évite le défaut classique
     *      du `justify-center` en zone défilante — le premier élément
     *      devient alors inatteignable, coupé à gauche.
     */
    <div className="-mx-4 mb-12 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex w-max min-w-full flex-nowrap justify-center gap-3 md:flex-wrap">
      {displayCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={cn(
            'flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 border shrink-0',
            activeCategory === category.id
              ? 'bg-button text-white border-transparent'
              : 'bg-white text-foreground border-border hover:bg-white hover:text-foreground hover:border-button-hover-border'
          )}
        >
          <span>{category.name}</span>
        </button>
      ))}

      {/* Bouton d'ajout de catégorie pour les admins */}
      {user?.role === 'admin' && (
        <button
          onClick={onAddCategoryClick}
          className="flex items-center space-x-2 px-4 py-3 rounded-full font-medium bg-muted text-muted-foreground hover:bg-button-hover hover:text-button-hover-foreground border border-border border-dashed transition-all duration-300"
          title="Ajouter une catégorie"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Ajouter</span>
        </button>
      )}
      </div>
    </div>
  );
}