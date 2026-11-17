import { AuthUser, RefreshResponse } from '@/types';

// Métadonnées de pagination renvoyées par le backend quand une liste est paginée
// (présentes uniquement si `page`/`limit` ont été envoyés dans la requête)
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  status: string;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

// Construit une query string à partir d'un objet de paramètres, en ignorant les valeurs
// undefined/null/vides pour ne jamais envoyer de filtre "vide" au backend
export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

const INDICATEUR_SESSION = 'milna-session';
const ANCIENNE_CLE_JETON = 'accessToken';

// `localStorage` peut lever une exception (navigation privée, quota) :
// l'authentification ne doit pas en dépendre.
const lire = (cle: string) => {
  try { return localStorage.getItem(cle); } catch { return null; }
};
const ecrire = (cle: string, valeur: string) => {
  try { localStorage.setItem(cle, valeur); } catch { /* stockage indisponible */ }
};
const retirer = (cle: string) => {
  try { localStorage.removeItem(cle); } catch { /* stockage indisponible */ }
};

// Un 401 sur ces routes est une réponse métier, pas un jeton expiré.
const ROUTES_SANS_RENOUVELLEMENT = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];

// Classe pour gérer les requêtes HTTP avec gestion des tokens
export class HttpClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    // Utiliser la variable d'environnement VITE_API_URL
    // Si elle est vide (en mode développement via .env.development), l'URL relative sera utilisée pour le proxy
    this.baseURL = import.meta.env.VITE_API_URL || '';
    // Nettoyage : les versions précédentes stockaient le jeton ici.
    retirer(ANCIENNE_CLE_JETON);
  }

  /**
   * Le jeton d'accès vit UNIQUEMENT en mémoire.
   *
   * `localStorage` est lisible par tout script exécuté sur la page : une
   * seule faille XSS suffirait à voler le jeton. En mémoire, il disparaît
   * au rechargement — la session est alors rétablie par le refresh token,
   * qui est dans un cookie `httpOnly` inaccessible au JavaScript.
   *
   * On ne persiste qu'un simple indicateur (aucun secret) pour savoir, au
   * démarrage, s'il vaut la peine de tenter ce renouvellement.
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      ecrire(INDICATEUR_SESSION, '1');
    } else {
      retirer(INDICATEUR_SESSION);
    }
  }

  // Une session a-t-elle été ouverte sur ce navigateur ?
  hasSessionHint(): boolean {
    return lire(INDICATEUR_SESSION) === '1';
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

    // Ajouter le token d'accès (tenu en mémoire) s'il existe
    const headers = new Headers(options.headers);
    if (this.accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
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
    const renouvelable = !ROUTES_SANS_RENOUVELLEMENT.some((route) => endpoint.startsWith(route));
    if (response.status === 401 && this.accessToken && renouvelable) {
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