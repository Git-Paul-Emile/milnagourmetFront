import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CustomCreation } from '@/components/Product/CustomCreation';
import { ProductCard } from '@/components/Product/ProductCard';
import { Product, ProductCategoryItem } from '@/types';
import { productService, configService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { useCatalogData } from '@/hooks/useCatalogData';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { CategoryFilters } from './CategoryFilters';
import { CreationSection } from './CreationSection';
import { AddCategoryModal } from './AddCategoryModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export function CatalogSection() {
  console.log('CatalogSection rendering');
  const { user } = useAuth();
  const { catalogData, products, categories, loading, setCategories } = useCatalogData();
  console.log('CatalogSection: catalogData', catalogData, 'products', products?.length, 'loading', loading);
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';

  const [activeCategory, setActiveCategory] = useState<'all' | string | number>('all');
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [categoryIdToName, setCategoryIdToName] = useState<{ [key: number]: string }>({});
  const [creationCategoryId, setCreationCategoryId] = useState<number | null>(null);
  
  // Plugin autoplay pour les carrousels - recréer à chaque rendu pour éviter les problèmes de référence
  const autoplayPlugin = useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: false }),
    []
  );

  // Charger les traductions de catégories depuis l'API
  useEffect(() => {
    const loadCategoryMappings = async () => {
      try {
        const translations = await configService.getCategoryTranslations();
        const mapping: { [key: number]: string } = {};
        let creationId: number | null = null;

        // Créer le mapping ID -> code depuis les traductions
        translations.forEach(translation => {
          mapping[translation.categorieId] = translation.code;
          if (translation.code === 'creation') {
            const category = categories.find(cat => cat.id === translation.categorieId);
            if (category) {
              creationId = category.id;
            }
          }
        });

        setCategoryIdToName(mapping);
        setCreationCategoryId(creationId);
      } catch (error) {
        console.error('Erreur lors du chargement des traductions de catégories:', error);
        // Fallback vers le mapping hardcodé en cas d'erreur
        const fallbackMapping = {
          1: 'cremeux',
          2: 'liquide',
          3: 'creation'
        };
        setCategoryIdToName(fallbackMapping);
        console.log('Utilisation du mapping de fallback:', fallbackMapping);
      }
    };

    loadCategoryMappings();
  }, [categories]);

  // Construire la liste des catégories actives (sans "Tout" et "Création" pour l'affichage par catégorie)
  const activeCategories = useMemo(() => {
    return categories
      .filter(cat => {
        // Exclure la catégorie "Création" par ID si connu
        if (cat.id === creationCategoryId) return false;
        // Exclure aussi par nom au cas où creationCategoryId n'est pas encore chargé
        const normalizedName = cat.name?.toLowerCase().trim();
        if (normalizedName === 'création' || normalizedName === 'creation') return false;
        // Exclure aussi si le mapping indique que c'est "creation"
        if (categoryIdToName[cat.id as number] === 'creation') return false;
        return cat.active;
      })
      .map(cat => ({ id: cat.id, name: cat.name }));
  }, [categories, creationCategoryId, categoryIdToName]);

  // Grouper les produits par catégorie - utiliser useMemo pour recalculer quand le mapping est chargé
  const productsByCategory = useMemo(() => {
    return activeCategories.reduce((acc, category) => {
      // Essayer d'obtenir le code depuis le mapping, sinon utiliser le nom de la catégorie en minuscules
      let categoryCode = categoryIdToName[category.id as number];
      
      // Si le mapping n'est pas encore chargé ou si le code n'est pas trouvé,
      // essayer de deviner le code depuis le nom de la catégorie
      if (!categoryCode && category.name) {
        // Mapper les noms de catégories courants aux codes (sans accents)
        // Le backend transforme CREMEUX -> cremeux (sans accent)
        const nameToCode: { [key: string]: string } = {
          'crémeux': 'cremeux',
          'cremeux': 'cremeux',
          'crèmeux': 'cremeux', // avec accent dans le nom
          'liquide': 'liquide',
          'création': 'creation',
          'creation': 'creation'
        };
        const normalizedName = category.name.toLowerCase().trim();
        // Utiliser le mapping explicite ou supprimer les accents
        categoryCode = nameToCode[normalizedName];
        if (!categoryCode) {
          // Supprimer les accents si pas dans le mapping
          categoryCode = normalizedName
            .replace(/[éèêë]/g, 'e')
            .replace(/[àâä]/g, 'a')
            .replace(/[îï]/g, 'i')
            .replace(/[ôö]/g, 'o')
            .replace(/[ùûü]/g, 'u')
            .replace(/[ç]/g, 'c');
        }

      }
      if (!categoryCode) {
        console.warn(`Impossible de déterminer le code de catégorie pour l'ID ${category.id} (nom: ${category.name})`);
        return acc;
      }

      const categoryProducts = products.filter(product => {
        // Exclure les produits archivés ou indisponibles
        if (product.archived || !product.available) return false;
        // Comparer en minuscules pour éviter les problèmes de casse
        const productCategory = product.category?.toLowerCase() || '';
        const matches = productCategory === categoryCode.toLowerCase();
        return matches;
      });

      // Inclure toutes les catégories, même si elles n'ont pas de produits
      acc[category.id] = {
        category,
        products: categoryProducts
      };
      
      return acc;
    }, {} as Record<string | number, { category: { id: string | number; name: string }; products: Product[] }>);
  }, [activeCategories, products, categoryIdToName]);

  // Fonction helper pour vérifier si la catégorie active est "Création"
  const checkIsCreationCategory = (category: string | number): boolean => {
    // Vérifier si c'est la string 'creation' (toujours prioritaire)
    if (category === 'creation') return true;
    
    // Vérifier si c'est l'ID numérique de la catégorie "Création"
    if (creationCategoryId !== null && category === creationCategoryId) return true;
    
    // Vérifier via le mapping si c'est un nombre
    if (typeof category === 'number' && categoryIdToName[category] === 'creation') return true;
    
    // Vérifier aussi par nom de catégorie si on a accès aux catégories
    if (typeof category === 'number') {
      const foundCategory = categories.find(cat => cat.id === category);
      if (foundCategory) {
        const normalizedName = foundCategory.name?.toLowerCase().trim();
        if (normalizedName === 'création' || normalizedName === 'creation') return true;
      }
    }
    
    return false;
  };

  // Construire la liste des catégories avec "Tout" et "Création" pour les filtres
  // Toujours inclure "Création" même si creationCategoryId n'est pas encore chargé
  const displayCategories = [
    { id: 'all', name: 'Tout' },
    ...activeCategories,
    { id: 'creation', name: 'Création' }, // Toujours afficher le bouton "Création"
  ];

  const handleAddCategory = async (name: string, description: string) => {
    try {
      const newCategory: ProductCategoryItem = {
        id: Date.now(),
        name,
        description,
        active: true,
        createdAt: new Date().toISOString()
      };

      // Ajouter via l'API
      await productService.createProductCategory(newCategory);

      // Mettre à jour l'état local
      setCategories(prev => [...prev, newCategory]);

      console.log('Catégorie ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      // En cas d'erreur API, ajouter localement quand même
      const newCategory: ProductCategoryItem = {
        id: Date.now(),
        name,
        description,
        active: true,
        createdAt: new Date().toISOString()
      };
      setCategories(prev => [...prev, newCategory]);
    }
  };

  return (
    <section id="catalog" className={cn("py-20", isChristmasTheme ? "bg-[#FFF9F0]" : "bg-muted/30")}>
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className={isChristmasTheme ? "text-[#722F37]" : "text-foreground"}>Notre </span>
            <span className={isChristmasTheme ? "text-[#D4AF37]" : "bg-gradient-primary bg-clip-text text-transparent"}>Catalogue</span>
          </h2>
          <p className={cn("text-lg max-w-2xl mx-auto", isChristmasTheme ? "text-[#666]" : "text-muted-foreground")}>
            {catalogData?.description || 'Découvrez notre sélection de yaourts gourmets, préparés avec amour et des ingrédients de qualité'}
          </p>
        </div>

        <CategoryFilters
          displayCategories={displayCategories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          user={user}
          onAddCategoryClick={() => setIsAddCategoryModalOpen(true)}
          isChristmasTheme={isChristmasTheme}
        />

        {checkIsCreationCategory(activeCategory) ? (
          <CreationSection
            catalogData={catalogData}
            onCreationOpen={() => setIsCreationOpen(true)}
          />
        ) : (
          <div className="space-y-16">
            {/* Afficher tous les produits en carrousel si "Tout" est sélectionné */}
            {activeCategory === 'all' ? (
              (() => {
                const allProducts = Object.values(productsByCategory).flatMap(({ products: categoryProducts }) => categoryProducts);
                
                return allProducts.length > 0 ? (
                  <Carousel
                    plugins={[autoplayPlugin]}
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full mx-4"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {allProducts.map((product, index) => (
                        <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                          <div className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <ProductCard product={product} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {allProducts.length > 4 && (
                      <>
                        <CarouselPrevious className="-left-4" />
                        <CarouselNext className="-right-4" />
                        <CarouselDots />
                      </>
                    )}
                  </Carousel>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Aucun produit disponible</p>
                  </div>
                );
              })()
            ) : (
              /* Afficher uniquement la catégorie sélectionnée avec ses produits en carrousel */
              (() => {
                // Vérifier si la catégorie sélectionnée est "Création" (au cas où elle serait dans productsByCategory)
                if (checkIsCreationCategory(activeCategory)) {
                  return (
                    <CreationSection
                      catalogData={catalogData}
                      onCreationOpen={() => setIsCreationOpen(true)}
                    />
                  );
                }
                
                const selectedCategoryData = productsByCategory[activeCategory];
                if (!selectedCategoryData) {
                  return (
                    <div className="text-center py-20">
                      <h3 className="text-xl font-semibold mb-2">{catalogData?.emptyMessage || 'Aucun produit trouvé'}</h3>
                      <p className="text-muted-foreground">
                        {catalogData?.emptySubMessage || 'Essayez une autre catégorie ou revenez plus tard'}
                      </p>
                    </div>
                  );
                }
                const { category, products: categoryProducts } = selectedCategoryData;
                
                return (
                  <div className="space-y-6">
                    {categoryProducts.length > 0 ? (
                      <Carousel
                        plugins={[autoplayPlugin]}
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-full mx-4"
                      >
                        <CarouselContent className="-ml-2 md:-ml-4">
                          {categoryProducts.map((product, index) => (
                            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                              <div className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <ProductCard product={product} />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {categoryProducts.length > 4 && (
                          <>
                            <CarouselPrevious className="-left-4" />
                            <CarouselNext className="-right-4" />
                            <CarouselDots />
                          </>
                        )}
                      </Carousel>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Aucun produit disponible dans cette catégorie</p>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* Message si aucune catégorie n'a de produits */}
        {activeCategory === 'all' && Object.keys(productsByCategory).length === 0 && !loading && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">{catalogData?.emptyMessage || 'Aucun produit trouvé'}</h3>
            <p className="text-muted-foreground">
              {catalogData?.emptySubMessage || 'Essayez une autre catégorie ou revenez plus tard'}
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des produits...</p>
          </div>
        )}
      </div>

      {/* Custom Creation Modal */}
      <CustomCreation
        isOpen={isCreationOpen}
        onClose={() => setIsCreationOpen(false)}
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </section>
  );
}