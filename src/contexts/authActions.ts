import { useCallback } from 'react';
import { AuthUser, LoginCredentials, RegisterData, ApiResponse, AuthResponse } from '@/types';
import { AppAction } from '@/types/appState';
import { httpClient, authService } from '@/services';
import { AuthState, AuthAction } from './authReducer';
import { useAvatarToast } from '@/hooks/useAvatarToast';

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  register: (data: RegisterData) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}

export function useAuthActions(
  state: AuthState,
  dispatch: React.Dispatch<AuthAction>,
  appDispatch: React.Dispatch<AppAction>
): AuthActions {
  const avatarToast = useAvatarToast();
  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.login(credentials);

      dispatch({ type: 'SET_USER', payload: response.data!.user });
      dispatch({ type: 'SET_TOKEN', payload: response.data!.accessToken });

      // Mettre à jour le token dans le service API
      httpClient.setAccessToken(response.data!.accessToken);

      // Notifier les autres contexts (AppContext) que l'utilisateur a été mis à jour
      window.dispatchEvent(new CustomEvent('authUpdated', { detail: response.data!.user }));

      return response;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  // Register
  const register = useCallback(async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.register(data);

      dispatch({ type: 'SET_USER', payload: response.data!.user });
      dispatch({ type: 'SET_TOKEN', payload: response.data!.accessToken });

      // Mettre à jour le token dans le service API
      httpClient.setAccessToken(response.data!.accessToken);

      // Notifier les autres contexts (AppContext) que l'utilisateur a été mis à jour
      window.dispatchEvent(new CustomEvent('authUpdated', { detail: response.data!.user }));

      // Show success toast with the message from backend
      if (response.message) {
        appDispatch({
          type: 'ADD_TOAST',
          payload: {
            id: Date.now().toString(),
            type: 'success',
            message: response.message,
            avatar: '/src/assets/milna-owner.jpg'
          }
        });
      }
      return response;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [appDispatch, dispatch, avatarToast]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      httpClient.setAccessToken(null);
      dispatch({ type: 'LOGOUT' });
      // Vider le panier frontend lors de la déconnexion (sans toucher le backend)
      appDispatch({ type: 'CLEAR_CART_LOCAL' });
      // Notify other contexts
      window.dispatchEvent(new CustomEvent('authLogout'));
    }
  }, [appDispatch, dispatch]);

  // Logout all devices
  const logoutAll = useCallback(async () => {
    try {
      await authService.logoutAll();
    } catch (error) {
      console.error('Erreur lors de la déconnexion globale:', error);
    } finally {
      httpClient.setAccessToken(null);
      dispatch({ type: 'LOGOUT' });
      // Vider le panier frontend lors de la déconnexion (sans toucher le backend)
      appDispatch({ type: 'CLEAR_CART_LOCAL' });
      // Notify other contexts
      window.dispatchEvent(new CustomEvent('authLogout'));
    }
  }, [appDispatch, dispatch]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken();

      // Récupérer les informations utilisateur
      const userResponse = await authService.getProfile();

      dispatch({
        type: 'REFRESH_SUCCESS',
        payload: { user: userResponse.data!, accessToken: response.data!.accessToken }
      });

      // Notifier les autres contexts (AppContext) que l'utilisateur a été mis à jour
      window.dispatchEvent(new CustomEvent('authUpdated', { detail: userResponse.data! }));

      // Mettre à jour le token dans le service API
      httpClient.setAccessToken(response.data!.accessToken);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      httpClient.setAccessToken(null);
      dispatch({ type: 'LOGOUT' });
      // Notify other contexts
      window.dispatchEvent(new CustomEvent('authLogout'));
      throw error;
    }
  }, [dispatch]);

  // Update user information
  const updateUser = useCallback((user: AuthUser) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, [dispatch]);

  return {
    login,
    register,
    logout,
    logoutAll,
    refreshToken,
    updateUser,
  };
}