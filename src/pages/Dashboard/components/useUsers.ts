import { useState, useEffect } from 'react';
import { userService } from '@/services';
import { User as UserType } from '@/types';

export function useUsers() {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);

  const loadAllUsers = async () => {
    try {
      const usersData = await userService.getUsers();
      const usersArray = (usersData?.data ?? usersData ?? []) as UserType[];
      const regularUsers = usersArray.filter(user => user.role !== 'admin');
      setAllUsers(regularUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  useEffect(() => {
    loadAllUsers();
  }, []);

  const handleToggleBlock = async (
    userId: string,
    currentStatus: boolean,
    displaySuccessToast: (message: string) => void
  ) => {
    try {
      await userService.updateUser(userId, { blocked: !currentStatus });
      await loadAllUsers();
      displaySuccessToast(`Utilisateur ${!currentStatus ? 'bloqué' : 'débloqué'}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDeleteUser = (
    user: UserType,
    setDeleteModal: (open: React.SetStateAction<{ isOpen: boolean; item?: import("@/types").Product | UserType; type: "product" | "user"; }>) => void
  ) => {
    setDeleteModal({ isOpen: true, item: user, type: 'user' });
  };

  return {
    allUsers,
    loadAllUsers,
    handleToggleBlock,
    handleDeleteUser,
  };
}