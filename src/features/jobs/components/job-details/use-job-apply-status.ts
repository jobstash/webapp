'use client';

import { useQuery } from '@tanstack/react-query';

import {
  type ApplyStatusResponse,
  applyStatusResponseSchema,
} from '@/features/jobs/apply-schemas';
import { useEligibility } from '@/hooks/use-eligibility';

export const JOB_APPLY_STATUS_KEY = 'job-apply-status';

const fetchApplyStatus = async (
  shortUUID: string,
): Promise<ApplyStatusResponse> => {
  const res = await fetch(`/api/jobs/apply/status/${shortUUID}`);
  if (!res.ok)
    throw new Error(`GET /api/jobs/apply/status failed: ${res.status}`);

  const json: unknown = await res.json();
  return applyStatusResponseSchema.parse(json);
};

export const useJobApplyStatus = (shortUUID: string) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useEligibility();

  const { data, isPending } = useQuery({
    queryKey: [JOB_APPLY_STATUS_KEY, shortUUID],
    queryFn: () => fetchApplyStatus(shortUUID),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });

  const isLoading = isAuthLoading || (isAuthenticated && isPending);

  return {
    isAuthenticated,
    isAuthLoading,
    isLoading,
    status: data?.status ?? null,
    applyUrl: data && 'applyUrl' in data ? data.applyUrl : null,
    missing: data && 'missing' in data ? data.missing : null,
  };
};
