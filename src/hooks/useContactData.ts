import { useQuery } from '@tanstack/react-query';
import { siteService } from '@/services';
import { ContactSectionData } from '@/types';
import { queryKeys } from '@/lib/queryClient';

export function useContactData() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.contactSection,
    queryFn: async () => (await siteService.getContactSectionData()).data as ContactSectionData,
  });

  return {
    contactData: data ?? null,
    loading: isPending,
    error: isError ? 'Erreur lors du chargement des données' : null,
  };
}
