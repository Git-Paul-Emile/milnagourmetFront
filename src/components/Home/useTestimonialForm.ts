import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/useApp';
import { siteService } from '@/services';
import { TestimonialFormData } from './types';
import { TESTIMONIAL_CONSTANTS } from './constants';
import { validateImageFile } from './imageUtils';
import { DEFAULT_AVATAR_TOAST_IMAGE } from '@/constants/media';

const INITIAL_FORM: TestimonialFormData = {
  name: '',
  location: '',
  rating: TESTIMONIAL_CONSTANTS.DEFAULT_RATING,
  comment: '',
  avatar: '',
};

export const useTestimonialForm = (onSuccess: () => void, onClose: () => void) => {
  const { dispatch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<TestimonialFormData>(INITIAL_FORM);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarToast, setAvatarToast] = useState<string>(DEFAULT_AVATAR_TOAST_IMAGE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    siteService.getAvatarToast()
      .then((res) => setAvatarToast((res.data as { image: string }).image))
      .catch(() => { /* garder le fallback */ });
  }, []);

  const handleInputChange = (field: keyof TestimonialFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: validation.error!, avatar: avatarToast } });
      return;
    }

    try {
      const uploadResponse = await siteService.uploadTestimonialImage(file);
      const imagePath = (uploadResponse.data as { path: string }).path;
      setFormData(prev => ({ ...prev, avatar: imagePath }));
      setAvatarPreview(imagePath);
    } catch {
      dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: "Erreur lors de l'upload de l'image.", avatar: avatarToast } });
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    setAvatarPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setAvatarPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.location.trim() || !formData.comment.trim()) {
      dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: 'Veuillez remplir tous les champs obligatoires.', avatar: avatarToast } });
      return;
    }

    setIsSubmitting(true);
    try {
      await siteService.createTestimonial({
        name: formData.name,
        location: formData.location,
        rating: formData.rating,
        comment: formData.comment,
        avatar: formData.avatar || undefined,
      });

      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          message: 'Votre témoignage a bien été envoyé ! Il sera publié après vérification par un administrateur.',
          avatar: avatarToast,
        },
      });

      resetForm();
      onSuccess();
      onClose();
    } catch {
      dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: "Erreur lors de l'ajout du témoignage. Veuillez réessayer.", avatar: avatarToast } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, avatarPreview, isSubmitting, fileInputRef, handleInputChange, handleFileSelect, removeAvatar, handleSubmit, resetForm };
};