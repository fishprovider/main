import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

import QueryClient from './QueryClient';

function QueryProvider({
  children,
  withDevTools = true,
}: {
  children: ReactNode,
  withDevTools?: boolean,
}) {
  return (
    <QueryClientProvider client={QueryClient}>
      {children}
      {withDevTools && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default QueryProvider;
