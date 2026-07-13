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

  /** Mise à jour d'un service : actif, minElements, nom, description, image (admin) */
  async update(
    id: number,
    data: { nom?: string; description?: string; image?: string; actif?: boolean; minElements?: number }
  ) {
    return httpClient.put<SpecialService>(`/api/services/${id}`, data);
  },

  /** Ajouter un composant à un service (admin) */
  async addComponent(serviceId: number, nom: string) {
    return httpClient.post<ServiceComponent>(`/api/services/${serviceId}/components`, { nom });
  },

  /** Modifier un composant (admin) */
  async updateComponent(componentId: number, data: { nom?: string; disponible?: boolean }) {
    return httpClient.put<ServiceComponent>(`/api/services/components/${componentId}`, data);
  },

  /** Supprimer un composant (admin) */
  async deleteComponent(componentId: number) {
    return httpClient.delete(`/api/services/components/${componentId}`);
  },
};
