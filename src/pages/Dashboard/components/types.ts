import { Order, Product } from '@/types';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
  todayOrders: number;
  todayRevenue: number;
  weekOrders: number;
  weekRevenue: number;
  monthOrders: number;
  monthRevenue: number;
  activeCustomers: number;
  bestSellingProducts: Array<{ product: Product; totalSold: number; revenue: number }>;
  topFruits: Array<{ name: string; count: number }>;
  topSauces: Array<{ name: string; count: number }>;
  topCereales: Array<{ name: string; count: number }>;
  salesData: Array<{ date: string; revenue: number; orders: number }>;
  categoryData: Array<{ category: string; count: number; revenue: number }>;
  sizeData: Array<{ size: string; count: number; revenue: number }>;
  orderStatusData: Array<{ status: string; count: number }>;
  recentOrders: Order[];
  // Trends calculés dynamiquement
  ordersTrend?: string;
  revenueTrend?: string;
  customersTrend?: string;
}

export interface OverviewTabProps {
  stats: DashboardStats;
  setActiveTab: (tab: 'overview' | 'orders' | 'products' | 'users' | 'customers' | 'analytics' | 'delivery' | 'promotions' | 'settings') => void;
  setIsOrderManagementOpen: (open: boolean) => void;
}