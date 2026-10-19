import { useQuery } from '@tanstack/react-query';
import { pwaService } from '@/services/pwaService';

export function usePwaStats() {
  return useQuery({
    queryKey: ['pwa-stats'],
    queryFn: () => pwaService.getStats(),
    staleTime: 60_000,
  });
}
