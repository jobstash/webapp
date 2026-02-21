'use client';

import { useQuery } from '@tanstack/react-query';

interface EligibilityResponse {
  apiToken: string | null;
  isExpert: boolean | null;
  displayName: string | null;
  identityType: string | null;
}

export const ELIGIBILITY_KEY = ['session-status'];

const fetchEligibility = async (): Promise<EligibilityResponse> => {
  const res = await fetch('/api/auth/session');
  if (!res.ok) throw new Error(`GET /api/auth/session failed: ${res.status}`);
  return (await res.json()) as EligibilityResponse;
};

export const useEligibility = () => {
  const { data, isPending } = useQuery({
    queryKey: ELIGIBILITY_KEY,
    queryFn: fetchEligibility,
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
