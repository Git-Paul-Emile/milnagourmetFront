import { Order } from '@/types';
import { exportToCSV } from '../utils/utils';

export function useExport() {
  const handleExport = (orders: Order[]) => {
    exportToCSV(orders);
  };

  return { handleExport };
}