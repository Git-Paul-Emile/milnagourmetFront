import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { siteService } from '@/services';
import { Testimonial } from '@/types';
import { queryKeys } from '@/lib/queryClient';

const AUCUN_TEMOIGNAGE: Testimonial[] = [];

export function useTestimonials() {
  const { data, isPending, refetch } = useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: async () => (await siteService.getTestimonials()).data as Testimonial[] ?? [],
  });

  const reloadTestimonials = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    testimonials: data ?? AUCUN_TEMOIGNAGE,
    loading: isPending,
    reloadTestimonials,
  };
}
