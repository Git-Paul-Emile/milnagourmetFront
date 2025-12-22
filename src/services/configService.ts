import { httpClient } from './httpClient';

export interface OrderStatusConfig {
  id: number;
  statut: string;
  libelleFr: string;
  couleurBg: string;
  couleurText: string;
  icone?: string;
  ordre: number;
}

export interface CategoryTranslation {
  id: number;
  categorieId: number;
  code: string;
  libelleFr: string;
  categorie?: {
    id: number;
    nom: string;
  };
}

export interface SizeTranslation {
  id: number;
  tailleId: number;
  code: string;
  libelleFr: string;
  taille?: {
    id: number;
    nom: string;
  };
}

export interface AppConfig {
  orderStatuses: OrderStatusConfig[];
  categoryTranslations: CategoryTranslation[];
  sizeTranslations: SizeTranslation[];
}

class ConfigService {
  private configCache: AppConfig | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getAllConfig(): Promise<AppConfig> {
    // Vérifier le cache
    const now = Date.now();
    if (this.configCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.configCache;
    }

    try {
      const response = await httpClient.get<AppConfig>('/api/config');
      
      // Vérifier que response.data existe et a la structure attendue
      if (response.data && typeof response.data === 'object') {
        this.configCache = response.data as AppConfig;
        this.cacheTimestamp = now;
        return this.configCache;
      } else {
        // Si la structure n'est pas correcte, utiliser des valeurs par défaut
        console.warn('Structure de réponse API inattendue, utilisation des valeurs par défaut');
        this.configCache = {
          orderStatuses: [
            { id: 1, statut: 'RECU', libelleFr: 'Reçue', couleurBg: 'bg-blue-100', couleurText: 'text-blue-800', icone: 'CheckCircle', ordre: 1 },
            { id: 2, statut: 'EN_PREPARATION', libelleFr: 'En préparation', couleurBg: 'bg-orange-100', couleurText: 'text-orange-800', icone: 'ShoppingBag', ordre: 2 },
            { id: 3, statut: 'LIVRAISON', libelleFr: 'En livraison', couleurBg: 'bg-green-100', couleurText: 'text-green-800', icone: 'Truck', ordre: 3 },
            { id: 4, statut: 'LIVREE', libelleFr: 'Livrée', couleurBg: 'bg-purple-100', couleurText: 'text-purple-800', icone: 'CheckCircle', ordre: 4 }
          ],
          categoryTranslations: [],
          sizeTranslations: []
        };
        this.cacheTimestamp = now;
        return this.configCache;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des configurations:', error);
      // Retourner un cache même s'il est expiré en cas d'erreur
      if (this.configCache) {
        return this.configCache;
      }
      // En cas d'erreur et pas de cache, retourner des valeurs par défaut
      const defaultConfig: AppConfig = {
        orderStatuses: [
          { id: 1, statut: 'RECU', libelleFr: 'Reçue', couleurBg: 'bg-blue-100', couleurText: 'text-blue-800', icone: 'CheckCircle', ordre: 1 },
          { id: 2, statut: 'EN_PREPARATION', libelleFr: 'En préparation', couleurBg: 'bg-orange-100', couleurText: 'text-orange-800', icone: 'ShoppingBag', ordre: 2 },
          { id: 3, statut: 'LIVRAISON', libelleFr: 'En livraison', couleurBg: 'bg-green-100', couleurText: 'text-green-800', icone: 'Truck', ordre: 3 },
          { id: 4, statut: 'LIVREE', libelleFr: 'Livrée', couleurBg: 'bg-purple-100', couleurText: 'text-purple-800', icone: 'CheckCircle', ordre: 4 }
        ],
        categoryTranslations: [],
        sizeTranslations: []
      };
      this.configCache = defaultConfig;
      this.cacheTimestamp = now;
      return defaultConfig;
    }
  }

  async getOrderStatusConfig(): Promise<OrderStatusConfig[]> {
    const config = await this.getAllConfig();
    return config.orderStatuses || [];
  }

  async getCategoryTranslations(): Promise<CategoryTranslation[]> {
    const config = await this.getAllConfig();
    return config.categoryTranslations;
  }

  async getSizeTranslations(): Promise<SizeTranslation[]> {
    const config = await this.getAllConfig();
    return config.sizeTranslations;
  }

  // Méthodes utilitaires pour obtenir les traductions
  async getCategoryLabel(code: string): Promise<string> {
    const translations = await this.getCategoryTranslations();
    const translation = translations.find(t => t.code === code);
    return translation?.libelleFr || code;
  }

  async getSizeLabel(code: string): Promise<string> {
    const translations = await this.getSizeTranslations();
    const translation = translations.find(t => t.code === code);
    return translation?.libelleFr || code;
  }

  async getStatusConfig(statut: string): Promise<OrderStatusConfig | undefined> {
    const configs = await this.getOrderStatusConfig();
    return configs.find(c => c.statut === statut);
  }

  // Invalider le cache (utile après des mises à jour)
  invalidateCache() {
    this.configCache = null;
    this.cacheTimestamp = 0;
  }
}

export const configService = new ConfigService();




