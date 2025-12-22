import { orderService, productService, userService, siteService, creationService } from '@/services';
import { Order, Product, User, Customer, DeliveryZone, DeliveryPerson, StoreHours, ProductCategoryItem, CreationSize, CreationOptions } from '@/types';
import { calculateCustomersFromOrders } from '../utils/dashboardDataUtils';

export interface RawDashboardData {
  orders: Order[];
  products: Product[];
  allProductsForTab: Product[];
  users: User[];
  customers: Customer[];
  deliveryZones: DeliveryZone[];
  deliveryPersons: DeliveryPerson[];
  storeHours: StoreHours[];
  productCategories: ProductCategoryItem[];
  creationSizes: CreationSize[];
  creationOptions: CreationOptions;
}

export async function loadDashboardData(): Promise<RawDashboardData> {
  const [
    ordersData,
    productsData,
    usersData,
    zonesData,
    deliveryPersonsData,
    storeHoursData,
    categoriesData,
    creationSizesData,
    creationOptionsData
  ] = await Promise.all([
    orderService.getOrders(),
    productService.getProducts(),
    userService.getUsers(),
    userService.getDeliveryZones(),
    userService.getDeliveryPersons(),
    siteService.getStoreHours(),
    productService.getProductCategories(),
    creationService.getCreationSizes(),
    creationService.getCreationOptions()
  ]);

  const productsArray: Product[] = (productsData?.data ?? productsData ?? []) as Product[];
  const activeProducts = productsArray.filter((product) => !product.archived);
  const orders: Order[] = (ordersData?.data ?? ordersData ?? []) as Order[];
  const customers = calculateCustomersFromOrders(orders);

  // Store categories in localStorage
  localStorage.setItem('milna-product-categories', JSON.stringify(categoriesData));

  return {
    orders,
    products: activeProducts,
    allProductsForTab: productsArray,
    users: (usersData?.data ?? usersData ?? []) as User[],
    customers,
    deliveryZones: (zonesData?.data ?? zonesData ?? []) as DeliveryZone[],
    deliveryPersons: (deliveryPersonsData?.data ?? deliveryPersonsData ?? []) as DeliveryPerson[],
    storeHours: (storeHoursData?.data ?? storeHoursData ?? []) as StoreHours[],
    productCategories: (categoriesData?.data ?? categoriesData ?? []) as ProductCategoryItem[],
    creationSizes: (creationSizesData?.data ?? creationSizesData ?? []) as CreationSize[],
    creationOptions: (creationOptionsData?.data ?? creationOptionsData ?? { fruits: [], sauces: [], cereales: [] }) as CreationOptions,
  };
}