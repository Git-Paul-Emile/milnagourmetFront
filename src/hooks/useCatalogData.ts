import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Product, ProductCategoryItem, CatalogSectionData } from '@/types';
import { siteService, productService } from '@/services';
import { queryKeys } from '@/lib/queryClient';

const AUCUN_PRODUIT: Product[] = [];
const AUCUNE_CATEGORIE: ProductCategoryItem[] = [];

type MiseAJourCategories =
  | ProductCategoryItem[]
  | ((precedentes: ProductCategoryItem[]) => ProductCategoryItem[]);

export function useCatalogData() {
  const queryClient = useQueryClient();

  // Trois requêtes indépendantes, lancées en parallèle et mises en cache
  // séparément : un produit modifié n'invalide pas les catégories.
  const catalogue = useQuery({
    queryKey: queryKeys.catalogSection,
    queryFn: async () => (await siteService.getCatalogSectionData()).data as CatalogSectionData ?? null,
  });

  const produits = useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => (await productService.getProducts()).data as Product[] ?? [],
  });

  const categories = useQuery({
    queryKey: queryKeys.productCategories,
    queryFn: async () => (await productService.getProductCategories()).data as ProductCategoryItem[] ?? [],
  });

  // Mise à jour locale du cache après la création d'une catégorie.
  const setCategories = useCallback((miseAJour: MiseAJourCategories) => {
    queryClient.setQueryData<ProductCategoryItem[]>(queryKeys.productCategories, (precedentes = []) =>
      typeof miseAJour === 'function' ? miseAJour(precedentes) : miseAJour
    );
  }, [queryClient]);

  return {
    catalogData: catalogue.data ?? null,
    products: produits.data ?? AUCUN_PRODUIT,
    categories: categories.data ?? AUCUNE_CATEGORIE,
    loading: catalogue.isPending || produits.isPending || categories.isPending,
    setCategories,
  };
}
