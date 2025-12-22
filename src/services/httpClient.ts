import { AuthUser, RefreshResponse } from '@/types';

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  status: string;
  message: string;
  data?: T;
}

// Classe pour gérer les requêtes HTTP avec gestion des tokens
export class HttpClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    // Charger le token depuis localStorage au démarrage
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      this.accessToken = storedToken;
    }
  }

  // Définir le token d'accès
  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  // Vérifier si un token est disponible
  hasToken(): boolean {
    return !!this.accessToken;
  }

  // Fonction pour rafraîchir le token
  private async refreshAccessToken(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Pour envoyer les cookies
        });

        if (!response.ok) {
          throw new Error('Échec du rafraîchissement du token');
        }

        const data: ApiResponse<RefreshResponse> = await response.json();
        this.accessToken = data.data!.accessToken;

        // Notifier l'AuthContext du nouveau token
        window.dispatchEvent(new CustomEvent('tokenRefreshed', {
          detail: { accessToken: this.accessToken }
        }));

      } catch (error) {
        // En cas d'échec, déconnecter l'utilisateur
        window.dispatchEvent(new CustomEvent('authError'));
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  // Méthode principale pour faire des requêtes
  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Ajouter le token d'accès si disponible (toujours récupérer depuis localStorage pour être sûr)
    const headers = new Headers(options.headers);
    const currentToken = localStorage.getItem('accessToken');
    if (currentToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${currentToken}`);
    }
    // Ne pas définir Content-Type si le body est FormData (fetch le gère automatiquement)
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Pour envoyer les cookies automatiquement
    };

    let response = await fetch(url, config);

    // Si 401, essayer de rafraîchir le token
    if (response.status === 401 && this.accessToken) {
      try {
        await this.refreshAccessToken();

        // Retry avec le nouveau token
        const retryHeaders = new Headers(headers);
        if (this.accessToken) {
          retryHeaders.set('Authorization', `Bearer ${this.accessToken}`);
        }

        response = await fetch(url, {
          ...config,
          headers: retryHeaders,
        });
      } catch (refreshError) {
        // Si le refresh échoue, propager l'erreur originale
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Méthodes de commodité
  async get<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = unknown, D = unknown>(endpoint: string, data?: D): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = unknown, D = unknown>(endpoint: string, data?: D): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instance globale du client HTTP
export const httpClient = new HttpClient();