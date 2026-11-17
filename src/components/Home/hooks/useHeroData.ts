import { useQuery } from '@tanstack/react-query';
import { siteService } from '@/services';
import { HeroData } from '@/types';
import { queryKeys } from '@/lib/queryClient';

export function useHeroData() {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.hero,
    queryFn: async () => (await siteService.getHeroData()).data as HeroData,
  });

  return { heroData: data ?? null, loading: isPending };
}
