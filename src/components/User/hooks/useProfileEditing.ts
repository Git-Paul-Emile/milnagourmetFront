import { useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { AuthUser } from '@/types';
import { validatePassword, validateConfirmPassword } from '../utils';

interface EditableUserData {
  name: string;
  phone: string;
  deliveryZoneId: string;
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export const useProfileEditing = (user: AuthUser | null) => {
  const { dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditableUserData>({
    name: user?.nomComplet || '',
    phone: user?.telephone || '',
    deliveryZoneId: user?.zoneLivraisonId || '',
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });

  const resetEditData = () => {
    if (user) {
      setEditData({
        name: user.nomComplet,
        phone: user.telephone,
        deliveryZoneId: user.zoneLivraisonId || '',
        currentPassword: '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  const handleSaveProfile = async () => {
    // Validation des champs principaux
    if (!editData.name.trim() || !editData.phone.trim() || !editData.deliveryZoneId) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: 'Tous les champs sont requis'
        }
      });
      return;
    }

    // Validation des mots de passe si fournis
    if (editData.password) {
      if (!editData.currentPassword) {
        dispatch({
          type: 'ADD_TOAST',
          payload: {
            id: Date.now().toString(),
            type: 'error',
            message: 'L\'ancien mot de passe est requis pour changer de mot de passe'
          }
        });
        return;
      }

      const passwordError = validatePassword(editData.password);
      if (passwordError) {
        dispatch({
          type: 'ADD_TOAST',
          payload: {
            id: Date.now().toString(),
            type: 'error',
            message: passwordError
          }
        });
        return;
      }

      const confirmError = validateConfirmPassword(editData.password, editData.confirmPassword);
      if (confirmError) {
        dispatch({
          type: 'ADD_TOAST',
          payload: {
            id: Date.now().toString(),
            type: 'error',
            message: confirmError
          }
        });
        return;
      }
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      // Préparer les données pour l'API
      const updateData: {
        nom: string;
        telephone: string;
        deliveryZoneId: string;
        motDePasse?: string;
        ancienMotDePasse?: string;
      } = {
        nom: editData.name.trim(),
        telephone: editData.phone.trim(),
        deliveryZoneId: editData.deliveryZoneId
      };

      if (editData.password) {
        updateData.motDePasse = editData.password;
        updateData.ancienMotDePasse = editData.currentPassword;
      }

      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header if needed
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du profil');
      }

      // Update state with the response data
      dispatch({ type: 'SET_USER', payload: data.data });
      setIsEditing(false);

      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          message: 'Vos informations ont été sauvegardées avec succès'
        }
      });
    } catch (error: unknown) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil'
        }
      });
    }
  };

  return {
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    resetEditData,
    handleSaveProfile
  };
};