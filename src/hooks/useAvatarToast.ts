import { useState, useEffect } from 'react';
import { siteService } from '@/services';

const AVATAR_TOAST_FALLBACK = '/uploads/avatarToast/milna-owner.jpg';

export const useAvatarToast = () => {
  const [avatarToast, setAvatarToast] = useState<string>(AVATAR_TOAST_FALLBACK);

  useEffect(() => {
    const fetchAvatarToast = async () => {
      try {
        const response = await siteService.getAvatarToast();
        setAvatarToast((response.data as { image: string }).image);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'avatar toast:', error);
        // Garder le fallback
      }
    };
    fetchAvatarToast();
  }, []);

  return `${import.meta.env.VITE_API_URL}${avatarToast}`;
};