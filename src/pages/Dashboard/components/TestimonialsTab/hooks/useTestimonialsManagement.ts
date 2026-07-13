import { useState, useEffect } from 'react';
import { Testimonial } from '@/types';
import { siteService } from '@/services/siteService';
import { useApp } from '@/contexts/useApp';

interface TestimonialFormData {
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  active: boolean;
}

interface FieldErrors {
  name?: string;
  location?: string;
  comment?: string;
}

const emptyFormData: TestimonialFormData = {
  name: '',
  location: '',
  rating: 5,
  comment: '',
  avatar: '',
  active: false
};

export function useTestimonialsManagement(displaySuccessToast: (message: string) => void) {
  const { dispatch } = useApp();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>(emptyFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const displayErrorToast = (message: string) => {
    dispatch({
      type: 'ADD_TOAST',
      payload: { id: Date.now().toString(), type: 'error', message }
    });
  };

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const response = await siteService.getAllTestimonials();
      setTestimonials(response.data as Testimonial[]);
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
      displayErrorToast('Erreur lors du chargement des témoignages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleToggleActive = async (testimonial: Testimonial) => {
    try {
      await siteService.updateTestimonial(testimonial.id, {
        active: !testimonial.active
      });
      displaySuccessToast(`Témoignage ${!testimonial.active ? 'activé' : 'désactivé'}`);
      loadTestimonials();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du témoignage:', error);
      displayErrorToast('Erreur lors de la mise à jour du témoignage');
    }
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Le nom est obligatoire';
    }
    if (!formData.location.trim()) {
      errors.location = 'Le lieu est obligatoire';
    }
    if (!formData.comment.trim()) {
      errors.comment = 'Le commentaire est obligatoire';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof TestimonialFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await siteService.createTestimonial(formData);
      displaySuccessToast('Témoignage ajouté avec succès');
      setFormData(emptyFormData);
      setShowAddForm(false);
      loadTestimonials();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du témoignage:', error);
      displayErrorToast(error instanceof Error ? error.message : 'Erreur lors de l\'ajout du témoignage');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const response = await siteService.uploadTestimonialImage(file);
      const data = response.data as { path: string; filename: string };
      setFormData(prev => ({ ...prev, avatar: data.path }));
      displaySuccessToast('Image téléchargée avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      displayErrorToast('Erreur lors du téléchargement de l\'image');
    }
  };

  return {
    testimonials,
    loading,
    showAddForm,
    setShowAddForm,
    formData,
    fieldErrors,
    submitting,
    handleToggleActive,
    handleInputChange,
    handleSubmit,
    handleAvatarUpload
  };
}
