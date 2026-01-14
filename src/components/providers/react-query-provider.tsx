'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from '@/lib/get-query-client';

interface Props {
  client?: QueryClient;
  children: React.ReactNode;
}

export const ReactQueryProvider = ({ client, children }: Props) => {
  const queryClient = client ?? getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
