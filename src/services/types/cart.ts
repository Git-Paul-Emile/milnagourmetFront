export interface CartResponse {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}