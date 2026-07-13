import { useState, useEffect } from 'react';
import { siteService } from '@/services';
import { DEFAULT_AVATAR_TOAST_IMAGE } from '@/constants/media';

export const useAvatarToast = () => {
  const [avatarToast, setAvatarToast] = useState<string>(DEFAULT_AVATAR_TOAST_IMAGE);

  useEffect(() => {
    const fetchAvatarToast = async () => {
      try {
        const response = await siteService.getAvatarToast();
        const image = (response.data as { image: string }).image;
        // L'avatar ne doit jamais être chargé depuis un CDN externe (Cloudinary) : fallback local
        if (image && !image.includes('cloudinary')) {
          setAvatarToast(image);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'avatar toast:', error);
        // Garder le fallback
      }
    };
    fetchAvatarToast();
  }, []);

  return avatarToast;
};