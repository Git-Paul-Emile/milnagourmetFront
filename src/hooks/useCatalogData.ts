import { useState, useEffect } from 'react';
import { Product, ProductCategoryItem, CatalogSectionData } from '@/types';
import { siteService, productService } from '@/services';

export function useCatalogData() {
  const [catalogData, setCatalogData] = useState<CatalogSectionData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Charger les données de la section catalogue
        const catalogSectionData = await siteService.getCatalogSectionData();
        setCatalogData(catalogSectionData.data as CatalogSectionData ?? null);

        // Charger les produits
        const productsData = await productService.getProducts();
        setProducts(productsData.data as Product[] ?? []);

        // Charger les catégories
        const categoriesData = await productService.getProductCategories();
        setCategories(categoriesData.data as ProductCategoryItem[] ?? []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setCatalogData(null);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { catalogData, products, categories, loading, setCategories };
}