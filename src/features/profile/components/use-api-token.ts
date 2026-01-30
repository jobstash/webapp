'use client';

import { useQuery } from '@tanstack/react-query';
import { usePrivy } from '@privy-io/react-auth';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';

const checkWalletResponseSchema = z.object({
  token: z.string().min(1),
});

const fetchApiToken = async (
  getAccessToken: () => Promise<string | null>,
): Promise<string> => {
  const privyToken = await getAccessToken();
  if (!privyToken) {
    throw new Error('No Privy access token available');
  }

  const res = await fetch(`${clientEnv.MW_URL}/privy/check-wallet`, {
    headers: { Authorization: `Bearer ${privyToken}` },
  });

  if (!res.ok) {
    throw new Error(`check-wallet failed: ${res.status}`);
  }

  const json: unknown = await res.json();
  const parsed = checkWalletResponseSchema.parse(json);
  return parsed.token;
};

export const useApiToken = () => {
  const { ready, authenticated, getAccessToken } = usePrivy();

  const {
    data: apiToken,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['api-token'],
    queryFn: () => fetchApiToken(getAccessToken),
    enabled: ready && authenticated,
    staleTime: 50 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  return { apiToken: apiToken ?? null, isPending, isError, error };
};
