import { Order } from '@/types';
import { configService } from '@/services/configService';

export function calculateSalesData(orders: Order[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesData: Array<{ date: string; revenue: number; orders: number }> = [];

  // Filtrer les commandes valides (pas annulées et dans la période)
  const validOrders = orders.filter(order => {
    // Les statuts valides sont: 'recu', 'livree'
    // Les commandes annulées sont exclues des statistiques
    const validStatuses = ['recu', 'livree'];
    return validStatuses.includes(order.status.toLowerCase());
  });

  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];

    const dayOrders = validOrders.filter(order => {
      if (!order.date && !order.createdAt) return false;
      
      try {
        const orderDate = new Date(order.date || order.createdAt || '');
        if (isNaN(orderDate.getTime())) return false;
        
        orderDate.setHours(0, 0, 0, 0);
        const orderDateStr = orderDate.toISOString().split('T')[0];
        return orderDateStr === dateStr;
      } catch {
        return false;
      }
    });

    const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const dayOrderCount = dayOrders.length;

    salesData.push({
      date: dateStr,
      revenue: dayRevenue,
      orders: dayOrderCount
    });
  }

  return salesData;
}

export async function calculateCategoryData(orders: Order[]) {
  const categoryCount = new Map<string, { count: number; revenue: number }>();
  const validStatuses = ['recu', 'livree'];
  
  orders.forEach(order => {
    if (validStatuses.includes(order.status.toLowerCase())) {
      order.items.forEach(item => {
        const category = item.product?.category || 'autre';
        const existing = categoryCount.get(category) || { count: 0, revenue: 0 };
        existing.count += item.quantity;
        existing.revenue += item.price * item.quantity;
        categoryCount.set(category, existing);
      });
    }
  });

  // Récupérer les traductions depuis l'API
  const translations = await configService.getCategoryTranslations();
  const translationMap = new Map<string, string>();
  translations.forEach(t => {
    translationMap.set(t.code, t.libelleFr);
  });

  return Array.from(categoryCount.entries())
    .map(([category, data]) => ({
      category: translationMap.get(category) || category.charAt(0).toUpperCase() + category.slice(1),
      count: data.count,
      revenue: data.revenue
    }));
}

export async function calculateSizeData(orders: Order[]) {
  const sizeCount = new Map<string, { count: number; revenue: number }>();
  const validStatuses = ['recu', 'livree'];
  
  orders.forEach(order => {
    if (validStatuses.includes(order.status.toLowerCase())) {
      order.items.forEach(item => {
        if (item.product?.category === 'creation' && item.customCreation) {
          const size = item.customCreation.size.nom;
          const existing = sizeCount.get(size) || { count: 0, revenue: 0 };
          existing.count += item.quantity;
          existing.revenue += item.price * item.quantity;
          sizeCount.set(size, existing);
        }
      });
    }
  });

  // Récupérer les traductions depuis l'API
  const translations = await configService.getSizeTranslations();
  const translationMap = new Map<string, string>();
  translations.forEach(t => {
    translationMap.set(t.code, t.libelleFr);
  });

  return Array.from(sizeCount.entries())
    .map(([size, data]) => ({
      size: translationMap.get(size.toLowerCase()) || size.charAt(0).toUpperCase() + size.slice(1),
      count: data.count,
      revenue: data.revenue
    }));
}

export async function calculateOrderStatusData(orders: Order[]) {
  try {
    // Vérifier que les commandes sont bien passées
    if (!orders || orders.length === 0) {
      console.warn('[OrderStatusChart] ⚠️ Aucune commande fournie à calculateOrderStatusData');
      // Retourner quand même les statuts avec count 0 pour que le graphique s'affiche
      return [
        { status: 'Reçue', count: 0 },
        { status: 'Livrée', count: 0 },
        { status: 'Annulée', count: 0 }
      ];
    }

    // Récupérer les configurations de statuts depuis l'API
    const statusConfigs = await configService.getOrderStatusConfig();
    
    // Mapper les statuts de la config DB vers les statuts backend (en minuscules)
    // Le backend renvoie les statuts en minuscules : 'recu', 'livree', 'annulee'
    // Les configs de la DB utilisent : 'RECU', 'LIVREE', 'ANNULEE'
    // Mais les commandes peuvent avoir des statuts en majuscules ou minuscules
    const configToBackendMap: Record<string, string> = {
      'RECU': 'recu',
      'LIVREE': 'livree',
      'ANNULEE': 'annulee'
    };
    
    // Si aucune config n'est disponible, utiliser des valeurs par défaut
    if (!statusConfigs || statusConfigs.length === 0) {
      console.warn('[OrderStatusChart] Aucune configuration de statut trouvée, utilisation des valeurs par défaut');
      const defaultStatuses = [
        { statut: 'RECU', libelleFr: 'Reçue', ordre: 1 },
        { statut: 'LIVREE', libelleFr: 'Livrée', ordre: 2 },
        { statut: 'ANNULEE', libelleFr: 'Annulée', ordre: 3 }
      ];
      
      const result = defaultStatuses.map(config => {
        const backendStatus = configToBackendMap[config.statut];
        const count = backendStatus
          ? orders.filter(o => {
              if (!o.status) return false;
              const normalizedStatus = String(o.status).toLowerCase().trim();
              return normalizedStatus === backendStatus;
            }).length
          : 0;

        return {
          status: config.libelleFr,
          count
        };
      });

      return result;
    }

    const result = statusConfigs
      .sort((a, b) => a.ordre - b.ordre)
      .map(config => {
        // Trouver le statut backend correspondant à la config
        const backendStatus = configToBackendMap[config.statut];
        
        // Compter les commandes avec ce statut
        // Essayer plusieurs variantes pour être sûr de trouver les correspondances
        let count = 0;
        
        if (backendStatus) {
          count = orders.filter(o => {
            if (!o.status) {
              if (process.env.NODE_ENV === 'development') {
                console.warn(`[OrderStatusChart] Commande ${o.id} n'a pas de statut`);
              }
              return false;
            }
            
            // Normaliser le statut de la commande et comparer au statut backend (minuscules)
            const orderStatus = String(o.status).toLowerCase().trim();
            return orderStatus === backendStatus;
          }).length;
        }

        return {
          status: config.libelleFr,
          count
        };
      });

    const totalOrders = orders.length;
    const totalCounted = result.reduce((sum, item) => sum + item.count, 0);
    const unmatchedOrders = totalOrders - totalCounted;

    if (unmatchedOrders > 0 && orders.length > 0) {
      console.warn('[OrderStatusChart] ⚠️', unmatchedOrders, 'commandes non comptées');
    }

    return result;
  } catch (error) {
    console.error('Erreur lors du calcul des données de statut des commandes:', error);
    // En cas d'erreur, retourner un tableau avec des valeurs par défaut
    const defaultStatuses = [
      { statut: 'RECU', libelleFr: 'Reçue' },
      { statut: 'LIVREE', libelleFr: 'Livrée' },
      { statut: 'ANNULEE', libelleFr: 'Annulée' }
    ];

    const configToBackendMap: Record<string, string> = {
      'RECU': 'recu',
      'LIVREE': 'livree',
      'ANNULEE': 'annulee'
    };
    
    return defaultStatuses.map(config => {
      const backendStatus = configToBackendMap[config.statut];
      const count = backendStatus 
        ? orders.filter(o => {
            if (!o.status) return false;
            const normalizedStatus = String(o.status).toLowerCase().trim();
            return normalizedStatus === backendStatus;
          }).length 
        : 0;
      
      return {
        status: config.libelleFr,
        count
      };
    });
  }
}