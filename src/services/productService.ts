import { ProductCategoryItem } from '@/types';
import { httpClient } from './httpClient';

// Service pour les produits
export const productService = {
  async getProducts() {
    return httpClient.get('/api/products');
  },

  async createProduct(productData: {
    nom: string;
    description: string;
    prix: number;
    categorie: string;
    categorieId?: number;
    disponible: boolean;
    image?: string;
  }) {
    return httpClient.post('/api/products', productData);
  },

  async updateProduct(id: string, formData: FormData) {
    return httpClient.request(`/api/products/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  async deleteProduct(id: string) {
    return httpClient.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  async getProductCategories() {
    return httpClient.get('/api/categories');
  },

  async createProductCategory(category: Omit<ProductCategoryItem, 'id'>) {
    const backendData = {
      nom: category.name,
      description: category.description,
      active: category.active
    };
    return httpClient.post('/api/categories', backendData);
  },

  async updateProductCategory(id: number, data: { nom?: string; description?: string; active?: boolean }) {
    return httpClient.put(`/api/categories/${id}`, data);
  },

  async deleteProductCategory(id: number) {
    return httpClient.request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  },

  async uploadImage(imageFile: File): Promise<{ path: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await httpClient.request<{ path: string; filename: string }>('/api/upload/product-image', {
      method: 'POST',
      body: formData,
    });

    // Extraire les données de la réponse
    return response.data!;
  },

  async getAvailableImages(): Promise<{ value: string; label: string; isUsed: boolean }[]> {
    const response = await httpClient.get('/api/upload/images');
    return response.data as { value: string; label: string; isUsed: boolean }[];
  },
};