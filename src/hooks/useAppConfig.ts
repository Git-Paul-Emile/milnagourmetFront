import { useQuery } from '@tanstack/react-query';
import { configService } from '@/services/configService';
import { queryKeys } from '@/lib/queryClient';

export function useAppConfig() {
  const { data, isPending, error } = useQuery({
    queryKey: queryKeys.appConfig,
    queryFn: () => configService.getAllConfig(),
  });

  return { config: data ?? null, loading: isPending, error };
}
