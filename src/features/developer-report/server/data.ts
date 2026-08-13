import 'server-only';

import { cache } from 'react';

import { clientEnv } from '@/lib/env/client';
import {
  developerReportSchema,
  type DeveloperCohort,
  type DeveloperReport,
} from '../schemas';

const fetchDeveloperReportUncached = async (
  cohort: DeveloperCohort = 'crypto',
): Promise<DeveloperReport | null> => {
  try {
    const response = await fetch(
      `${clientEnv.MW_URL}/people/developer-report?cohort=${cohort}`,
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
