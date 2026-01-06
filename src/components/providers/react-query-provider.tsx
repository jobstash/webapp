'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from '@/lib/get-query-client';

interface Props extends React.PropsWithChildren {
  queryClient?: QueryClient;
}

export const ReactQueryProvider = ({ children, queryClient }: Props) => {
  const client = queryClient || getQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
