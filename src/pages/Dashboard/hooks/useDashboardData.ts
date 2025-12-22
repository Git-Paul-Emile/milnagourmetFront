import { useReducer, useEffect, useCallback } from 'react';
import { DashboardDataState, initialDashboardDataState, dashboardDataReducer, DashboardDataAction } from './dashboardDataState';
import { loadDashboardData as loadData } from './dashboardDataLoader';
import { Order, Product, User, Customer, DeliveryZone, DeliveryPerson, StoreHours, ProductCategoryItem, CreationSize, CreationOptions } from '@/types';

export function useDashboardData() {
  const [state, dispatch] = useReducer(dashboardDataReducer, initialDashboardDataState);

  const loadDashboardData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await loadData();
      dispatch({ type: 'LOAD_DATA', payload: data });
    } catch (error) {
      console.error('Erreur lors du chargement des données du dashboard:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Setters
  const setOrders = useCallback((orders: Order[]) => {
    dispatch({ type: 'SET_ORDERS', payload: orders });
  }, []);

  const setProducts = useCallback((products: Product[]) => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
  }, []);

  const setUsers = useCallback((users: User[]) => {
    dispatch({ type: 'SET_USERS', payload: users });
  }, []);

  const setCustomers = useCallback((customers: Customer[]) => {
    dispatch({ type: 'SET_CUSTOMERS', payload: customers });
  }, []);

  const setDeliveryZones = useCallback((deliveryZones: DeliveryZone[]) => {
    dispatch({ type: 'SET_DELIVERY_ZONES', payload: deliveryZones });
  }, []);

  const setDeliveryPersons = useCallback((deliveryPersons: DeliveryPerson[]) => {
    dispatch({ type: 'SET_DELIVERY_PERSONS', payload: deliveryPersons });
  }, []);

  const setStoreHours = useCallback((storeHours: StoreHours[]) => {
    dispatch({ type: 'SET_STORE_HOURS', payload: storeHours });
  }, []);

  const setProductCategories = useCallback((productCategories: ProductCategoryItem[]) => {
    dispatch({ type: 'SET_PRODUCT_CATEGORIES', payload: productCategories });
  }, []);

  const setCreationSizes = useCallback((creationSizes: CreationSize[]) => {
    dispatch({ type: 'SET_CREATION_SIZES', payload: creationSizes });
  }, []);

  const setCreationOptions = useCallback((creationOptions: CreationOptions) => {
    dispatch({ type: 'SET_CREATION_OPTIONS', payload: creationOptions });
  }, []);

  return {
    ...state,
    loadDashboardData,
    setOrders,
    setProducts,
    setUsers,
    setCustomers,
    setDeliveryZones,
    setDeliveryPersons,
    setStoreHours,
    setProductCategories,
    setCreationSizes,
    setCreationOptions,
  };
}