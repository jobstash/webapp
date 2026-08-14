import 'server-only';

import { cache } from 'react';

import { clientEnv } from '@/lib/env/client';
import {
  developerReportSchema,
  type DeveloperCohort,
  type DeveloperReport,
  type DeveloperReportRange,
} from '../schemas';

const fetchDeveloperReportUncached = async (
  cohort: DeveloperCohort | null = 'all',
  chain?: string,
  range: DeveloperReportRange = 'all',
): Promise<DeveloperReport | null> => {
  try {
    const search = new URLSearchParams();
    if (chain) search.set('chain', chain);
    else search.set('cohort', cohort ?? 'all');
    search.set('range', range);

    const response = await fetch(
      `${clientEnv.MW_URL}/people/developer-report?${search}`,
      { cache: 'no-store' },
    );
    if (!response.ok) return null;
    const parsed = developerReportSchema.safeParse(await response.json());
    return parsed.success && parsed.data.available ? parsed.data : null;
  } catch {
    return null;
  }
};

export const fetchDeveloperReport = cache(fetchDeveloperReportUncached);
