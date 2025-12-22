// Types communs

export interface StoreHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  avatar?: string;
}