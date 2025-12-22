import { useState, useEffect, useCallback } from 'react';
import { siteService } from '@/services';
import { Testimonial } from '@/types';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTestimonials = useCallback(async () => {
    try {
      setLoading(true);

      const data = await siteService.getTestimonials();
      setTestimonials(data.data as Testimonial[]);
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  return {
    testimonials,
    loading,
    reloadTestimonials: loadTestimonials,
  };
}