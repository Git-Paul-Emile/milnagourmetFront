import { Order, Product, User, Customer, DeliveryZone, DeliveryPerson, StoreHours, ProductCategoryItem, CreationSize, CreationOptions } from '@/types';

export interface DashboardDataState {
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
  loading: boolean;
}

export const initialDashboardDataState: DashboardDataState = {
  orders: [],
  products: [],
  allProductsForTab: [],
  users: [],
  customers: [],
  deliveryZones: [],
  deliveryPersons: [],
  storeHours: [],
  productCategories: [],
  creationSizes: [],
  creationOptions: {
    fruits: [],
    sauces: [],
    cereales: []
  },
  loading: true,
};

export type DashboardDataAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_ALL_PRODUCTS_FOR_TAB'; payload: Product[] }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'SET_DELIVERY_ZONES'; payload: DeliveryZone[] }
  | { type: 'SET_DELIVERY_PERSONS'; payload: DeliveryPerson[] }
  | { type: 'SET_STORE_HOURS'; payload: StoreHours[] }
  | { type: 'SET_PRODUCT_CATEGORIES'; payload: ProductCategoryItem[] }
  | { type: 'SET_CREATION_SIZES'; payload: CreationSize[] }
  | { type: 'SET_CREATION_OPTIONS'; payload: CreationOptions }
  | { type: 'LOAD_DATA'; payload: Omit<DashboardDataState, 'loading'> };

export function dashboardDataReducer(state: DashboardDataState, action: DashboardDataAction): DashboardDataState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_ALL_PRODUCTS_FOR_TAB':
      return { ...state, allProductsForTab: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'SET_DELIVERY_ZONES':
      return { ...state, deliveryZones: action.payload };
    case 'SET_DELIVERY_PERSONS':
      return { ...state, deliveryPersons: action.payload };
    case 'SET_STORE_HOURS':
      return { ...state, storeHours: action.payload };
    case 'SET_PRODUCT_CATEGORIES':
      return { ...state, productCategories: action.payload };
    case 'SET_CREATION_SIZES':
      return { ...state, creationSizes: action.payload };
    case 'SET_CREATION_OPTIONS':
      return { ...state, creationOptions: action.payload };
    case 'LOAD_DATA':
      return { ...state, ...action.payload, loading: false };
    default:
      return state;
  }
}