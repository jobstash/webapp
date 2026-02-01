'use client';

import { useQuery } from '@tanstack/react-query';

interface EligibilityResponse {
  apiToken: string | null;
  isExpert: boolean | null;
}

// Lightweight session check (no Privy dependency required).
// Separate from useSession which manages full auth lifecycle.
const fetchEligibility = async (): Promise<EligibilityResponse> => {
  const res = await fetch('/api/auth/session');
  if (!res.ok) throw new Error(`GET /api/auth/session failed: ${res.status}`);
  return (await res.json()) as EligibilityResponse;
};

export const useEligibility = () => {
  const { data, isPending } = useQuery({
    queryKey: ['session-status'],
    queryFn: fetchEligibility,
    staleTime: 5 * 60 * 1000,
  });

  return {
    isAuthenticated: !!data?.apiToken,
    isExpert: data?.isExpert ?? null,
    isLoading: isPending,
  };
};
