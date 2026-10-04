import type { CartItem } from '@/types';

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
