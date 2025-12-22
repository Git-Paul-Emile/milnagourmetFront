import { Order } from '@/types';
import { configService } from '@/services/configService';
import * as XLSX from 'xlsx';

// Cache pour les configurations de statuts
let statusConfigCache: Map<string, { color: string; text: string }> | null = null;

const loadStatusConfig = async () => {
  if (statusConfigCache) return statusConfigCache;

  try {
    const configs = await configService.getOrderStatusConfig();
    const cache = new Map<string, { color: string; text: string }>();
    
    // Mapper les statuts de l'enum vers les valeurs utilisées dans le frontend
    const statusMap: Record<string, string> = {
      'received': 'RECU',
      'preparing': 'EN_PREPARATION',
      'delivery': 'LIVRAISON',
      'delivered': 'LIVREE'
    };

    configs.forEach(config => {
      const frontendStatus = Object.keys(statusMap).find(
        key => statusMap[key] === config.statut
      );
      if (frontendStatus) {
        cache.set(frontendStatus, {
          color: `${config.couleurBg} ${config.couleurText}`,
          text: config.libelleFr
        });
      }
    });

    statusConfigCache = cache;
    return cache;
  } catch (error) {
    console.error('Erreur lors du chargement des configurations de statuts:', error);
    // Fallback vers les valeurs hardcodées en cas d'erreur
    const fallbackCache = new Map([
      ['received', { color: 'bg-blue-100 text-blue-800', text: 'Reçue' }],
      ['preparing', { color: 'bg-orange-100 text-orange-800', text: 'En préparation' }],
      ['delivery', { color: 'bg-green-100 text-green-800', text: 'En livraison' }],
      ['delivered', { color: 'bg-purple-100 text-purple-800', text: 'Livrée' }]
    ]);
    statusConfigCache = fallbackCache;
    return fallbackCache;
  }
};

export const getStatusColor = async (status: string) => {
  const cache = await loadStatusConfig();
  return cache.get(status)?.color || 'bg-gray-100 text-gray-800';
};

export const getStatusText = async (status: string) => {
  const cache = await loadStatusConfig();
  return cache.get(status)?.text || status;
};

// Versions synchrones avec cache (pour compatibilité)
export const getStatusColorSync = (status: string) => {
  if (!statusConfigCache) {
    // Si le cache n'est pas encore chargé, retourner une valeur par défaut
    // Le cache sera chargé au premier appel asynchrone
    const defaultColors: Record<string, string> = {
      'received': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'delivery': 'bg-green-100 text-green-800',
      'delivered': 'bg-purple-100 text-purple-800'
    };
    return defaultColors[status] || 'bg-gray-100 text-gray-800';
  }
  return statusConfigCache.get(status)?.color || 'bg-gray-100 text-gray-800';
};

export const getStatusTextSync = (status: string) => {
  if (!statusConfigCache) {
    const defaultTexts: Record<string, string> = {
      'received': 'Reçue',
      'preparing': 'En préparation',
      'delivery': 'En livraison',
      'delivered': 'Livrée'
    };
    return defaultTexts[status] || status;
  }
  return statusConfigCache.get(status)?.text || status;
};

export const exportToCSV = (filteredOrders: Order[]) => {
  const headers = [
    'ID Commande',
    'Client',
    'Telephone',
    'Zone de Livraison',
    'Date',
    'Statut',
    'Total',
    'Articles'
  ];

  const excelData = filteredOrders.map(order => [
    order.id.slice(-6),
    order.customer?.name || order.customerInfo?.name || 'Client anonyme',
    order.customer?.phone || order.customerInfo?.phone || '',
    order.deliveryZone?.name || order.deliveryLocation || '',
    new Date(order.date || order.createdAt || '').toLocaleDateString('fr-FR'),
    getStatusTextSync(order.status),
    order.total + ' FCFA',
    order.items.map(item => `${item.name} x${item.quantity}`).join('; ')
  ]);

  // Créer un workbook
  const wb = XLSX.utils.book_new();
  
  // Créer une worksheet avec les données
  const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData]);
  
  // Définir la largeur des colonnes
  ws['!cols'] = [
    { wch: 12 }, // ID Commande
    { wch: 20 }, // Client
    { wch: 15 }, // Telephone
    { wch: 20 }, // Zone de Livraison
    { wch: 12 }, // Date
    { wch: 15 }, // Statut
    { wch: 12 }, // Total
    { wch: 50 }  // Articles
  ];
  
  // Ajouter la worksheet au workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Commandes');
  
  // Générer le fichier Excel avec support UTF-8
  const excelBuffer = XLSX.write(wb, { 
    type: 'array', 
    bookType: 'xlsx',
    cellStyles: true
  });
  
  // Créer un blob avec le bon type MIME
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' 
  });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `commandes-${new Date().toISOString().split('T')[0]}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};