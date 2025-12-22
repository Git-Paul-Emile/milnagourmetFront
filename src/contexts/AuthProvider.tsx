import React, { useReducer, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { AuthUser, AuthContextType } from '@/types';
import { httpClient, authService } from '@/services';
import { useApp } from './useApp';
import { authReducer, initialState, AuthAction } from './authReducer';
import { useAuthActions } from './authActions';

// Hook personnalisé pour l'initialisation de l'authentification
function useAuthInitialization(state: typeof initialState, dispatch: React.Dispatch<AuthAction>, refreshToken: () => Promise<void>) {
  // Écouter les événements de rafraîchissement du token depuis le service API
  useEffect(() => {
    const handleTokenRefreshed = async (event: CustomEvent) => {
      const { accessToken } = event.detail;
      dispatch({ type: 'SET_TOKEN', payload: accessToken });

      // Si on n'a pas les infos utilisateur, les récupérer
      if (!state.user) {
        try {
          const userResponse = await authService.getProfile();
          dispatch({ type: 'SET_USER', payload: userResponse.data });
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          // En cas d'erreur, déconnecter
          httpClient.setAccessToken(null);
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    const handleAuthError = () => {
      httpClient.setAccessToken(null);
      dispatch({ type: 'LOGOUT' });
      // Notify other contexts
      window.dispatchEvent(new CustomEvent('authLogout'));
    };

    window.addEventListener('tokenRefreshed', handleTokenRefreshed as EventListener);
    window.addEventListener('authError', handleAuthError);

    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed as EventListener);
      window.removeEventListener('authError', handleAuthError);
    };
  }, [state.user, dispatch]);

  // Initialisation - essayer de rafraîchir le token au démarrage seulement si un token est stocké
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        // Essayer de rafraîchir le token (refresh token devrait être dans le cookie httpOnly)
        try {
          await refreshToken();
        } catch (error) {
          // Si le refresh échoue, nettoyer et considérer comme non connecté
          httpClient.setAccessToken(null);
          dispatch({ type: 'LOGOUT' });
          // Notifier les autres contexts
          window.dispatchEvent(new CustomEvent('authLogout'));
        }
      } else {
        // Pas de token stocké, considérer comme non connecté
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    };

    initializeAuth();
  }, [refreshToken, dispatch]);
}

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { dispatch: appDispatch } = useApp();

  const actions = useAuthActions(state, dispatch, appDispatch);

  useAuthInitialization(state, dispatch, actions.refreshToken);

  const contextValue: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login: actions.login,
    register: actions.register,
    logout: actions.logout,
    logoutAll: actions.logoutAll,
    refreshToken: actions.refreshToken,
    updateUser: actions.updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}