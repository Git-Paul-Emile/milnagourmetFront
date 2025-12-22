import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/useApp';
import { AuthUser, User } from '@/types';

interface SettingsTabProps {
  user: AuthUser;
  onClose: () => void;
}

export function SettingsTab({ user, onClose }: SettingsTabProps) {
  const { dispatch } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    // Supprimer l'utilisateur du localStorage
    const existingUsers: User[] = JSON.parse(localStorage.getItem('milna-users') || '[]');
    const filteredUsers = existingUsers.filter((u: User) => u.id !== user.id);
    localStorage.setItem('milna-users', JSON.stringify(filteredUsers));

    // Déconnecter l'utilisateur
    dispatch({ type: 'SET_USER', payload: null });

    dispatch({
      type: 'ADD_TOAST',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        message: 'Votre compte a été supprimé avec succès'
      }
    });

    onClose();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Paramètres du compte</h3>

      <div className="space-y-4">
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900">Zone de danger</h4>
              <p className="text-sm text-red-700 mt-1">
                La suppression de votre compte est irréversible. Toutes vos données seront perdues.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer mon compte
                </button>
              ) : (
                <div className="mt-3 space-y-3">
                  <p className="text-sm font-medium text-red-900">
                    Êtes-vous sûr de vouloir supprimer votre compte ?
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Oui, supprimer</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}