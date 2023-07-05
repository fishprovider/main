import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import localforage from 'localforage';
import type { ReactNode } from 'react';

import QueryClient from './QueryClient';

const reactQueryCacheKey = 'reactQueryFp';

const persister: Persister = {
  persistClient: async (client: PersistedClient) => {
    await localforage.setItem(reactQueryCacheKey, client);
  },
  restoreClient: async () => {
    const client = await localforage.getItem<PersistedClient>(reactQueryCacheKey);
    return client || undefined;
  },
  removeClient: () => localforage.removeItem(reactQueryCacheKey),
};

function QueryProvider({
  children,
  withDevTools = true,
}: {
  children: ReactNode,
  withDevTools?: boolean,
}) {
  return (
    <PersistQueryClientProvider
      client={QueryClient}
      persistOptions={{ persister }}
    >
      {children}
      {withDevTools && <ReactQueryDevtools />}
    </PersistQueryClientProvider>
  );
}

export default QueryProvider;
