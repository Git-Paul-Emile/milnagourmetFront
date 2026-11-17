import { useQuery } from '@tanstack/react-query';
import { siteService } from '@/services';
import { ContactInfo, SocialMedia } from '@/types';
import { queryKeys } from '@/lib/queryClient';

export function useFooterData() {
  const contact = useQuery({
    queryKey: queryKeys.contactInfo,
    queryFn: async () => (await siteService.getContactInfo()).data as ContactInfo ?? null,
  });

  const social = useQuery({
    queryKey: queryKeys.socialMedia,
    queryFn: async () => (await siteService.getSocialMedia()).data as SocialMedia ?? null,
  });

  return {
    contactInfo: contact.data ?? null,
    socialMedia: social.data ?? null,
    loading: contact.isPending || social.isPending,
  };
}
