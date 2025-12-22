import { httpClient, ApiResponse } from './httpClient';
import { CreationSize } from '@/types';

export interface CreationOptionItem {
  id: number;
  nom: string;
  image?: string;
  disponible?: boolean;
  ordreAffichage?: number;
  creeLe?: string;
}

// Service pour les créations
export const creationService = {
  async getCreationSizes() {
    return httpClient.get<CreationSize[]>('/api/creation/tailles');
  },

  async createCreationSize(data: Partial<CreationSize>) {
    return httpClient.post<CreationSize>('/api/creation/tailles', data);
  },

  async updateCreationSize(id: number, data: Partial<CreationSize>) {
    return httpClient.put<CreationSize>(`/api/creation/tailles/${id}`, data);
  },

  async deleteCreationSize(id: number) {
    return httpClient.delete<CreationSize>(`/api/creation/tailles/${id}`);
  },

  async getCreationOptions() {
    const fruitsResp = await httpClient.get<CreationOptionItem[]>('/api/creation/fruits');
    const saucesResp = await httpClient.get<CreationOptionItem[]>('/api/creation/sauces');
    const cerealesResp = await httpClient.get<CreationOptionItem[]>('/api/creation/cereales');
    return {
      data: {
        fruits: fruitsResp.data ?? [],
        sauces: saucesResp.data ?? [],
        cereales: cerealesResp.data ?? []
      }
    } as ApiResponse<{ fruits: CreationOptionItem[]; sauces: CreationOptionItem[]; cereales: CreationOptionItem[] }>;
  },

  // Fruits
  async createFruit(nom: string) {
    return httpClient.post<CreationOptionItem>('/api/creation/fruits', { nom });
  },
  async updateFruit(id: number, nom: string) {
    return httpClient.put<CreationOptionItem>(`/api/creation/fruits/${id}`, { nom });
  },
  async deleteFruit(id: number) {
    return httpClient.delete(`/api/creation/fruits/${id}`);
  },

  // Sauces
  async createSauce(nom: string) {
    return httpClient.post<CreationOptionItem>('/api/creation/sauces', { nom });
  },
  async updateSauce(id: number, nom: string) {
    return httpClient.put<CreationOptionItem>(`/api/creation/sauces/${id}`, { nom });
  },
  async deleteSauce(id: number) {
    return httpClient.delete(`/api/creation/sauces/${id}`);
  },

  // Céréales
  async createCereale(nom: string) {
    return httpClient.post<CreationOptionItem>('/api/creation/cereales', { nom });
  },
  async updateCereale(id: number, nom: string) {
    return httpClient.put<CreationOptionItem>(`/api/creation/cereales/${id}`, { nom });
  },
  async deleteCereale(id: number) {
    return httpClient.delete(`/api/creation/cereales/${id}`);
  }
};