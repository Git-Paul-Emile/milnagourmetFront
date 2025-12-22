import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/useApp';
import { siteService } from '@/services';
import { TestimonialFormData } from './types';
import { TESTIMONIAL_CONSTANTS } from './constants';
import { validateImageFile } from './imageUtils';

const AVATAR_TOAST_FALLBACK = '/uploads/avatarToast/milna-owner.jpg';

export const useTestimonialForm = (onSuccess: () => void, onClose: () => void) => {
  const { state, dispatch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    location: '',
    rating: TESTIMONIAL_CONSTANTS.DEFAULT_RATING,
    comment: '',
    avatar: ''
  });

  // Pré-remplir le nom si l'utilisateur est connecté
  useEffect(() => {
    if (state.user) {
      setFormData(prev => ({ ...prev, name: state.user!.nomComplet }));
    }
  }, [state.user]);

  // Récupérer l'avatar pour les toasts
  useEffect(() => {
    const fetchAvatarToast = async () => {
      try {
        const response = await siteService.getAvatarToast();
        const imageUrl = (response.data as { image: string }).image;
        console.log('Avatar toast récupéré:', imageUrl);
        setAvatarToast(imageUrl);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'avatar toast:', error);
        // Garder le fallback
      }
    };
    fetchAvatarToast();
  }, []);

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarToast, setAvatarToast] = useState<string>(AVATAR_TOAST_FALLBACK);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof TestimonialFormData, value: string | number) => {
    // Empêcher la modification du nom si l'utilisateur est connecté
    if (field === 'name' && state.user) {
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      const avatarUrl = `${import.meta.env.VITE_API_URL}${avatarToast}`;
      console.log('Toast avatar URL:', avatarUrl);
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: validation.error!,
          avatar: avatarUrl
        }
      });
      return;
    }

    try {
      // Upload de l'image vers le serveur
      const uploadResponse = await siteService.uploadTestimonialImage(file);
      const imagePath = (uploadResponse.data as { path: string }).path;

      setFormData(prev => ({ ...prev, avatar: imagePath }));
      setAvatarPreview(imagePath);
    } catch (error) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: 'Erreur lors de l\'upload de l\'image.',
          avatar: `${import.meta.env.VITE_API_URL}${avatarToast}`
        }
      });
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    setAvatarPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setFormData({
      name: state.user ? state.user.nomComplet : '',
      location: '',
      rating: TESTIMONIAL_CONSTANTS.DEFAULT_RATING,
      comment: '',
      avatar: ''
    });
    setAvatarPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.comment) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: 'Veuillez remplir tous les champs obligatoires.',
          avatar: `${import.meta.env.VITE_API_URL}${avatarToast}`
        }
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await siteService.createTestimonial({
        name: formData.name,
        location: formData.location,
        rating: formData.rating,
        comment: formData.comment,
        avatar: formData.avatar || undefined
      });

      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          message: 'Votre témoignage a été soumis avec succès !.',
          avatar: `${import.meta.env.VITE_API_URL}${avatarToast}`
        }
      });

      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          message: 'Erreur lors de l\'ajout du témoignage. Veuillez réessayer.',
          avatar: `${import.meta.env.VITE_API_URL}${avatarToast}`
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    avatarPreview,
    isSubmitting,
    fileInputRef,
    handleInputChange,
    handleFileSelect,
    removeAvatar,
    handleSubmit,
    resetForm
  };
};