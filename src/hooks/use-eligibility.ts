'use client';

import { useQuery } from '@tanstack/react-query';

import { SESSION_KEY, fetchSession } from '@/features/auth/constants';

export const useEligibility = () => {
  const { data, isPending } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000,
  });

  return {
    isAuthenticated: !!data?.apiToken,
    isExpert: data?.isExpert ?? null,
    displayName: data?.displayName ?? null,
    identityType: data?.identityType ?? null,
    isLoading: isPending,
  };
};
