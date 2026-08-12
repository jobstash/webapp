import 'server-only';

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { z } from 'zod';

import { clientEnv } from '@/lib/env/client';
import { getApiSlug } from '@/features/pillar/constants';
import {
  jobMarketOverviewSchema,
  pillarMarketSchema,
  type JobMarketOverview,
  type PillarMarket,
} from '../schemas';

const responseSchema = <T extends z.ZodType>(data: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: data.nullish(),
  });

const fetchMarket = async <T>(
  path: string,
  schema: z.ZodType<T>,
): Promise<T | null> => {
  try {
    const response = await fetch(`${clientEnv.MW_URL}${path}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const parsed = responseSchema(schema).safeParse(await response.json());
    if (!parsed.success || !parsed.data.success || !parsed.data.data) {
      return null;
    }
    return parsed.data.data;
  } catch {
    // Market intelligence is deliberately optional: a telemetry outage must
    // never take down the home page or a pillar's jobs.
    return null;
  }
};

const fetchJobMarketOverviewUncached = () =>
  fetchMarket<JobMarketOverview>(
    '/v2/search/market/overview',
    jobMarketOverviewSchema,
  );

const fetchPillarMarketUncached = (slug: string) =>
  fetchMarket<PillarMarket>(
    `/v2/search/market/pillars/${encodeURIComponent(getApiSlug(slug))}?range=365`,
    pillarMarketSchema,
  );

const fetchJobMarketOverviewCached = unstable_cache(
  fetchJobMarketOverviewUncached,
  ['job-market-overview-v1'],
  { revalidate: 3600 },
);

const fetchPillarMarketCached = unstable_cache(
  fetchPillarMarketUncached,
  ['pillar-market-v1'],
  { revalidate: 3600 },
);

export const fetchJobMarketOverview = cache(fetchJobMarketOverviewCached);
export const fetchPillarMarket = cache(fetchPillarMarketCached);
