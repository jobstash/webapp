import 'server-only';
import { cache } from 'react';
import { clientEnv } from '@/lib/env/client';

// The search bar searches all open jobs, not the latest-import homepage subset.
export const fetchSearchableJobCount = cache(
  async (): Promise<number | undefined> => {
    try {
      const response = await fetch(
        `${clientEnv.MW_URL}/jobs/feed?page=1&limit=1`,
        { cache: 'no-store', signal: AbortSignal.timeout(5000) },
      );
      if (!response.ok) return undefined;
      const result = await response.json();
      return Number.isSafeInteger(result.totalJobs) && result.totalJobs >= 0
        ? result.totalJobs
        : undefined;
    } catch {
      return undefined;
    }
  },
);
