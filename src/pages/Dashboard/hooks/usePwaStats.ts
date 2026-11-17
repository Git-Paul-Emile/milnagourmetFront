import { useQuery } from '@tanstack/react-query';
import { pwaService } from '@/services/pwaService';
import { queryKeys } from '@/lib/queryClient';

export function usePwaStats() {
  return useQuery({
    queryKey: queryKeys.pwaStats,
    queryFn: () => pwaService.getStats(),
    staleTime: 60_000,
  });
}
