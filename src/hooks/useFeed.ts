import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../api/client';
import type { Post } from '../types';

export function useFeedQuery() {
  return useQuery<Post[]>({
    queryKey: ['feed'],
    queryFn: () => apiGet<Post[]>('/social/feed'),
    // Fallback to empty array if API not available (for development)
    retry: false,
  });
}

export function useExploreQuery() {
  return useQuery({
    queryKey: ['explore'],
    queryFn: async (): Promise<Post[]> => {
      // Mock data - replace with actual API call
      // return api.get<Post[]>('/social/explore');
      return [];
    },
  });
}

