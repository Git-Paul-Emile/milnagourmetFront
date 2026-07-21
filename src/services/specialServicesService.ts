import { httpClient } from './httpClient';
import { SpecialService, ServiceComponent } from '@/types';

// Services spéciaux (Panier gourmand, Boîte pancake) — prix sur devis
export const specialServicesService = {
  /** Services actifs (public, catalogue) */
  async getActive() {
    return httpClient.get<SpecialService[]>('/api/services');
  },

  /** Tous les services (admin) */
  async getAll() {
    return httpClient.get<SpecialService[]>('/api/services/all');
  },

  /** Mise à jour d'un service (admin) */
  async update(
    id: number,
    data: {
      nom?: string;
      description?: string;
      image?: string;
      actif?: boolean;
      minElements?: number;
      prixBase?: number;
      typeService?: string;
    }
  ) {
    return httpClient.put<SpecialService>(`/api/services/${id}`, data);
  },

  /** Ajouter un composant à un service (admin) */
  async addComponent(serviceId: number, nom: string) {
    return httpClient.post<ServiceComponent>(`/api/services/${serviceId}/components`, { nom });
  },

  /** Modifier un composant (admin) */
  async updateComponent(
    componentId: number,
    data: { nom?: string; disponible?: boolean; parDefaut?: boolean; quantiteDefaut?: number }
  ) {
    return httpClient.put<ServiceComponent>(`/api/services/components/${componentId}`, data);
  },

  /** Supprimer un composant (admin) */
  async deleteComponent(componentId: number) {
    return httpClient.delete(`/api/services/components/${componentId}`);
  },

  /** Upload d'une image d'élément de service ; renvoie l'URL Cloudinary (admin) */
  async uploadComponentImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await httpClient.request<{ path: string; filename: string }>(
      '/api/upload/service-component-image',
      { method: 'POST', body: formData }
    );
    return response.data!.path;
  },

  /** Upload d'une image de couverture de carte service ; renvoie l'URL (admin) */
  async uploadCoverImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await httpClient.request<{ path: string; filename: string }>(
      '/api/upload/service-cover-image',
      { method: 'POST', body: formData }
    );
    return response.data!.path;
  },
};
