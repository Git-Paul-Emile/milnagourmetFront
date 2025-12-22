import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/useApp';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { DeliveryZone, AuthUser } from '@/types';
import { deliveryZoneService } from '@/services/deliveryZone';
import { httpClient, authService } from '@/services';
import { validatePassword, validateConfirmPassword } from '@/pages/Profile/utils';
import { ProfileEditForm, ProfileState, UseProfileReturn } from '@/pages/Profile/types';

export const useProfile = (): UseProfileReturn => {
  const { state, dispatch } = useApp();
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [editForm, setEditForm] = useState<ProfileEditForm>({
    name: state.user?.nomComplet || '',
    phone: state.user?.telephone || '',
    deliveryZoneId: state.user?.zoneLivraisonId || '',
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });

  // Fetch delivery zones
  useEffect(() => {
    const fetchDeliveryZones = async () => {
      try {
        const zones = await deliveryZoneService.getAllActive();
        setDeliveryZones(zones as DeliveryZone[]);
      } catch (error) {
        console.error('Erreur lors du chargement des zones de livraison:', error);
        setDeliveryZones([]);
      }
    };

    fetchDeliveryZones();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: state.user?.nomComplet || '',
      phone: state.user?.telephone || '',
      deliveryZoneId: state.user?.zoneLivraisonId || '',
      currentPassword: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSave = async () => {
    if (!state.user) return;

    // Validation des mots de passe si fournis
    if (editForm.password) {
      if (!editForm.currentPassword) {
        dispatch({
          type: 'ADD_TOAST',
          payload: {
            id: Date.now().toString(),
            type: 'error',
            message: 'L\'ancien mot de passe est requis pour changer de mot de passe',
            avatar: '/src/assets/milna-owner.jpg'
          }
        });
        return;
      }

      const passwordError = validatePassword(editForm.password);
      if (passwordError) {
        dispatch({
          type: 'ADD_TOAST',
          payload: {
            id: Date.now().toString(),
            type: 'error',
            message: passwordError,
            avatar: '/src/assets/milna-owner.jpg'
          }
        });
        return;
      }

      const confirmError = validateConfirmPassword(editForm.password, editForm.confirmPassword);
      if (confirmError) {
        dispatch({
          type: 'ADD_TOAST',
          payload: {
            id: Date.now().toString(),
            type: 'error',
            message: confirmError,
            avatar: '/src/assets/milna-owner.jpg'
          }
        });
        return;
      }
    }

    // Validation de la zone de livraison
    if (!editForm.deliveryZoneId) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: 'La zone de livraison est obligatoire',
          avatar: '/src/assets/milna-owner.jpg'
        }
      });
      return;
    }

    try {
      // Préparer les données pour l'API
      const updateData: {
        nom: string;
        telephone: string;
        deliveryZoneId: string;
        motDePasse?: string;
        ancienMotDePasse?: string;
      } = {
        nom: editForm.name,
        telephone: editForm.phone,
        deliveryZoneId: editForm.deliveryZoneId
      };

      if (editForm.password) {
        updateData.motDePasse = editForm.password;
        updateData.ancienMotDePasse = editForm.currentPassword;
      }

      const response = await httpClient.put('/api/auth/profile', updateData);

      // The response data is AuthUser
      const userData = response.data as AuthUser;

      // Update AppContext with the new user data
      dispatch({ type: 'SET_USER', payload: userData });

      // Also update AuthContext to keep both contexts synchronized
      updateUser(userData);

      setIsEditing(false);

      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          message: 'Informations mises à jour avec succès !',
          avatar: '/src/assets/milna-owner.jpg'
        }
      });
    } catch (error: unknown) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil',
          avatar: '/src/assets/milna-owner.jpg'
        }
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();

      // Clear state
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'CLEAR_CART' });

      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          message: 'Votre compte a été supprimé. À bientôt !',
          avatar: '/src/assets/milna-owner.jpg'
        }
      });

      navigate('/');
    } catch (error: unknown) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: error instanceof Error ? error.message : 'Erreur lors de la suppression du compte',
          avatar: '/src/assets/milna-owner.jpg'
        }
      });
    }
  };

  const profileState: ProfileState = {
    isEditing,
    deliveryZones,
    editForm,
    ordersFilters: {
      searchTerm: '',
      sortBy: 'date',
      sortOrder: 'desc'
    },
    userOrders: [],
    ordersLoading: false
  };

  return {
    state: profileState,
    actions: {
      setIsEditing,
      setEditForm,
      setOrdersFilters: () => {}, // Will be handled by useOrders hook
      handleEdit,
      handleSave,
      handleCancel,
      handleDeleteAccount
    }
  };
};