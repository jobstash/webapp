'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  type ApplyResponse,
  applyResponseSchema,
} from '@/features/jobs/apply-schemas';
import { JOB_APPLY_STATUS_KEY } from '@/features/jobs/components/job-details/use-job-apply-status';

const postApply = async (shortUUID: string): Promise<ApplyResponse> => {
  const res = await fetch('/api/jobs/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shortUUID }),
  });

  if (!res.ok) throw new Error(`POST /api/jobs/apply failed: ${res.status}`);

  const json: unknown = await res.json();
  return applyResponseSchema.parse(json);
};

export const useJobApply = (shortUUID: string) => {
  const queryClient = useQueryClient();
  const [isApplying, setIsApplying] = useState(false);

  const apply = async (): Promise<ApplyResponse> => {
    setIsApplying(true);
    try {
      const result = await postApply(shortUUID);
      await queryClient.invalidateQueries({
        queryKey: [JOB_APPLY_STATUS_KEY, shortUUID],
      });
      return result;
    } finally {
      setIsApplying(false);
    }
  };

  return { isApplying, apply };
};
