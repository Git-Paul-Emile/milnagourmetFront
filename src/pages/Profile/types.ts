import { DeliveryZone, Order } from '@/types';

export interface ProfileEditForm {
  name: string;
  phone: string;
  deliveryZoneId: string;
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface OrdersFilters {
  searchTerm: string;
  sortBy: 'date' | 'total';
  sortOrder: 'asc' | 'desc';
}

export interface ProfileState {
  isEditing: boolean;
  deliveryZones: DeliveryZone[];
  editForm: ProfileEditForm;
  ordersFilters: OrdersFilters;
  userOrders: Order[];
  ordersLoading: boolean;
}

export interface UseProfileReturn {
  state: ProfileState;
  actions: {
    setIsEditing: (editing: boolean) => void;
    setEditForm: React.Dispatch<React.SetStateAction<ProfileEditForm>>;
    setOrdersFilters: React.Dispatch<React.SetStateAction<OrdersFilters>>;
    handleEdit: () => void;
    handleSave: () => Promise<void>;
    handleCancel: () => void;
    handleDeleteAccount: () => Promise<void>;
  };
}

export interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  filteredOrders: Order[];
  filters: OrdersFilters;
  setFilters: React.Dispatch<React.SetStateAction<OrdersFilters>>;
}