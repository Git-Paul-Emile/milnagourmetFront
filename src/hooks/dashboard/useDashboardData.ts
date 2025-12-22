import { useState, useEffect } from 'react';
import { Order, Product, User as UserType, Customer, StoreHours, ProductCategoryItem, CreationSize, CreationOptions, DashboardStats } from '@/types';
import { DeliveryZone, DeliveryPerson } from '@/types/dashboard';
import { calculateCustomersFromOrders, calculateDashboardStats } from '@/utils/dashboard/statsCalculations';
import { useDeliveryZones } from './useDeliveryZones';
import { useDeliveryPersons } from './useDeliveryPersons';
import { useProductCategories } from './useProductCategories';
import { useCreationOptions } from './useCreationOptions';
import { useCreationSizes } from './useCreationSizes';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import { creationService } from '@/services/creationService';
import { deliveryZoneService } from '@/services/deliveryZone';
import { deliveryPersonService } from '@/services/deliveryPerson';
import { ApiResponse } from '@/services/httpClient';

export interface DashboardData {
  orders: Order[];
  products: Product[];
  users: UserType[];
  customers: Customer[];
  deliveryZones: DeliveryZone[];
  deliveryPersons: DeliveryPerson[];
  allProductsForTab: Product[];
  stats: DashboardStats;
  loading: boolean;
  loadDashboardData: () => Promise<void>;
}

export const useDashboardData = (): DashboardData => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [allProductsForTab, setAllProductsForTab] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    todayOrders: 0,
    todayRevenue: 0,
    weekOrders: 0,
    weekRevenue: 0,
    monthOrders: 0,
    monthRevenue: 0,
    activeCustomers: 0,
    bestSellingProducts: [],
    topFruits: [],
    topSauces: [],
    topCereales: [],
    salesData: [],
    categoryData: [],
    sizeData: [],
    orderStatusData: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  // Utilisation des hooks personnalisés
  const deliveryZonesHook = useDeliveryZones();
  const deliveryPersonsHook = useDeliveryPersons(deliveryZonesHook.deliveryZones.map(z => ({ id: z.id, name: z.name })));
  const productCategoriesHook = useProductCategories();
  const creationOptionsHook = useCreationOptions();
  const creationSizesHook = useCreationSizes();

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Charger les données depuis l'API
      const [ordersResponse, productsResponse, usersResponse, deliveryZonesResponse, deliveryPersonsResponse] = await Promise.all([
        orderService.getOrders(),
        productService.getProducts(),
        userService.getUsers(),
        deliveryZoneService.getAllWithOrderCounts(),
        deliveryPersonService.getAll()
      ]);

      const ordersFromAPI: Order[] = (ordersResponse as ApiResponse<Order[]>).data || [];
      const productsFromAPI: Product[] = (productsResponse as ApiResponse<Product[]>).data || [];
      const usersFromAPI: UserType[] = (usersResponse as ApiResponse<UserType[]>).data || [];
      // deliveryZoneService.getAllWithOrderCounts() retourne déjà response.data, pas un ApiResponse
      const deliveryZonesFromAPI: DeliveryZone[] = Array.isArray(deliveryZonesResponse) 
        ? deliveryZonesResponse 
        : ((deliveryZonesResponse as ApiResponse<DeliveryZone[]>)?.data || []);
      const deliveryPersonsFromAPI: DeliveryPerson[] = (deliveryPersonsResponse as ApiResponse<DeliveryPerson[]>).data || [];
      
      
      const storeHoursFromAPI: StoreHours[] = [];
      const productCategoriesFromAPI: ProductCategoryItem[] = [];

      // Charger les tailles de création depuis l'API
      const creationSizesResponse = await creationService.getCreationSizes();
      const creationSizesFromAPI: CreationSize[] = (creationSizesResponse as ApiResponse<CreationSize[]>).data || [];

      const creationOptionsFromAPI: CreationOptions = {
        fruits: [],
        sauces: [],
        cereales: []
      };

      // Filtrer les produits archivés pour le dashboard
      const activeProducts = productsFromAPI.filter(product => !product.archived);

      // Séparer les utilisateurs normaux de l'admin
      const regularUsers = usersFromAPI.filter(user => user.role !== 'admin');

      setOrders(ordersFromAPI);
      setProducts(activeProducts);
      setAllProductsForTab(productsFromAPI);
      setUsers(regularUsers);
      setDeliveryZones(deliveryZonesFromAPI);
      deliveryZonesHook.setDeliveryZones(deliveryZonesFromAPI);
      deliveryPersonsHook.setDeliveryPersons(deliveryPersonsFromAPI);
      setDeliveryPersons(deliveryPersonsFromAPI); // Add this for the state
      // Note: storeHours pourrait être géré séparément
      productCategoriesHook.setProductCategories(productCategoriesFromAPI);
      creationSizesHook.setCreationSizes(creationSizesFromAPI);
      creationOptionsHook.setCreationOptions(creationOptionsFromAPI);

      // Calculer les données clients à partir des commandes
      const customersData = calculateCustomersFromOrders(ordersFromAPI);
      setCustomers(customersData);

      // Calculer les statistiques (maintenant asynchrone pour calculer dynamiquement depuis la base de données)
      const calculatedStats = await calculateDashboardStats(ordersFromAPI, productsFromAPI, usersFromAPI);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Erreur lors du chargement des données du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    orders,
    products,
    users,
    customers,
    deliveryZones,
    deliveryPersons,
    allProductsForTab,
    stats,
    loading,
    loadDashboardData
  };
};