import { QueryClient as ReactQueryClient } from '@tanstack/react-query';

const QueryClient = new ReactQueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      cacheTime: 1000 * 60 * 60 * 24 * 7, // 7d
      refetchInterval: 1000 * 60, // 1m
      refetchOnWindowFocus: false,
    },
  },
});

export default QueryClient;
