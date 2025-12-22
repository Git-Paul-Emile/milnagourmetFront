// Types pour l'authentification JWT

import { ApiResponse } from './api';

export interface AuthUser {
  id: string;
  nomComplet: string;
  telephone: string;
  zoneLivraisonId: string | null;
  zoneLivraison: string | null; // Nom de la zone pour affichage
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  telephone: string;
  password: string;
  guestCart?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
}

export interface RegisterData {
  telephone: string;
  nomComplet: string;
  zoneLivraisonId: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  register: (data: RegisterData) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}