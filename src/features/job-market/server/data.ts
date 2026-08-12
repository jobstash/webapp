import 'server-only';

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

// React cache deduplicates calls within a render without persisting a null
// response across requests. The middleware owns the one-hour HTTP cache for
// successful data; a temporary "not ready" response must recover immediately.
export const fetchJobMarketOverview = cache(fetchJobMarketOverviewUncached);
export const fetchPillarMarket = cache(fetchPillarMarketUncached);
