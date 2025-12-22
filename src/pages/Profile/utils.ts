import { DeliveryZone, Order } from '@/types';
import { configService } from '@/services/configService';

// Cache pour les configurations de statuts
let statusConfigCache: Map<string, { color: string; icon: string }> | null = null;

const loadStatusConfig = async () => {
  if (statusConfigCache) return statusConfigCache;

  try {
    const configs = await configService.getOrderStatusConfig();
    const cache = new Map<string, { color: string; icon: string }>();
    
    // Mapper les statuts de l'enum vers les valeurs utilisées dans le frontend
    const statusMap: Record<string, string> = {
      'pending': 'EN_ATTENTE',
      'confirmed': 'CONFIRMEE',
      'confirmee': 'CONFIRMEE',
      'preparing': 'EN_PREPARATION',
      'en_preparation': 'EN_PREPARATION',
      'ready': 'PRETE',
      'prete': 'PRETE',
      'delivered': 'LIVREE',
      'livree': 'LIVREE',
      'cancelled': 'ANNULEE',
      'annulee': 'ANNULEE'
    };

    configs.forEach(config => {
      Object.keys(statusMap).forEach(frontendStatus => {
        if (statusMap[frontendStatus] === config.statut) {
          cache.set(frontendStatus, {
            color: `${config.couleurBg} ${config.couleurText}`,
            icon: config.icone || 'XCircle'
          });
        }
      });
    });

    statusConfigCache = cache;
    return cache;
  } catch (error) {
    console.error('Erreur lors du chargement des configurations de statuts:', error);
    // Fallback vers les valeurs hardcodées en cas d'erreur
    const fallbackCache = new Map([
      ['delivered', { color: 'bg-green-100 text-green-800', icon: 'CheckCircle' }],
      ['livree', { color: 'bg-green-100 text-green-800', icon: 'CheckCircle' }],
      ['preparing', { color: 'bg-blue-100 text-blue-800', icon: 'ShoppingBag' }],
      ['en_preparation', { color: 'bg-blue-100 text-blue-800', icon: 'ShoppingBag' }],
      ['ready', { color: 'bg-yellow-100 text-yellow-800', icon: 'AlertTriangle' }],
      ['prete', { color: 'bg-yellow-100 text-yellow-800', icon: 'AlertTriangle' }],
      ['confirmed', { color: 'bg-purple-100 text-purple-800', icon: 'CheckCircle' }],
      ['confirmee', { color: 'bg-purple-100 text-purple-800', icon: 'CheckCircle' }]
    ]);
    statusConfigCache = fallbackCache;
    return fallbackCache;
  }
};

/**
 * Valide un mot de passe selon les règles métier
 */
export const validatePassword = (password: string): string => {
  if (password && password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
  return '';
};

/**
 * Valide la confirmation du mot de passe
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (password && !confirmPassword) return 'La confirmation du mot de passe est obligatoire';
  if (password && password !== confirmPassword) return 'Les mots de passe ne correspondent pas';
  return '';
};

/**
 * Formate une date selon le format français
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return 'Date inconnue';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Date invalide';

  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Formate une date courte pour l'affichage du membre depuis
 */
export const formatMemberSince = (date: string | Date): string => {
  if (!date) return 'Date inconnue';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Date invalide';

  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
};

/**
 * Retourne la classe CSS pour la couleur du statut de commande
 */
export const getStatusColor = (status: string): string => {
  if (!statusConfigCache) {
    // Si le cache n'est pas encore chargé, retourner une valeur par défaut
    // Le cache sera chargé au premier appel asynchrone
    const defaultColors: Record<string, string> = {
      'delivered': 'bg-green-100 text-green-800',
      'livree': 'bg-green-100 text-green-800',
      'preparing': 'bg-blue-100 text-blue-800',
      'en_preparation': 'bg-blue-100 text-blue-800',
      'ready': 'bg-yellow-100 text-yellow-800',
      'prete': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-purple-100 text-purple-800',
      'confirmee': 'bg-purple-100 text-purple-800'
    };
    return defaultColors[status] || 'bg-gray-100 text-gray-800';
  }
  return statusConfigCache.get(status)?.color || 'bg-gray-100 text-gray-800';
};

/**
 * Retourne l'icône appropriée pour le statut de commande
 */
export const getStatusIcon = (status: string): string => {
  if (!statusConfigCache) {
    const defaultIcons: Record<string, string> = {
      'delivered': 'CheckCircle',
      'livree': 'CheckCircle',
      'preparing': 'ShoppingBag',
      'en_preparation': 'ShoppingBag',
      'ready': 'AlertTriangle',
      'prete': 'AlertTriangle',
      'confirmed': 'CheckCircle',
      'confirmee': 'CheckCircle'
    };
    return defaultIcons[status] || 'XCircle';
  }
  return statusConfigCache.get(status)?.icon || 'XCircle';
};

// Initialiser le cache au chargement du module
loadStatusConfig();

/**
 * Filtre et trie les commandes selon les critères donnés
 */
export const filterAndSortOrders = (
  orders: Order[],
  searchTerm: string,
  sortBy: 'date' | 'total',
  sortOrder: 'asc' | 'desc'
): Order[] => {
  if (!orders) return [];

  return orders
    .filter(order => {
      // Par défaut, seulement les commandes confirmées et livrées
      if (order.status !== 'confirmee' && order.status !== 'livree') {
        return false;
      }

      // Filtre recherche par nom de produit
      if (searchTerm) {
        const hasMatchingProduct = order.items.some(item =>
          item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!hasMatchingProduct) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
};