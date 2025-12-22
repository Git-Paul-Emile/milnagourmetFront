// Types pour le dashboard

import { Product } from './product';
import { Order } from './order';

export interface DeliveryZone {
  id: string;
  name: string;
  deliveryFee: number;
  estimatedTime: string; // ex: "30-45 min"
  active: boolean;
  orderCount?: number;
  totalRevenue?: number;
}

export interface DeliveryPerson {
  id: string;
  nomComplet: string;
  phone: string;
  vehicle: string; // ex: "Moto", "Voiture", "Vélo"
  active: boolean;
  createdAt: string;
}

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